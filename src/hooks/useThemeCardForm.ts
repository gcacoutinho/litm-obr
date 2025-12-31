import { useState, useEffect } from 'react'
import { Character, ThemeCardData, ThemeMight } from '../obrd/types'
import { useDebouncedCallback } from './useDebouncedCallback'

interface UseThemeCardFormProps {
  cardNumber: 1 | 2 | 3 | 4
  character: Character
  onUpdate: (updates: Partial<Character>) => void
}

interface ThemeCardFormState {
  might: ThemeMight
  type: string
  powerTag1: string
  powerTag1Scratched: boolean
  powerTag2: string
  powerTag2Scratched: boolean
  powerTag3: string
  powerTag3Scratched: boolean
  weaknessTag: string
  quests: string
  abandonAdvancements: [boolean, boolean, boolean]
  improveAdvancements: [boolean, boolean, boolean]
  milestoneAdvancements: [boolean, boolean, boolean]
}

/**
 * Manages form state for a theme card, including power tags, advancements, and quests.
 * Handles debounced saves and syncs with parent character changes.
 *
 * @param cardNumber - Which theme card (1-4) to manage
 * @param character - Current character data
 * @param onUpdate - Callback when theme card data changes
 * @returns Object with form state and handler functions
 */
export function useThemeCardForm({ cardNumber, character, onUpdate }: UseThemeCardFormProps) {
  const themeCardKey = `themeCard${cardNumber}` as `themeCard${1 | 2 | 3 | 4}`
  const themeCardData = character[themeCardKey]

  // Consolidated form state
  const [formState, setFormState] = useState<ThemeCardFormState>({
    might: themeCardData.might,
    type: themeCardData.type,
    powerTag1: themeCardData.powerTags.tag1.text,
    powerTag1Scratched: themeCardData.powerTags.tag1.scratched,
    powerTag2: themeCardData.powerTags.tag2.text,
    powerTag2Scratched: themeCardData.powerTags.tag2.scratched,
    powerTag3: themeCardData.powerTags.tag3.text,
    powerTag3Scratched: themeCardData.powerTags.tag3.scratched,
    weaknessTag: themeCardData.weaknessTag,
    quests: themeCardData.quests,
    abandonAdvancements: themeCardData.advancements.abandon,
    improveAdvancements: themeCardData.advancements.improve,
    milestoneAdvancements: themeCardData.advancements.milestone,
  })

  // Destructure for easier access
  const {
    might,
    type,
    powerTag1,
    powerTag1Scratched,
    powerTag2,
    powerTag2Scratched,
    powerTag3,
    powerTag3Scratched,
    weaknessTag,
    quests,
    abandonAdvancements,
    improveAdvancements,
    milestoneAdvancements,
  } = formState

  // Sync with character prop changes
  useEffect(() => {
    const data = character[themeCardKey]
    setFormState({
      might: data.might,
      type: data.type,
      powerTag1: data.powerTags.tag1.text,
      powerTag1Scratched: data.powerTags.tag1.scratched,
      powerTag2: data.powerTags.tag2.text,
      powerTag2Scratched: data.powerTags.tag2.scratched,
      powerTag3: data.powerTags.tag3.text,
      powerTag3Scratched: data.powerTags.tag3.scratched,
      weaknessTag: data.weaknessTag,
      quests: data.quests,
      abandonAdvancements: data.advancements.abandon,
      improveAdvancements: data.advancements.improve,
      milestoneAdvancements: data.advancements.milestone,
    })
  }, [character, themeCardKey])

  // Core update function
  const updateThemeCard = (updates: Partial<ThemeCardData>) => {
    const updated = { ...themeCardData, ...updates }
    onUpdate({ [themeCardKey]: updated })
  }

  // Debounced callback for saving quests
  const debouncedSaveQuests = useDebouncedCallback((updatedQuests: string) => {
    updateThemeCard({ quests: updatedQuests })
  }, 500)

  // Handlers
  const handleMightChange = (newMight: ThemeMight) => {
    setFormState(prev => ({ ...prev, might: newMight }))
    updateThemeCard({ might: newMight })
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setFormState(prev => ({ ...prev, type: value }))
    updateThemeCard({ type: value })
  }

  const handlePowerTag1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setFormState(prev => ({ ...prev, powerTag1: value }))
    updateThemeCard({
      powerTags: {
        ...themeCardData.powerTags,
        tag1: { text: value, scratched: formState.powerTag1Scratched },
      },
    })
  }

  const handlePowerTag1ScratchedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setFormState(prev => ({ ...prev, powerTag1Scratched: checked }))
    updateThemeCard({
      powerTags: {
        ...themeCardData.powerTags,
        tag1: { text: formState.powerTag1, scratched: checked },
      },
    })
  }

  const handlePowerTag2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setFormState(prev => ({ ...prev, powerTag2: value }))
    updateThemeCard({
      powerTags: {
        ...themeCardData.powerTags,
        tag2: { text: value, scratched: formState.powerTag2Scratched },
      },
    })
  }

  const handlePowerTag2ScratchedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setFormState(prev => ({ ...prev, powerTag2Scratched: checked }))
    updateThemeCard({
      powerTags: {
        ...themeCardData.powerTags,
        tag2: { text: formState.powerTag2, scratched: checked },
      },
    })
  }

  const handlePowerTag3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setFormState(prev => ({ ...prev, powerTag3: value }))
    updateThemeCard({
      powerTags: {
        ...themeCardData.powerTags,
        tag3: { text: value, scratched: formState.powerTag3Scratched },
      },
    })
  }

  const handlePowerTag3ScratchedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setFormState(prev => ({ ...prev, powerTag3Scratched: checked }))
    updateThemeCard({
      powerTags: {
        ...themeCardData.powerTags,
        tag3: { text: formState.powerTag3, scratched: checked },
      },
    })
  }

  const handleWeaknessTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setFormState(prev => ({ ...prev, weaknessTag: value }))
    updateThemeCard({ weaknessTag: value })
  }

  const handleQuestsChange = (value: string) => {
    setFormState(prev => ({ ...prev, quests: value }))
    debouncedSaveQuests(value)
  }

  const handleAbandonChange = (index: 0 | 1 | 2, checked: boolean) => {
    const updated = [...formState.abandonAdvancements] as [boolean, boolean, boolean]
    updated[index] = checked
    setFormState(prev => ({ ...prev, abandonAdvancements: updated }))
    updateThemeCard({
      advancements: {
        ...themeCardData.advancements,
        abandon: updated,
      },
    })
  }

  const handleImproveChange = (index: 0 | 1 | 2, checked: boolean) => {
    const updated = [...formState.improveAdvancements] as [boolean, boolean, boolean]
    updated[index] = checked
    setFormState(prev => ({ ...prev, improveAdvancements: updated }))
    updateThemeCard({
      advancements: {
        ...themeCardData.advancements,
        improve: updated,
      },
    })
  }

  const handleMilestoneChange = (index: 0 | 1 | 2, checked: boolean) => {
    const updated = [...formState.milestoneAdvancements] as [boolean, boolean, boolean]
    updated[index] = checked
    setFormState(prev => ({ ...prev, milestoneAdvancements: updated }))
    updateThemeCard({
      advancements: {
        ...themeCardData.advancements,
        milestone: updated,
      },
    })
  }

  return {
    might,
    type,
    powerTag1,
    powerTag1Scratched,
    powerTag2,
    powerTag2Scratched,
    powerTag3,
    powerTag3Scratched,
    weaknessTag,
    quests,
    abandonAdvancements,
    improveAdvancements,
    milestoneAdvancements,
    handleMightChange,
    handleTypeChange,
    handlePowerTag1Change,
    handlePowerTag1ScratchedChange,
    handlePowerTag2Change,
    handlePowerTag2ScratchedChange,
    handlePowerTag3Change,
    handlePowerTag3ScratchedChange,
    handleWeaknessTagChange,
    handleQuestsChange,
    handleAbandonChange,
    handleImproveChange,
    handleMilestoneChange,
  }
}
