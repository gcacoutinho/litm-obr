import { useEffect, useMemo, useState } from 'react'
import type { Player } from '@owlbear-rodeo/sdk'
import { GmCharacterPayload } from '../obrd/gmTypes'
import type { GmSyncMessage } from '../obrd/gmBroadcast'
import { onGmSyncMessage, requestGmResend } from '../obrd/gmBroadcast'
import { loadGmCharacters, pruneGmCharacters, saveGmCharacter } from '../obrd/gmLocalStore'
import { getPartyPlayers, onPartyPlayersChange } from '../obrd/party'
import { PlayerRole } from './useObrPlayerRole'

export function useGmCharacterSync(role: PlayerRole): GmCharacterPayload[] {
  const [characters, setCharacters] = useState<Record<string, GmCharacterPayload>>({})
  const [partyPlayers, setPartyPlayers] = useState<Player[] | null>(null)
  const activePlayerIds = useMemo<string[] | null>(() => {
    if (role !== 'GM' || !partyPlayers) {
      return null
    }
    return partyPlayers.map((player) => player.id)
  }, [partyPlayers, role])

  useEffect(() => {
    if (role !== 'GM') {
      return
    }

    let isMounted: boolean = true

    const loadPlayers = async (): Promise<void> => {
      const nextPlayers: Player[] | null = await getPartyPlayers()
      if (isMounted && nextPlayers) {
        setPartyPlayers(nextPlayers)
      }
    }

    void loadPlayers()

    const unsubscribe = onPartyPlayersChange((nextPlayers: Player[]) => {
      if (isMounted) {
        setPartyPlayers(nextPlayers)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [role])

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
    if (role !== 'GM' || !activePlayerIds) {
      return
    }

    let isMounted: boolean = true
    const prune = async (): Promise<void> => {
      const roomMap: Record<string, GmCharacterPayload> =
        await pruneGmCharacters(activePlayerIds)
      if (isMounted) {
        setCharacters(roomMap)
      }
    }

    void prune()

    return () => {
      isMounted = false
    }
  }, [activePlayerIds, role])

  useEffect(() => {
    if (role !== 'GM') {
      return
    }

    return onGmSyncMessage((message: GmSyncMessage) => {
      if (message.type !== 'character-update') {
        return
      }

      void saveGmCharacter(message.payload).then((roomMap: Record<string, GmCharacterPayload>) => {
        if (activePlayerIds && !activePlayerIds.includes(message.payload.playerId)) {
          void pruneGmCharacters(activePlayerIds).then((prunedMap: Record<string, GmCharacterPayload>) => {
            setCharacters(prunedMap)
          })
          return
        }

        setCharacters(roomMap)
      })
    })
  }, [activePlayerIds, role])

  return useMemo<GmCharacterPayload[]>(() => {
    const list: GmCharacterPayload[] = Object.values(characters)
    if (activePlayerIds) {
      const activeSet: Set<string> = new Set(activePlayerIds)
      const filtered: GmCharacterPayload[] = list.filter((entry: GmCharacterPayload) => {
        return activeSet.has(entry.playerId)
      })
      filtered.sort((a: GmCharacterPayload, b: GmCharacterPayload) => {
        const nameCompare: number = a.playerName.localeCompare(b.playerName)
        if (nameCompare !== 0) {
          return nameCompare
        }
        return b.updatedAt - a.updatedAt
      })
      return filtered
    }

    list.sort((a: GmCharacterPayload, b: GmCharacterPayload) => {
      const nameCompare: number = a.playerName.localeCompare(b.playerName)
      if (nameCompare !== 0) {
        return nameCompare
      }
      return b.updatedAt - a.updatedAt
    })
    return list
  }, [activePlayerIds, characters])
}
