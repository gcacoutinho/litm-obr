import { useState, useEffect, useCallback, useRef } from 'react'
import type { FellowshipImprovementsPayload } from '../obrd/fellowshipImprovementsRoom'
import {
  loadFellowshipImprovementsPayload,
  onFellowshipImprovementsChange,
  saveFellowshipImprovements
} from '../obrd/fellowshipImprovementsRoom'

type UseSpecialImprovementsStorageResult = {
  specialImprovements: string[]
  isLoading: boolean
  updateSpecialImprovements: (updates: string[]) => void
}

/**
 * Hook for managing special improvements data storage with debounced saves.
 * Loads shared fellowship improvements from room metadata when available.
 *
 * @returns Object with specialImprovements, isLoading, and updateSpecialImprovements callback
 *
 * @example
 * const { specialImprovements, isLoading, updateSpecialImprovements } = useSpecialImprovementsStorage()
 *
 * // Update special improvements and it will save after 500ms of inactivity
 * updateSpecialImprovements(['Fire Resistance', '', ...])
 */
export function useSpecialImprovementsStorage(): UseSpecialImprovementsStorageResult {
  const [specialImprovements, setSpecialImprovements] = useState<string[]>(Array(10).fill(''))
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const saveTimeoutRef = useRef<number | undefined>(undefined)
  const versionRef = useRef<number>(0)

  // Load fellowship improvements on mount
  useEffect(() => {
    const loadSpecialImprovements = async (): Promise<void> => {
      try {
        const payload: FellowshipImprovementsPayload | null =
          await loadFellowshipImprovementsPayload()
        if (payload) {
          versionRef.current = payload.version
          setSpecialImprovements(payload.data)
        } else {
          setSpecialImprovements(Array(10).fill(''))
        }
      } catch (error: unknown) {
        console.error('[litm-obr] Failed to load special improvements:', error)
        setSpecialImprovements(Array(10).fill(''))
      } finally {
        setIsLoading(false)
      }
    }

    loadSpecialImprovements()
  }, [])

  useEffect(() => {
    const unsubscribe: () => void = onFellowshipImprovementsChange(
      (payload: FellowshipImprovementsPayload | null) => {
      if (!payload) {
        return
      }

      if (payload.version <= versionRef.current) {
        return
      }

      versionRef.current = payload.version
      setSpecialImprovements(payload.data)
      }
    )

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
  const updateSpecialImprovements = useCallback((updates: string[]): void => {
    setSpecialImprovements(updates)

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Schedule save
    saveTimeoutRef.current = window.setTimeout(async () => {
      try {
        const payload = await saveFellowshipImprovements(updates)
        versionRef.current = payload.version
      } catch (error: unknown) {
        console.error('[litm-obr] Failed to save special improvements:', error)
      }
    }, 500)
  }, [])

  return { specialImprovements, isLoading, updateSpecialImprovements }
}
