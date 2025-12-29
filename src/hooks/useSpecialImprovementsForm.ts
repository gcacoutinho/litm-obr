import { useState, useEffect } from 'react'
import { useSpecialImprovementsStorage } from './useSpecialImprovementsStorage'

/**
 * Hook for managing form state for special improvements.
 * Syncs with storage hook and provides handlers for input changes.
 *
 * @returns Object with specialImprovements array and handleImprovementChange function
 */
export function useSpecialImprovementsForm() {
  const { specialImprovements, updateSpecialImprovements } = useSpecialImprovementsStorage()

  // Form state
  const [improvements, setImprovements] = useState<string[]>(specialImprovements)

  // Sync with storage changes
  useEffect(() => {
    setImprovements(specialImprovements)
  }, [specialImprovements])

  // Handler for updating a specific improvement
  const handleImprovementChange = (index: number, value: string) => {
    const updated = [...improvements]
    updated[index] = value
    setImprovements(updated)
    updateSpecialImprovements(updated)
  }

  return {
    improvements,
    handleImprovementChange,
  }
}