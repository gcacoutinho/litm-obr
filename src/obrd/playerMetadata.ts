import { Character, FellowshipThemeCardData } from './types'
import {
  loadCharacter,
  saveCharacter,
  loadFellowshipThemeCard,
  saveFellowshipThemeCard,
  clearCharacter
} from './localStore'
import {
  clearMyCharacterFromRoom,
  loadMyCharacterFromRoom,
  onMyCharacterRoomSnapshotChange,
  saveMyCharacterToRoom,
  CharacterRoomSnapshot
} from './characterRoom'

export async function getMyCharacter(): Promise<Character | null> {
  const roomCharacter: Character | null = await loadMyCharacterFromRoom()
  if (roomCharacter) {
    await saveCharacter(roomCharacter)
    return roomCharacter
  }

  return await loadCharacter()
}

export async function saveMyCharacter(character: Character): Promise<void> {
  await saveCharacter(character)
  await saveMyCharacterToRoom(character)
}

export async function clearMyCharacter(): Promise<void> {
  await clearCharacter()
  await clearMyCharacterFromRoom()
}

export function onMyCharacterRoomChange(
  callback: (snapshot: CharacterRoomSnapshot | null) => void
): () => void {
  return onMyCharacterRoomSnapshotChange(callback)
}

export async function getMyFellowshipThemeCard(): Promise<FellowshipThemeCardData | null> {
  return loadFellowshipThemeCard()
}

export async function saveMyFellowshipThemeCard(data: FellowshipThemeCardData): Promise<void> {
  saveFellowshipThemeCard(data)
}
