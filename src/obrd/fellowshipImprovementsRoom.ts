import OBR from '@owlbear-rodeo/sdk'
import { migrateCharacter } from './types'
import { getMyCharacter, saveMyCharacter } from './playerMetadata'

const ROOM_FELLOWSHIP_IMPROVEMENTS_METADATA_KEY = 'litm-obr.fellowshipSpecialImprovements'
const DEFAULT_IMPROVEMENTS = Array(10).fill('')
const LOCAL_UPDATED_BY = 'local'

export type FellowshipImprovementsPayload = {
  version: number
  updatedAt: number
  updatedBy: string
  data: string[]
}

let localVersion = 0

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string')
}

function isFellowshipImprovementsPayload(
  value: unknown
): value is FellowshipImprovementsPayload {
  if (!isRecord(value)) return false
  return (
    typeof value.version === 'number' &&
    typeof value.updatedAt === 'number' &&
    typeof value.updatedBy === 'string' &&
    isStringArray(value.data)
  )
}

function isRoomMetadataAvailable(): boolean {
  return OBR.isAvailable && OBR.isReady
}

function normalizeImprovements(value: string[] | null | undefined): string[] {
  if (!Array.isArray(value)) {
    return [...DEFAULT_IMPROVEMENTS]
  }

  const trimmed = value.slice(0, DEFAULT_IMPROVEMENTS.length)
  if (trimmed.length < DEFAULT_IMPROVEMENTS.length) {
    return trimmed.concat(Array(DEFAULT_IMPROVEMENTS.length - trimmed.length).fill(''))
  }

  return trimmed
}

function normalizePayload(payload: FellowshipImprovementsPayload): FellowshipImprovementsPayload {
  return {
    ...payload,
    data: normalizeImprovements(payload.data)
  }
}

export async function loadFellowshipImprovementsPayload(): Promise<FellowshipImprovementsPayload | null> {
  if (!isRoomMetadataAvailable()) {
    const data = await getMyCharacter()
    const character = migrateCharacter(data)
    return {
      version: localVersion,
      updatedAt: 0,
      updatedBy: LOCAL_UPDATED_BY,
      data: normalizeImprovements(character.specialImprovements)
    }
  }

  const metadata = await OBR.room.getMetadata()
  const payload = metadata[ROOM_FELLOWSHIP_IMPROVEMENTS_METADATA_KEY]
  return isFellowshipImprovementsPayload(payload) ? normalizePayload(payload) : null
}

export async function saveFellowshipImprovements(
  improvements: string[]
): Promise<FellowshipImprovementsPayload> {
  const normalized = normalizeImprovements(improvements)

  if (!isRoomMetadataAvailable()) {
    const data = await getMyCharacter()
    const character = migrateCharacter(data)
    const updatedCharacter = {
      ...character,
      specialImprovements: normalized
    }
    localVersion += 1
    await saveMyCharacter(updatedCharacter)
    return {
      version: localVersion,
      updatedAt: Date.now(),
      updatedBy: LOCAL_UPDATED_BY,
      data: normalized
    }
  }

  const updatedBy = OBR.player.id
  const maxAttempts = 3
  let lastPayload: FellowshipImprovementsPayload | null = null

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const current = await loadFellowshipImprovementsPayload()
    const nextVersion = (current?.version ?? 0) + 1
    const nextPayload: FellowshipImprovementsPayload = {
      version: nextVersion,
      updatedAt: Date.now(),
      updatedBy,
      data: normalized
    }

    await OBR.room.setMetadata({ [ROOM_FELLOWSHIP_IMPROVEMENTS_METADATA_KEY]: nextPayload })

    const confirmed = await loadFellowshipImprovementsPayload()
    if (confirmed?.version === nextVersion && confirmed.updatedBy === updatedBy) {
      return confirmed
    }

    lastPayload = nextPayload
  }

  return lastPayload ?? {
    version: 0,
    updatedAt: Date.now(),
    updatedBy,
    data: normalized
  }
}

export function onFellowshipImprovementsChange(
  callback: (payload: FellowshipImprovementsPayload | null) => void
): () => void {
  if (!isRoomMetadataAvailable()) {
    return () => {}
  }

  return OBR.room.onMetadataChange((metadata) => {
    const payload = metadata[ROOM_FELLOWSHIP_IMPROVEMENTS_METADATA_KEY]
    callback(isFellowshipImprovementsPayload(payload) ? normalizePayload(payload) : null)
  })
}
