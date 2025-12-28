import OBR from '@owlbear-rodeo/sdk'
import { Character, createEmptyCharacter } from './types'
import { CHARACTER_METADATA_KEY } from './constants'

export async function getMyCharacter(): Promise<Character | null> {
  try {
    const metadata = await OBR.player.getMetadata()
    const character = metadata[CHARACTER_METADATA_KEY] as Character | undefined
    console.log('[litm-obr] Character loaded:', character)
    return character || null
  } catch (error) {
    console.error('[litm-obr] LOAD FAILED:', error)
    throw error
  }
}

export async function saveMyCharacter(character: Character): Promise<void> {
  try {
    await OBR.player.setMetadata({
      [CHARACTER_METADATA_KEY]: character
    })
    console.log('[litm-obr] Character saved:', character)
  } catch (error) {
    console.error('[litm-obr] SAVE FAILED:', error)
    console.error('[litm-obr] Attempted to save:', character)
    throw error
  }
}

export { createEmptyCharacter }
