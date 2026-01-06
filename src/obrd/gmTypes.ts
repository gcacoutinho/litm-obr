import { Character, migrateCharacter } from './types'

export type GmCharacterPayload = {
  playerId: string
  playerName: string
  updatedAt: number
  version: number
  character: Character
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function normalizeGmCharacterPayload(value: unknown): GmCharacterPayload | null {
  if (!isRecord(value)) {
    return null
  }

  const playerId = value.playerId
  const playerName = value.playerName
  const updatedAt = value.updatedAt
  const version = value.version

  if (
    typeof playerId !== 'string' ||
    typeof playerName !== 'string' ||
    typeof updatedAt !== 'number' ||
    typeof version !== 'number'
  ) {
    return null
  }

  return {
    playerId,
    playerName,
    updatedAt,
    version,
    character: migrateCharacter(value.character)
  }
}
