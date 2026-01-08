import { useState, useEffect, useCallback, useRef } from 'react'
import { Character, createEmptyCharacter, migrateCharacter } from '../obrd/types'
import { clearMyCharacter, getMyCharacter, saveMyCharacter } from '../obrd/playerMetadata'

type UseCharacterStorageResult = {
  character: Character | null
  isLoading: boolean
  updateCharacter: (updates: Partial<Character>) => void
  clearCharacter: () => void
  importCharacter: (raw: string) => Promise<ImportCharacterResult>
}

export type ImportCharacterResult =
  | { status: 'success'; character: Character }
  | { status: 'invalid_json' }
  | { status: 'invalid_data' }
  | { status: 'save_failed' }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

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
export function useCharacterStorage(): UseCharacterStorageResult {
  const [character, setCharacter] = useState<Character | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const saveTimeoutRef = useRef<number | undefined>(undefined)
  
  // Load character on mount
  useEffect(() => {
    const loadCharacter = async (): Promise<void> => {
      try {
        const data: Character | null = await getMyCharacter()
        setCharacter(migrateCharacter(data))
      } catch (error: unknown) {
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
  const updateCharacter = useCallback((updates: Partial<Character>): void => {
    setCharacter((prevCharacter: Character | null): Character | null => {
      if (!prevCharacter) return prevCharacter
      
      const updated: Character = { ...prevCharacter, ...updates }
      
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      
      // Schedule save
      saveTimeoutRef.current = window.setTimeout(() => {
        saveMyCharacter(updated).catch((error: unknown) => {
          console.error('[litm-obr] Failed to save character:', error)
        })
      }, 500)
      
      return updated
    })
  }, [])

  const clearCharacter = useCallback((): void => {
    setCharacter(createEmptyCharacter())
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    void clearMyCharacter()
  }, [])

  const importCharacter = useCallback(async (raw: string): Promise<ImportCharacterResult> => {
    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch (error: unknown) {
      console.warn('[litm-obr] Failed to parse character JSON.', error)
      return { status: 'invalid_json' }
    }

    if (!isRecord(parsed)) {
      return { status: 'invalid_data' }
    }

    const imported: Character = migrateCharacter(parsed)
    setCharacter(imported)
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    try {
      await saveMyCharacter(imported)
      return { status: 'success', character: imported }
    } catch (error: unknown) {
      console.error('[litm-obr] Failed to save imported character:', error)
      return { status: 'save_failed' }
    }
  }, [])
  
  return { character, isLoading, updateCharacter, clearCharacter, importCharacter }
}
