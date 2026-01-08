import OBR from '@owlbear-rodeo/sdk'
import { Character } from './types'
import { GmCharacterPayload, normalizeGmCharacterPayload } from './gmTypes'

const GM_SYNC_CHANNEL = 'litm-obr.gm-sync'

export type GmSyncMessage =
  | { type: 'character-update'; payload: GmCharacterPayload }
  | { type: 'resend-request'; requesterId: string }

let localVersion = 0

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isResendRequest(value: unknown): value is { type: 'resend-request'; requesterId: string } {
  if (!isRecord(value)) {
    return false
  }

  return value.type === 'resend-request' && typeof value.requesterId === 'string'
}

async function resolvePlayerName(fallback: string): Promise<string> {
  const trimmed = fallback.trim()
  if (trimmed.length > 0) {
    return trimmed
  }

  if (!OBR.isAvailable || !OBR.isReady) {
    return fallback
  }

  try {
    return await OBR.player.getName()
  } catch (error) {
    console.warn('[litm-obr] Failed to resolve player name for GM sync.', error)
    return fallback
  }
}

export async function sendCharacterUpdate(character: Character): Promise<void> {
  if (!OBR.isAvailable || !OBR.isReady) {
    return
  }

  const playerId = OBR.player.id
  const playerName = await resolvePlayerName(character.playerName)
  localVersion += 1

  const payload: GmCharacterPayload = {
    playerId,
    playerName,
    updatedAt: Date.now(),
    version: localVersion,
    character
  }

  await OBR.broadcast.sendMessage(
    GM_SYNC_CHANNEL,
    { type: 'character-update', payload },
    { destination: 'REMOTE' }
  )
}

export async function requestGmResend(): Promise<void> {
  if (!OBR.isAvailable || !OBR.isReady) {
    return
  }

  await OBR.broadcast.sendMessage(
    GM_SYNC_CHANNEL,
    { type: 'resend-request', requesterId: OBR.player.id },
    { destination: 'REMOTE' }
  )
}

export function onGmSyncMessage(
  callback: (message: GmSyncMessage, connectionId: string) => void
): () => void {
  if (!OBR.isAvailable || !OBR.isReady) {
    return () => {}
  }

  return OBR.broadcast.onMessage(GM_SYNC_CHANNEL, (event) => {
    const data = event.data
    if (isResendRequest(data)) {
      callback(data, event.connectionId)
      return
    }

    if (isRecord(data) && data.type === 'character-update') {
      const normalized = normalizeGmCharacterPayload(data.payload)
      if (normalized) {
        callback({ type: 'character-update', payload: normalized }, event.connectionId)
      }
    }
  })
}
