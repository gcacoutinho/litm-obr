import { useEffect, useState } from 'react'
import OBR from '@owlbear-rodeo/sdk'

export type PlayerRole = 'GM' | 'PLAYER' | 'UNKNOWN'

export function useObrPlayerRole(): PlayerRole {
  const initialRole: PlayerRole = OBR.isAvailable ? 'UNKNOWN' : 'PLAYER'
  const [role, setRole] = useState<PlayerRole>(initialRole)

  useEffect(() => {
    if (!OBR.isAvailable) {
      return
    }

    let isMounted = true

    const resolveRole = async () => {
      try {
        const nextRole = await OBR.player.getRole()
        if (isMounted) {
          setRole(nextRole)
        }
      } catch (error) {
        console.warn('[litm-obr] Failed to resolve player role.', error)
        if (isMounted) {
          setRole('PLAYER')
        }
      }
    }

    void resolveRole()

    const unsubscribe = OBR.player.onChange((player) => {
      if (isMounted) {
        setRole(player.role)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  return role
}
