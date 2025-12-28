import { Character, createEmptyCharacter } from './types'
import { loadCharacter, saveCharacter } from './localStore'

export async function getMyCharacter(): Promise<Character | null> {
  return loadCharacter()
}

export async function saveMyCharacter(character: Character): Promise<void> {
  saveCharacter(character)
}

export { createEmptyCharacter }
