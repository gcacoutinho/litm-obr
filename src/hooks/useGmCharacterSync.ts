import { useEffect, useMemo, useState } from 'react'
import { GmCharacterPayload } from '../obrd/gmTypes'
import { onGmSyncMessage, requestGmResend } from '../obrd/gmBroadcast'
import { loadGmCharacters, saveGmCharacter } from '../obrd/gmLocalStore'
import { PlayerRole } from './useObrPlayerRole'

export function useGmCharacterSync(role: PlayerRole): GmCharacterPayload[] {
  const [characters, setCharacters] = useState<Record<string, GmCharacterPayload>>({})

  useEffect(() => {
    if (role !== 'GM') {
      return
    }

    let isMounted = true
    const loadInitial = async () => {
      const stored = await loadGmCharacters()
      if (isMounted) {
        setCharacters((current) => ({ ...stored, ...current }))
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

    return onGmSyncMessage((message) => {
      if (message.type !== 'character-update') {
        return
      }

      void saveGmCharacter(message.payload).then((roomMap) => {
        setCharacters(roomMap)
      })
    })
  }, [role])

  return useMemo(() => {
    const list = Object.values(characters)
    list.sort((a, b) => {
      const nameCompare = a.playerName.localeCompare(b.playerName)
      if (nameCompare !== 0) {
        return nameCompare
      }
      return b.updatedAt - a.updatedAt
    })
    return list
  }, [characters])
}
