import { useState, useEffect, useCallback, useRef } from 'react'
import { Character, createEmptyCharacter, migrateCharacter } from '../obrd/types'
import { getMyCharacter, saveMyCharacter } from '../obrd/playerMetadata'

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
  
  return { character, isLoading, updateCharacter }
}
