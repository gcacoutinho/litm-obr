import { useState, useEffect } from 'react'
import { Character, ThemeCardData, ThemeMight, PowerTag, WeaknessTag } from '../obrd/types'
import { useDebouncedCallback } from './useDebouncedCallback'

interface UseThemeCardFormProps {
  cardNumber: 1 | 2 | 3 | 4
  character: Character
  onUpdate: (updates: Partial<Character>) => void
}

interface ThemeCardFormState {
  might: ThemeMight
  type: string
  theme: PowerTag
  powerTags: PowerTag[]
  weaknessTags: WeaknessTag[]
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
    theme: themeCardData.theme,
    powerTags: themeCardData.powerTags,
    weaknessTags: themeCardData.weaknessTags,
    quests: themeCardData.quests,
    abandonAdvancements: themeCardData.advancements.abandon,
    improveAdvancements: themeCardData.advancements.improve,
    milestoneAdvancements: themeCardData.advancements.milestone,
  })

  // Destructure for easier access
  const {
    might,
    type,
    theme,
    powerTags,
    weaknessTags,
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
      theme: data.theme,
      powerTags: data.powerTags,
      weaknessTags: data.weaknessTags,
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

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    const updatedTheme = { ...formState.theme, text: value }
    setFormState(prev => ({ ...prev, theme: updatedTheme }))
    updateThemeCard({ theme: updatedTheme })
  }

  const handleThemeScratchedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    const updatedTheme = { ...formState.theme, isScratched: checked }
    setFormState(prev => ({ ...prev, theme: updatedTheme }))
    updateThemeCard({ theme: updatedTheme })
  }

  const handlePowerTagChange = (index: number, updatedTag: PowerTag) => {
    const updated = [...formState.powerTags]
    updated[index] = updatedTag
    setFormState(prev => ({ ...prev, powerTags: updated }))
    updateThemeCard({ powerTags: updated })
  }

  const handleWeaknessTagChange = (index: number, value: string) => {
    const updated = [...formState.weaknessTags]
    updated[index] = value
    setFormState(prev => ({ ...prev, weaknessTags: updated }))
    updateThemeCard({ weaknessTags: updated })
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
    theme,
    powerTags,
    weaknessTags,
    quests,
    abandonAdvancements,
    improveAdvancements,
    milestoneAdvancements,
    handleMightChange,
    handleTypeChange,
    handleThemeChange,
    handleThemeScratchedChange,
    handlePowerTagChange,
    handleWeaknessTagChange,
    handleQuestsChange,
    handleAbandonChange,
    handleImproveChange,
    handleMilestoneChange,
  }
}
