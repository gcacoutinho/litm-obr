import OBR from '@owlbear-rodeo/sdk'
import { Character, FellowshipThemeCardData } from './types'

const STORAGE_KEY = 'litm-obr-character'
const STORAGE_KEY_FELLOWSHIP = 'litm-obr-fellowship-theme-card'
const DEFAULT_ROOM_KEY = 'default'

type CharacterStorageMap = Record<string, Character>

/**
 * Storage error event type for error handling
 */
export type StorageErrorType = 'quota_exceeded' | 'save_failed' | 'load_failed'

export interface StorageErrorEvent {
  type: StorageErrorType
  message: string
  timestamp: number
  originalError?: unknown
}

/**
 * Callback function for storage error events
 */
type StorageErrorListener = (event: StorageErrorEvent) => void

/**
 * Set of registered error listeners
 */
const errorListeners = new Set<StorageErrorListener>()

/**
 * Register a callback to handle storage errors.
 * Returns a cleanup function to remove the listener.
 *
 * @param callback Function to call when a storage error occurs
 * @returns Cleanup function to remove the listener
 */
export function onStorageError(callback: StorageErrorListener): () => void {
  errorListeners.add(callback)
  return () => {
    errorListeners.delete(callback)
  }
}

/**
 * Emit a storage error event to all registered listeners
 */
function emitError(type: StorageErrorType, message: string, originalError?: unknown): void {
  const event: StorageErrorEvent = {
    type,
    message,
    timestamp: Date.now(),
    originalError
  }

  errorListeners.forEach(listener => {
    try {
      listener(event)
    } catch (err) {
      console.error('[litm-obr] Error listener threw:', err)
    }
  })

  // Always log to console as fallback
  console.error(`[litm-obr] Storage error (${type}):`, message, originalError)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isCharacterData(value: unknown): value is Character {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.characterName === 'string' &&
    typeof value.playerName === 'string' &&
    'backpack' in value &&
    'themeCard1' in value &&
    'themeCard4' in value
  )
}

function isCharacterMap(value: unknown): value is CharacterStorageMap {
  if (!isRecord(value)) {
    return false
  }

  if (isCharacterData(value)) {
    return false
  }

  return Object.values(value).every(entry => isCharacterData(entry))
}

async function getRoomStorageKey(): Promise<string> {
  if (!OBR.isAvailable || !OBR.isReady) {
    return DEFAULT_ROOM_KEY
  }

  try {
    return OBR.room.id
  } catch (error) {
    console.warn('[litm-obr] Failed to resolve room ID, using default key.', error)
    return DEFAULT_ROOM_KEY
  }
}

/**
 * Save character data to localStorage with error handling.
 * Emits StorageErrorEvent if save fails.
 */
export async function saveCharacter(character: Character): Promise<void> {
  const roomKey = await getRoomStorageKey()
  try {
    const serializedExisting = localStorage.getItem(STORAGE_KEY)
    let storageMap: CharacterStorageMap = {}

    if (serializedExisting !== null) {
      const parsedExisting = JSON.parse(serializedExisting) as unknown
      if (isCharacterData(parsedExisting)) {
        storageMap = { [roomKey]: parsedExisting }
      } else if (isCharacterMap(parsedExisting)) {
        storageMap = parsedExisting
      }
    }

    storageMap[roomKey] = character
    const serialized = JSON.stringify(storageMap)
    localStorage.setItem(STORAGE_KEY, serialized)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      emitError(
        'quota_exceeded',
        'Storage quota exceeded. Please clear some data and try again.',
        error
      )
    } else {
      emitError(
        'save_failed',
        'Failed to save character data. Please try again.',
        error
      )
    }
  }
}

/**
 * Load character data from localStorage with error handling.
 * Returns null if no data found or load fails.
 * Emits StorageErrorEvent if load fails.
 */
export async function loadCharacter(): Promise<Character | null> {
  const roomKey = await getRoomStorageKey()
  try {
    const serialized = localStorage.getItem(STORAGE_KEY)
    if (serialized === null) {
      return null
    }

    const parsed = JSON.parse(serialized) as unknown

    if (isCharacterData(parsed)) {
      const migratedMap: CharacterStorageMap = { [roomKey]: parsed }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedMap))
      } catch (error) {
        emitError(
          'save_failed',
          'Failed to migrate character storage data.',
          error
        )
      }
      return parsed
    }

    if (isCharacterMap(parsed)) {
      return parsed[roomKey] ?? null
    }

    return null
  } catch (error) {
    emitError(
      'load_failed',
      'Failed to load character data.',
      error
    )
    return null
  }
}

/**
 * Clear character data from localStorage with error handling.
 * Emits StorageErrorEvent if clear fails.
 */
export async function clearCharacter(): Promise<void> {
  const roomKey = await getRoomStorageKey()
  try {
    const serializedExisting = localStorage.getItem(STORAGE_KEY)
    if (serializedExisting === null) {
      return
    }

    const parsedExisting = JSON.parse(serializedExisting) as unknown
    let storageMap: CharacterStorageMap = {}

    if (isCharacterData(parsedExisting)) {
      storageMap = { [roomKey]: parsedExisting }
    } else if (isCharacterMap(parsedExisting)) {
      storageMap = parsedExisting
    }

    if (roomKey in storageMap) {
      delete storageMap[roomKey]
    }

    if (Object.keys(storageMap).length === 0) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageMap))
  } catch (error) {
    emitError(
      'save_failed',
      'Failed to clear character data.',
      error
    )
  }
}

/**
 * Save fellowship theme card data to localStorage with error handling.
 * Emits StorageErrorEvent if save fails.
 */
export function saveFellowshipThemeCard(data: FellowshipThemeCardData): void {
  try {
    const serialized = JSON.stringify(data)
    localStorage.setItem(STORAGE_KEY_FELLOWSHIP, serialized)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      emitError(
        'quota_exceeded',
        'Storage quota exceeded. Please clear some data and try again.',
        error
      )
    } else {
      emitError(
        'save_failed',
        'Failed to save fellowship theme card data. Please try again.',
        error
      )
    }
  }
}

/**
 * Load fellowship theme card data from localStorage with error handling.
 * Returns null if no data found or load fails.
 * Emits StorageErrorEvent if load fails.
 */
export function loadFellowshipThemeCard(): FellowshipThemeCardData | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY_FELLOWSHIP)
    if (serialized === null) {
      return null
    }
    const data = JSON.parse(serialized) as FellowshipThemeCardData
    return data
  } catch (error) {
    emitError(
      'load_failed',
      'Failed to load fellowship theme card data.',
      error
    )
    return null
  }
}
