import { Character, FellowshipThemeCardData } from './types'

const STORAGE_KEY = 'litm-obr-character'
const STORAGE_KEY_FELLOWSHIP = 'litm-obr-fellowship-theme-card'

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

/**
 * Save character data to localStorage with error handling.
 * Emits StorageErrorEvent if save fails.
 */
export function saveCharacter(character: Character): void {
  try {
    const serialized = JSON.stringify(character)
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
export function loadCharacter(): Character | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY)
    if (serialized === null) {
      return null
    }
    const character = JSON.parse(serialized) as Character
    return character
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
