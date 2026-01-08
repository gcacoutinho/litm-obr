import { useEffect, useMemo, useState } from 'react'
import { GmCharacterPayload } from '../obrd/gmTypes'
import type { GmSyncMessage } from '../obrd/gmBroadcast'
import { onGmSyncMessage, requestGmResend } from '../obrd/gmBroadcast'
import { loadGmCharacters, saveGmCharacter } from '../obrd/gmLocalStore'
import { PlayerRole } from './useObrPlayerRole'

export function useGmCharacterSync(role: PlayerRole): GmCharacterPayload[] {
  const [characters, setCharacters] = useState<Record<string, GmCharacterPayload>>({})

  useEffect(() => {
    if (role !== 'GM') {
      return
    }

    let isMounted: boolean = true
    const loadInitial = async (): Promise<void> => {
      const stored: Record<string, GmCharacterPayload> = await loadGmCharacters()
      if (isMounted) {
        setCharacters((current: Record<string, GmCharacterPayload>) => ({ ...stored, ...current }))
      }
    }

    void loadInitial()
    void requestGmResend()

    return () => {
      isMounted = false
    }
  }, [role])

  useEffect(() => {
    if (role !== 'GM') {
      return
    }

    return onGmSyncMessage((message: GmSyncMessage, _connectionId: string) => {
      if (message.type !== 'character-update') {
        return
      }

      void saveGmCharacter(message.payload).then((roomMap: Record<string, GmCharacterPayload>) => {
        setCharacters(roomMap)
      })
    })
  }, [role])

  return useMemo<GmCharacterPayload[]>(() => {
    const list: GmCharacterPayload[] = Object.values(characters)
    list.sort((a: GmCharacterPayload, b: GmCharacterPayload) => {
      const nameCompare: number = a.playerName.localeCompare(b.playerName)
      if (nameCompare !== 0) {
        return nameCompare
      }
      return b.updatedAt - a.updatedAt
    })
    return list
  }, [characters])
}
