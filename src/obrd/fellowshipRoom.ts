import OBR from '@owlbear-rodeo/sdk'
import { FellowshipThemeCardData, createEmptyFellowshipThemeCard } from './types'
import { loadFellowshipThemeCard, saveFellowshipThemeCard } from './localStore'

const ROOM_FELLOWSHIP_METADATA_KEY = 'litm-obr.fellowshipThemeCard'
const LOCAL_UPDATED_BY = 'local'

export type FellowshipRoomPayload = {
  version: number
  updatedAt: number
  updatedBy: string
  data: FellowshipThemeCardData
}

let localVersion = 0

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isFellowshipRoomPayload(value: unknown): value is FellowshipRoomPayload {
  if (!isRecord(value)) return false
  const data = value.data
  return (
    typeof value.version === 'number' &&
    typeof value.updatedAt === 'number' &&
    typeof value.updatedBy === 'string' &&
    isRecord(data)
  )
}

function isRoomMetadataAvailable(): boolean {
  return OBR.isAvailable && OBR.isReady
}

function mergeFellowshipData(
  current: FellowshipThemeCardData,
  patch: Partial<FellowshipThemeCardData>
): FellowshipThemeCardData {
  const mergedAdvancements = patch.advancements
    ? { ...current.advancements, ...patch.advancements }
    : current.advancements

  return {
    ...current,
    ...patch,
    advancements: mergedAdvancements
  }
}

export async function loadFellowshipRoomPayload(): Promise<FellowshipRoomPayload | null> {
  if (!isRoomMetadataAvailable()) {
    const data = loadFellowshipThemeCard()
    if (!data) return null
    return {
      version: localVersion,
      updatedAt: 0,
      updatedBy: LOCAL_UPDATED_BY,
      data
    }
  }

  const metadata = await OBR.room.getMetadata()
  const payload = metadata[ROOM_FELLOWSHIP_METADATA_KEY]
  return isFellowshipRoomPayload(payload) ? payload : null
}

export async function saveFellowshipRoomPatch(
  patch: Partial<FellowshipThemeCardData>
): Promise<FellowshipRoomPayload> {
  if (!isRoomMetadataAvailable()) {
    const existing = loadFellowshipThemeCard() ?? createEmptyFellowshipThemeCard()
    const nextData = mergeFellowshipData(existing, patch)
    localVersion += 1
    saveFellowshipThemeCard(nextData)
    return {
      version: localVersion,
      updatedAt: Date.now(),
      updatedBy: LOCAL_UPDATED_BY,
      data: nextData
    }
  }

  const updatedBy = OBR.player.id
  const maxAttempts = 3
  let lastPayload: FellowshipRoomPayload | null = null

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const current = await loadFellowshipRoomPayload()
    const baseData = current?.data ?? createEmptyFellowshipThemeCard()
    const nextData = mergeFellowshipData(baseData, patch)
    const nextVersion = (current?.version ?? 0) + 1
    const nextPayload: FellowshipRoomPayload = {
      version: nextVersion,
      updatedAt: Date.now(),
      updatedBy,
      data: nextData
    }

    await OBR.room.setMetadata({ [ROOM_FELLOWSHIP_METADATA_KEY]: nextPayload })

    const confirmed = await loadFellowshipRoomPayload()
    if (confirmed?.version === nextVersion && confirmed.updatedBy === updatedBy) {
      return confirmed
    }

    lastPayload = nextPayload
  }

  return lastPayload ?? {
    version: 0,
    updatedAt: Date.now(),
    updatedBy,
    data: createEmptyFellowshipThemeCard()
  }
}

export function onFellowshipRoomPayloadChange(
  callback: (payload: FellowshipRoomPayload | null) => void
): () => void {
  if (!isRoomMetadataAvailable()) {
    return () => {}
  }

  return OBR.room.onMetadataChange((metadata) => {
    const payload = metadata[ROOM_FELLOWSHIP_METADATA_KEY]
    callback(isFellowshipRoomPayload(payload) ? payload : null)
  })
}
