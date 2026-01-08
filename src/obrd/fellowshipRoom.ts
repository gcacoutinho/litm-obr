import OBR from '@owlbear-rodeo/sdk'
import { FellowshipThemeCardData, createEmptyFellowshipThemeCard } from './types'
import { loadFellowshipThemeCard, saveFellowshipThemeCard } from './localStore'

const ROOM_FELLOWSHIP_METADATA_KEY: string = 'litm-obr.fellowshipThemeCard'
const LOCAL_UPDATED_BY: string = 'local'

export type FellowshipRoomPayload = {
  version: number
  updatedAt: number
  updatedBy: string
  data: FellowshipThemeCardData
}

let localVersion: number = 0

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isFellowshipRoomPayload(value: unknown): value is FellowshipRoomPayload {
  if (!isRecord(value)) return false
  const data: unknown = value.data
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
  const mergedAdvancements: FellowshipThemeCardData['advancements'] = patch.advancements
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
    const data: FellowshipThemeCardData | null = loadFellowshipThemeCard()
    if (!data) return null
    return {
      version: localVersion,
      updatedAt: 0,
      updatedBy: LOCAL_UPDATED_BY,
      data
    }
  }

  const metadata: Record<string, unknown> = await OBR.room.getMetadata()
  const payload: unknown = metadata[ROOM_FELLOWSHIP_METADATA_KEY]
  return isFellowshipRoomPayload(payload) ? payload : null
}

export async function saveFellowshipRoomPatch(
  patch: Partial<FellowshipThemeCardData>
): Promise<FellowshipRoomPayload> {
  if (!isRoomMetadataAvailable()) {
    const existing: FellowshipThemeCardData =
      loadFellowshipThemeCard() ?? createEmptyFellowshipThemeCard()
    const nextData: FellowshipThemeCardData = mergeFellowshipData(existing, patch)
    localVersion += 1
    saveFellowshipThemeCard(nextData)
    return {
      version: localVersion,
      updatedAt: Date.now(),
      updatedBy: LOCAL_UPDATED_BY,
      data: nextData
    }
  }

  const updatedBy: string = OBR.player.id
  const maxAttempts: number = 3
  let lastPayload: FellowshipRoomPayload | null = null

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const current: FellowshipRoomPayload | null = await loadFellowshipRoomPayload()
    const baseData: FellowshipThemeCardData = current?.data ?? createEmptyFellowshipThemeCard()
    const nextData: FellowshipThemeCardData = mergeFellowshipData(baseData, patch)
    const nextVersion: number = (current?.version ?? 0) + 1
    const nextPayload: FellowshipRoomPayload = {
      version: nextVersion,
      updatedAt: Date.now(),
      updatedBy,
      data: nextData
    }

    await OBR.room.setMetadata({ [ROOM_FELLOWSHIP_METADATA_KEY]: nextPayload })

    const confirmed: FellowshipRoomPayload | null = await loadFellowshipRoomPayload()
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

  return OBR.room.onMetadataChange((metadata: Record<string, unknown>) => {
    const payload: unknown = metadata[ROOM_FELLOWSHIP_METADATA_KEY]
    callback(isFellowshipRoomPayload(payload) ? payload : null)
  })
}
