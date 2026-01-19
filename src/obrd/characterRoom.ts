import OBR from '@owlbear-rodeo/sdk'
import { Character, migrateCharacter } from './types'

const ROOM_CHARACTER_METADATA_KEY: string = 'litm-obr.characters'

export type CharacterRoomEntry = {
  ownerId: string
  updatedAt: number
  gzip: string
}

export type CharacterRoomPayload = {
  version: number
  updatedAt: number
  updatedBy: string
  entries: Record<string, CharacterRoomEntry>
}

export type CharacterRoomSnapshot = {
  entry: CharacterRoomEntry
  character: Character
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isCharacterRoomEntry(value: unknown): value is CharacterRoomEntry {
  if (!isRecord(value)) return false
  return (
    typeof value.ownerId === 'string' &&
    typeof value.updatedAt === 'number' &&
    typeof value.gzip === 'string'
  )
}

function isCharacterRoomPayload(value: unknown): value is CharacterRoomPayload {
  if (!isRecord(value)) return false
  const entries: unknown = value.entries
  if (!isRecord(entries)) return false

  return (
    typeof value.version === 'number' &&
    typeof value.updatedAt === 'number' &&
    typeof value.updatedBy === 'string' &&
    Object.values(entries).every((entry: unknown) => isCharacterRoomEntry(entry))
  )
}

function isRoomMetadataAvailable(): boolean {
  return OBR.isAvailable && OBR.isReady
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }
  return btoa(binary)
}

function base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes as Uint8Array<ArrayBuffer>
}

async function gzipString(value: string): Promise<string | null> {
  if (typeof CompressionStream === 'undefined') {
    console.warn('[litm-obr] CompressionStream not available for gzip.')
    return null
  }

  try {
    const stream = new CompressionStream('gzip')
    const writer = stream.writable.getWriter()
    await writer.write(new TextEncoder().encode(value))
    await writer.close()
    const buffer = await new Response(stream.readable).arrayBuffer()
    return bytesToBase64(new Uint8Array(buffer))
  } catch (error: unknown) {
    console.error('[litm-obr] Failed to gzip character data.', error)
    return null
  }
}

async function gunzipString(base64: string): Promise<string | null> {
  if (typeof DecompressionStream === 'undefined') {
    console.warn('[litm-obr] DecompressionStream not available for gzip.')
    return null
  }

  try {
    const stream = new DecompressionStream('gzip')
    const writer = stream.writable.getWriter()
    await writer.write(base64ToBytes(base64))
    await writer.close()
    const buffer = await new Response(stream.readable).arrayBuffer()
    return new TextDecoder().decode(buffer)
  } catch (error: unknown) {
    console.error('[litm-obr] Failed to gunzip character data.', error)
    return null
  }
}

async function loadCharacterRoomPayload(): Promise<CharacterRoomPayload | null> {
  if (!isRoomMetadataAvailable()) {
    return null
  }

  const metadata: Record<string, unknown> = await OBR.room.getMetadata()
  const payload: unknown = metadata[ROOM_CHARACTER_METADATA_KEY]
  return isCharacterRoomPayload(payload) ? payload : null
}

async function parseRoomEntry(entry: CharacterRoomEntry): Promise<Character | null> {
  const json: string | null = await gunzipString(entry.gzip)
  if (!json) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(json)
    return migrateCharacter(parsed)
  } catch (error: unknown) {
    console.error('[litm-obr] Failed to parse character JSON from room.', error)
    return null
  }
}

export async function loadMyCharacterFromRoom(): Promise<Character | null> {
  if (!isRoomMetadataAvailable()) {
    return null
  }

  const payload: CharacterRoomPayload | null = await loadCharacterRoomPayload()
  if (!payload) {
    return null
  }

  const ownerId: string = OBR.player.id
  const entry: CharacterRoomEntry | undefined = payload.entries[ownerId]
  if (!entry) {
    return null
  }

  return parseRoomEntry(entry)
}

export async function saveMyCharacterToRoom(character: Character): Promise<void> {
  if (!isRoomMetadataAvailable()) {
    return
  }

  const compressed: string | null = await gzipString(JSON.stringify(character))
  if (!compressed) {
    return
  }

  const ownerId: string = OBR.player.id
  const updatedBy: string = ownerId
  const maxAttempts: number = 3
  let lastPayload: CharacterRoomPayload | null = null

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const current: CharacterRoomPayload | null = await loadCharacterRoomPayload()
    const entries: Record<string, CharacterRoomEntry> = {
      ...(current?.entries ?? {})
    }
    const now: number = Date.now()
    entries[ownerId] = {
      ownerId,
      updatedAt: now,
      gzip: compressed
    }

    const nextPayload: CharacterRoomPayload = {
      version: (current?.version ?? 0) + 1,
      updatedAt: now,
      updatedBy,
      entries
    }

    await OBR.room.setMetadata({ [ROOM_CHARACTER_METADATA_KEY]: nextPayload })

    const confirmed: CharacterRoomPayload | null = await loadCharacterRoomPayload()
    if (confirmed?.version === nextPayload.version && confirmed.updatedBy === updatedBy) {
      return
    }

    lastPayload = nextPayload
  }

  if (lastPayload) {
    console.warn('[litm-obr] Failed to confirm room character metadata update.')
  }
}

export async function clearMyCharacterFromRoom(): Promise<void> {
  if (!isRoomMetadataAvailable()) {
    return
  }

  const ownerId: string = OBR.player.id
  const current: CharacterRoomPayload | null = await loadCharacterRoomPayload()
  if (!current || !(ownerId in current.entries)) {
    return
  }

  const entries: Record<string, CharacterRoomEntry> = { ...current.entries }
  delete entries[ownerId]

  const nextPayload: CharacterRoomPayload = {
    version: current.version + 1,
    updatedAt: Date.now(),
    updatedBy: ownerId,
    entries
  }

  await OBR.room.setMetadata({ [ROOM_CHARACTER_METADATA_KEY]: nextPayload })
}

export function onMyCharacterRoomSnapshotChange(
  callback: (snapshot: CharacterRoomSnapshot | null) => void
): () => void {
  if (!OBR.isAvailable) {
    return () => {}
  }

  let unsubscribe: () => void = () => {}
  let cancelled: boolean = false

  const attachListener = (): void => {
    if (cancelled || !isRoomMetadataAvailable()) {
      return
    }

    const ownerId: string = OBR.player.id

    unsubscribe = OBR.room.onMetadataChange((metadata: Record<string, unknown>) => {
      const payload: unknown = metadata[ROOM_CHARACTER_METADATA_KEY]
      if (!isCharacterRoomPayload(payload)) {
        callback(null)
        return
      }

      const entry: CharacterRoomEntry | undefined = payload.entries[ownerId]
      if (!entry) {
        callback(null)
        return
      }

      void (async (): Promise<void> => {
        const character: Character | null = await parseRoomEntry(entry)
        if (!character) {
          callback(null)
          return
        }

        callback({ entry, character })
      })()
    })
  }

  if (OBR.isReady) {
    attachListener()
  } else {
    OBR.onReady(() => {
      attachListener()
    })
  }

  return () => {
    cancelled = true
    unsubscribe()
  }
}
