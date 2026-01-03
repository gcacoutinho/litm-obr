import { useState, useEffect, useCallback, useRef } from 'react'
import { FellowshipThemeCardData, createEmptyFellowshipThemeCard } from '../obrd/types'
import { getMyFellowshipThemeCard, saveMyFellowshipThemeCard } from '../obrd/playerMetadata'

/**
 * Hook for managing fellowship theme card data storage with debounced saves.
 * Loads fellowship data on mount and provides update function with 500ms debounce.
 *
 * @returns Object with fellowshipData, isLoading, and updateFellowshipData callback
 *
 * @example
 * const { fellowshipData, isLoading, updateFellowshipData } = useFellowshipThemeCardStorage()
 *
 * // Update fellowship data and it will save after 500ms of inactivity
 * updateFellowshipData({ weaknessTag: 'New Tag' })
 */
export function useFellowshipThemeCardStorage() {
  const [fellowshipData, setFellowshipData] = useState<FellowshipThemeCardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const saveTimeoutRef = useRef<number | undefined>(undefined)

  // Load fellowship data on mount
  useEffect(() => {
    const loadFellowshipData = async () => {
      try {
        const data = await getMyFellowshipThemeCard()
        setFellowshipData(data || createEmptyFellowshipThemeCard())
      } catch (error) {
        console.error('[litm-obr] Failed to load fellowship theme card data:', error)
        setFellowshipData(createEmptyFellowshipThemeCard())
      } finally {
        setIsLoading(false)
      }
    }

    loadFellowshipData()
  }, [])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  // Debounced save (500ms)
  const updateFellowshipData = useCallback((updates: Partial<FellowshipThemeCardData>) => {
    setFellowshipData((prevData) => {
      if (!prevData) return prevData

      const updated = { ...prevData, ...updates }

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      // Schedule save
      saveTimeoutRef.current = window.setTimeout(() => {
        saveMyFellowshipThemeCard(updated).catch((error) => {
          console.error('[litm-obr] Failed to save fellowship theme card data:', error)
        })
      }, 500)

      return updated
    })
  }, [])

  return { fellowshipData, isLoading, updateFellowshipData }
}
