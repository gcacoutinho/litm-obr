import { useState, useEffect, useCallback, useRef } from 'react'
import { migrateCharacter } from '../obrd/types'
import { getMyCharacter, saveMyCharacter } from '../obrd/playerMetadata'

/**
 * Hook for managing special improvements data storage with debounced saves.
 * Loads character on mount, extracts specialImprovements, and provides update function with 500ms debounce.
 *
 * @returns Object with specialImprovements, isLoading, and updateSpecialImprovements callback
 *
 * @example
 * const { specialImprovements, isLoading, updateSpecialImprovements } = useSpecialImprovementsStorage()
 *
 * // Update special improvements and it will save after 500ms of inactivity
 * updateSpecialImprovements(['Fire Resistance', '', ...])
 */
export function useSpecialImprovementsStorage() {
  const [specialImprovements, setSpecialImprovements] = useState<string[]>(Array(10).fill(''))
  const [isLoading, setIsLoading] = useState(true)
  const saveTimeoutRef = useRef<number | undefined>(undefined)

  // Load character on mount and extract specialImprovements
  useEffect(() => {
    const loadSpecialImprovements = async () => {
      try {
        const data = await getMyCharacter()
        const character = migrateCharacter(data)
        setSpecialImprovements(character.specialImprovements)
      } catch (error) {
        console.error('[litm-obr] Failed to load special improvements:', error)
        setSpecialImprovements(Array(10).fill(''))
      } finally {
        setIsLoading(false)
      }
    }

    loadSpecialImprovements()
  }, [])

  // Debounced save (500ms)
  const updateSpecialImprovements = useCallback((updates: string[]) => {
    setSpecialImprovements(updates)

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Schedule save
    saveTimeoutRef.current = window.setTimeout(async () => {
      try {
        const data = await getMyCharacter()
        const character = migrateCharacter(data)
        const updatedCharacter = { ...character, specialImprovements: updates }
        await saveMyCharacter(updatedCharacter)
      } catch (error) {
        console.error('[litm-obr] Failed to save special improvements:', error)
      }
    }, 500)
  }, [])

  return { specialImprovements, isLoading, updateSpecialImprovements }
}