import { useEffect } from 'react'
import { Character } from '../obrd/types'
import type { GmSyncMessage } from '../obrd/gmBroadcast'
import { onGmSyncMessage, sendCharacterUpdate } from '../obrd/gmBroadcast'
import { useDebouncedCallback } from './useDebouncedCallback'
import { PlayerRole } from './useObrPlayerRole'

export function useGmSyncPlayer(character: Character | null, role: PlayerRole): void {
  const debouncedSend: (next: Character) => void = useDebouncedCallback(
    (next: Character): void => {
    void sendCharacterUpdate(next)
    },
    500
  )

  useEffect(() => {
    if (role !== 'PLAYER' || !character) {
      return
    }

    debouncedSend(character)
  }, [character, debouncedSend, role])

  useEffect(() => {
    if (role !== 'PLAYER') {
      return
    }

    return onGmSyncMessage((message: GmSyncMessage, _connectionId: string) => {
      if (message.type !== 'resend-request') {
        return
      }

      if (character) {
        void sendCharacterUpdate(character)
      }
    })
  }, [character, role])
}
