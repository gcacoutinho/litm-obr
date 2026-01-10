import { useState, useEffect, useCallback, useRef } from 'react'
import { FellowshipThemeCardData, createEmptyFellowshipThemeCard } from '../obrd/types'
import type { FellowshipRoomPayload } from '../obrd/fellowshipRoom'
import {
  loadFellowshipRoomPayload,
  onFellowshipRoomPayloadChange,
  saveFellowshipRoomPatch
} from '../obrd/fellowshipRoom'

type UseFellowshipThemeCardStorageResult = {
  fellowshipData: FellowshipThemeCardData | null
  updateFellowshipData: (updates: Partial<FellowshipThemeCardData>) => void
}

/**
 * Hook for managing fellowship theme card data storage with debounced saves.
 * Loads fellowship data on mount and provides update function with 500ms debounce.
 *
 * @returns Object with fellowshipData and updateFellowshipData callback
 *
 * @example
 * const { fellowshipData, updateFellowshipData } = useFellowshipThemeCardStorage()
 *
 * // Update fellowship data and it will save after 500ms of inactivity
 * updateFellowshipData({ weaknessTags: ['New Tag'] })
 */
export function useFellowshipThemeCardStorage(): UseFellowshipThemeCardStorageResult {
  const [fellowshipData, setFellowshipData] = useState<FellowshipThemeCardData | null>(null)
  const saveTimeoutRef = useRef<number | undefined>(undefined)
  const versionRef = useRef<number>(0)

  // Load fellowship data on mount
  useEffect(() => {
    const loadFellowshipData = async (): Promise<void> => {
      try {
        const payload: FellowshipRoomPayload | null = await loadFellowshipRoomPayload()
        if (payload) {
          versionRef.current = payload.version
          setFellowshipData(payload.data)
        } else {
          setFellowshipData(createEmptyFellowshipThemeCard())
        }
      } catch (error: unknown) {
        console.error('[litm-obr] Failed to load fellowship theme card data:', error)
        setFellowshipData(createEmptyFellowshipThemeCard())
      }
    }

    loadFellowshipData()
  }, [])

  useEffect(() => {
    const unsubscribe: () => void = onFellowshipRoomPayloadChange((payload: FellowshipRoomPayload | null) => {
      if (!payload) {
        return
      }

      if (payload.version <= versionRef.current) {
        return
      }

      versionRef.current = payload.version
      setFellowshipData(payload.data)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  // Debounced save (500ms)
  const updateFellowshipData = useCallback((updates: Partial<FellowshipThemeCardData>): void => {
    setFellowshipData((prevData: FellowshipThemeCardData | null): FellowshipThemeCardData | null => {
      if (!prevData) return prevData

      const updated: FellowshipThemeCardData = { ...prevData, ...updates }

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      // Schedule save
      saveTimeoutRef.current = window.setTimeout(() => {
        saveFellowshipRoomPatch(updates)
          .then((payload) => {
            versionRef.current = payload.version
          })
          .catch((error: unknown) => {
            console.error('[litm-obr] Failed to save fellowship theme card data:', error)
          })
      }, 500)

      return updated
    })
  }, [])

  return { fellowshipData, updateFellowshipData }
}
