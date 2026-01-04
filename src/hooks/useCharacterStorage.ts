import { useState, useEffect, useCallback, useRef } from 'react'
import { Character, createEmptyCharacter, migrateCharacter } from '../obrd/types'
import { clearMyCharacter, getMyCharacter, saveMyCharacter } from '../obrd/playerMetadata'

/**
 * Hook for managing character data storage with debounced saves.
 * Loads character on mount and provides update function with 500ms debounce.
 *
 * @returns Object with character, isLoading, and updateCharacter callback
 *
 * @example
 * const { character, isLoading, updateCharacter } = useCharacterStorage()
 *
 * // Update character and it will save after 500ms of inactivity
 * updateCharacter({ characterName: 'New Name' })
 */
export function useCharacterStorage() {
  const [character, setCharacter] = useState<Character | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const saveTimeoutRef = useRef<number | undefined>(undefined)
  
  // Load character on mount
  useEffect(() => {
    const loadCharacter = async () => {
      try {
        const data = await getMyCharacter()
        setCharacter(migrateCharacter(data))
      } catch (error) {
        console.error('[litm-obr] Failed to load character:', error)
        setCharacter(createEmptyCharacter())
      } finally {
        setIsLoading(false)
      }
    }
    
    loadCharacter()
  }, [])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])
  
  // Debounced save (500ms)
  const updateCharacter = useCallback((updates: Partial<Character>) => {
    setCharacter((prevCharacter) => {
      if (!prevCharacter) return prevCharacter
      
      const updated = { ...prevCharacter, ...updates }
      
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      
      // Schedule save
      saveTimeoutRef.current = window.setTimeout(() => {
        saveMyCharacter(updated).catch((error) => {
          console.error('[litm-obr] Failed to save character:', error)
        })
      }, 500)
      
      return updated
    })
  }, [])

  const clearCharacter = useCallback(() => {
    setCharacter(createEmptyCharacter())
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    void clearMyCharacter()
  }, [])
  
  return { character, isLoading, updateCharacter, clearCharacter }
}
