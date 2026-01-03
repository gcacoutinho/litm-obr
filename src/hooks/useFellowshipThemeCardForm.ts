import { useState, useEffect } from 'react'
import { FellowshipThemeCardData, PowerTag, WeaknessTag } from '../obrd/types'
import { useFellowshipThemeCardStorage } from './useFellowshipThemeCardStorage'
import { useDebouncedCallback } from './useDebouncedCallback'

interface FellowshipThemeCardFormState {
  theme: PowerTag
  powerTags: PowerTag[]
  weaknessTags: WeaknessTag[]
  quests: string
  abandonAdvancements: number
  improveAdvancements: number
  milestoneAdvancements: number
}

/**
 * Manages form state for the fellowship theme card, including power tags, advancements, and quests.
 * Handles debounced saves and syncs with parent fellowship data changes.
 *
 * @returns Object with form state and handler functions
 */
export function useFellowshipThemeCardForm() {
  const { fellowshipData, updateFellowshipData } = useFellowshipThemeCardStorage()

  // Consolidated form state
  const [formState, setFormState] = useState<FellowshipThemeCardFormState>({
    theme: fellowshipData?.theme || { text: '', isScratched: false },
    powerTags: fellowshipData?.powerTags || [],
    weaknessTags: fellowshipData?.weaknessTags || [],
    quests: fellowshipData?.quests || '',
    abandonAdvancements: fellowshipData?.advancements.abandon ?? 0,
    improveAdvancements: fellowshipData?.advancements.improve ?? 0,
    milestoneAdvancements: fellowshipData?.advancements.milestone ?? 0,
  })

  // Destructure for easier access
  const {
    theme,
    powerTags,
    weaknessTags,
    quests,
    abandonAdvancements,
    improveAdvancements,
    milestoneAdvancements,
  } = formState

  // Sync with fellowship data prop changes
  useEffect(() => {
    if (fellowshipData) {
      setFormState({
        theme: fellowshipData.theme,
        powerTags: fellowshipData.powerTags,
        weaknessTags: fellowshipData.weaknessTags,
        quests: fellowshipData.quests,
        abandonAdvancements: fellowshipData.advancements.abandon,
        improveAdvancements: fellowshipData.advancements.improve,
        milestoneAdvancements: fellowshipData.advancements.milestone,
      })
    }
  }, [fellowshipData])

  // Core update function
  const updateFellowshipCard = (updates: Partial<FellowshipThemeCardData>) => {
    updateFellowshipData(updates)
  }

  // Debounced callback for saving quests
  const debouncedSaveQuests = useDebouncedCallback((updatedQuests: string) => {
    updateFellowshipCard({ quests: updatedQuests })
  }, 500)

  // Handlers
  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    const updatedTheme = { ...formState.theme, text: value }
    setFormState(prev => ({ ...prev, theme: updatedTheme }))
    updateFellowshipCard({ theme: updatedTheme })
  }

  const handleThemeScratchedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    const updatedTheme = { ...formState.theme, isScratched: checked }
    setFormState(prev => ({ ...prev, theme: updatedTheme }))
    updateFellowshipCard({ theme: updatedTheme })
  }

  const handlePowerTagChange = (index: number, updatedTag: PowerTag) => {
    const updated = [...formState.powerTags]
    updated[index] = updatedTag
    setFormState(prev => ({ ...prev, powerTags: updated }))
    updateFellowshipCard({ powerTags: updated })
  }

  const handleWeaknessTagChange = (index: number, value: string) => {
    const updated = [...formState.weaknessTags]
    updated[index] = value
    setFormState(prev => ({ ...prev, weaknessTags: updated }))
    updateFellowshipCard({ weaknessTags: updated })
  }

  const handleQuestsChange = (value: string) => {
    setFormState(prev => ({ ...prev, quests: value }))
    debouncedSaveQuests(value)
  }

  const handleAbandonChange = (value: number) => {
    setFormState(prev => ({ ...prev, abandonAdvancements: value }))
    updateFellowshipCard({
      advancements: {
        ...fellowshipData!.advancements,
        abandon: value,
      },
    })
  }

  const handleImproveChange = (value: number) => {
    setFormState(prev => ({ ...prev, improveAdvancements: value }))
    updateFellowshipCard({
      advancements: {
        ...fellowshipData!.advancements,
        improve: value,
      },
    })
  }

  const handleMilestoneChange = (value: number) => {
    setFormState(prev => ({ ...prev, milestoneAdvancements: value }))
    updateFellowshipCard({
      advancements: {
        ...fellowshipData!.advancements,
        milestone: value,
      },
    })
  }

  return {
    theme,
    powerTags,
    weaknessTags,
    quests,
    abandonAdvancements,
    improveAdvancements,
    milestoneAdvancements,
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
