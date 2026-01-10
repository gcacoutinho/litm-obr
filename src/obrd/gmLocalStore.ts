import OBR from '@owlbear-rodeo/sdk'
import { GmCharacterPayload, normalizeGmCharacterPayload } from './gmTypes'

const STORAGE_KEY: string = 'litm-obr-gm-characters'
const DEFAULT_ROOM_KEY: string = 'default'

type GmCharacterRoomMap = Record<string, GmCharacterPayload>
type GmCharacterStorageMap = Record<string, GmCharacterRoomMap>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

async function getRoomStorageKey(): Promise<string> {
  if (!OBR.isAvailable || !OBR.isReady) {
    return DEFAULT_ROOM_KEY
  }

  try {
    return OBR.room.id
  } catch (error: unknown) {
    console.warn('[litm-obr] Failed to resolve room ID for GM storage.', error)
    return DEFAULT_ROOM_KEY
  }
}

function parseStorageMap(value: unknown): GmCharacterStorageMap {
  if (!isRecord(value)) {
    return {}
  }

  const storageMap: GmCharacterStorageMap = {}

  Object.entries(value).forEach(([roomId, roomValue]: [string, unknown]) => {
    if (!isRecord(roomValue)) {
      return
    }

    const roomMap: GmCharacterRoomMap = {}
    Object.entries(roomValue).forEach(([playerId, payloadValue]: [string, unknown]) => {
      const normalized: GmCharacterPayload | null = normalizeGmCharacterPayload(payloadValue)
      if (normalized) {
        roomMap[playerId] = normalized
      }
    })

    if (Object.keys(roomMap).length > 0) {
      storageMap[roomId] = roomMap
    }
  })

  return storageMap
}

async function loadAllRooms(): Promise<GmCharacterStorageMap> {
  try {
    const serialized: string | null = localStorage.getItem(STORAGE_KEY)
    if (!serialized) {
      return {}
    }

    const parsed: unknown = JSON.parse(serialized)
    return parseStorageMap(parsed)
  } catch (error: unknown) {
    console.error('[litm-obr] Failed to load GM character storage.', error)
    return {}
  }
}

async function saveAllRooms(storageMap: GmCharacterStorageMap): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageMap))
  } catch (error: unknown) {
    console.error('[litm-obr] Failed to save GM character storage.', error)
  }
}

export async function loadGmCharacters(): Promise<GmCharacterRoomMap> {
  const roomKey: string = await getRoomStorageKey()
  const storageMap: GmCharacterStorageMap = await loadAllRooms()
  return storageMap[roomKey] ?? {}
}

export async function saveGmCharacter(
  payload: GmCharacterPayload
): Promise<GmCharacterRoomMap> {
  const roomKey: string = await getRoomStorageKey()
  const storageMap: GmCharacterStorageMap = await loadAllRooms()
  const roomMap: GmCharacterRoomMap = storageMap[roomKey] ?? {}

  roomMap[payload.playerId] = payload
  storageMap[roomKey] = roomMap
  await saveAllRooms(storageMap)

  return roomMap
}

export async function pruneGmCharacters(activePlayerIds: string[]): Promise<GmCharacterRoomMap> {
  const roomKey: string = await getRoomStorageKey()
  const storageMap: GmCharacterStorageMap = await loadAllRooms()
  const roomMap: GmCharacterRoomMap = storageMap[roomKey] ?? {}
  const activeIds: Set<string> = new Set(activePlayerIds)

  let changed: boolean = false
  Object.keys(roomMap).forEach((playerId: string) => {
    if (!activeIds.has(playerId)) {
      delete roomMap[playerId]
      changed = true
    }
  })

  if (changed) {
    if (Object.keys(roomMap).length > 0) {
      storageMap[roomKey] = roomMap
    } else {
      delete storageMap[roomKey]
    }
    await saveAllRooms(storageMap)
  }

  return roomMap
}
