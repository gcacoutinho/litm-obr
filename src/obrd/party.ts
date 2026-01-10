import OBR from '@owlbear-rodeo/sdk'
import type { Player } from '@owlbear-rodeo/sdk'

function isSdkReady(): boolean {
  return OBR.isAvailable && OBR.isReady
}

export async function getPartyPlayers(): Promise<Player[] | null> {
  if (!isSdkReady()) {
    return null
  }

  try {
    return await OBR.party.getPlayers()
  } catch (error: unknown) {
    console.warn('[litm-obr] Failed to resolve party players.', error)
    return null
  }
}

export function onPartyPlayersChange(callback: (players: Player[]) => void): () => void {
  if (!isSdkReady()) {
    return () => {}
  }

  return OBR.party.onChange(callback)
}
