import { Character, FellowshipThemeCardData, createEmptyCharacter } from './types'
import {
  loadCharacter,
  saveCharacter,
  loadFellowshipThemeCard,
  saveFellowshipThemeCard,
  clearCharacter
} from './localStore'

export async function getMyCharacter(): Promise<Character | null> {
  return await loadCharacter()
}

export async function saveMyCharacter(character: Character): Promise<void> {
  await saveCharacter(character)
}

export async function clearMyCharacter(): Promise<void> {
  await clearCharacter()
}

export async function getMyFellowshipThemeCard(): Promise<FellowshipThemeCardData | null> {
  return loadFellowshipThemeCard()
}

export async function saveMyFellowshipThemeCard(data: FellowshipThemeCardData): Promise<void> {
  saveFellowshipThemeCard(data)
}

export { createEmptyCharacter }
