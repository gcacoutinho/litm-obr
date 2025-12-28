import { Character } from './types'

const STORAGE_KEY = 'litm-obr-character'

export function saveCharacter(character: Character): void {
  try {
    const serialized = JSON.stringify(character)
    localStorage.setItem(STORAGE_KEY, serialized)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      alert('[litm-obr] Storage quota exceeded. Your character data could not be saved.')
      console.error('[litm-obr] SAVE FAILED: QuotaExceededError', error)
    } else {
      console.error('[litm-obr] SAVE FAILED:', error)
      console.error('[litm-obr] Attempted to save:', character)
    }
  }
}

export function loadCharacter(): Character | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY)
    if (serialized === null) {
      return null
    }
    const character = JSON.parse(serialized) as Character
    return character
  } catch (error) {
    console.error('[litm-obr] LOAD FAILED:', error)
    return null
  }
}
