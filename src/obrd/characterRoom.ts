import OBR from '@owlbear-rodeo/sdk'
import { Character, migrateCharacter } from './types'

const ROOM_CHARACTER_METADATA_PREFIX: string = 'com.litm-obr/characters/'

export type CharacterRoomEntry = {
  updatedAt: number
  gzip: string
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
    typeof value.updatedAt === 'number' &&
    typeof value.gzip === 'string'
  )
}

function isRoomMetadataAvailable(): boolean {
  return OBR.isAvailable && OBR.isReady
}

function buildCharacterKey(ownerId: string): string {
  return `${ROOM_CHARACTER_METADATA_PREFIX}${ownerId}`
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
    const input = new Blob([value]).stream()
    const compressedStream = input.pipeThrough(new CompressionStream('gzip'))
    const buffer = await new Response(compressedStream).arrayBuffer()
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

async function loadCharacterRoomEntry(ownerId: string): Promise<CharacterRoomEntry | null> {
  if (!isRoomMetadataAvailable()) {
    return null
  }

  const metadata: Record<string, unknown> = await OBR.room.getMetadata()
  const entry: unknown = metadata[buildCharacterKey(ownerId)]
  return isCharacterRoomEntry(entry) ? entry : null
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

  const ownerId: string = OBR.player.id
  const entry: CharacterRoomEntry | null = await loadCharacterRoomEntry(ownerId)
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
  const metadataKey: string = buildCharacterKey(ownerId)
  const maxAttempts: number = 3

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const now: number = Date.now()
    const entry: CharacterRoomEntry = {
      updatedAt: now,
      gzip: compressed
    }

    await OBR.room.setMetadata({ [metadataKey]: entry })

    const confirmed: CharacterRoomEntry | null = await loadCharacterRoomEntry(ownerId)
    if (confirmed?.updatedAt === entry.updatedAt && confirmed.gzip === entry.gzip) {
      return
    }
  }
}

export async function clearMyCharacterFromRoom(): Promise<void> {
  if (!isRoomMetadataAvailable()) {
    return
  }

  const ownerId: string = OBR.player.id
  const metadataKey: string = buildCharacterKey(ownerId)
  await OBR.room.setMetadata({ [metadataKey]: null })
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
      const entry: unknown = metadata[buildCharacterKey(ownerId)]
      if (!isCharacterRoomEntry(entry)) {
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
