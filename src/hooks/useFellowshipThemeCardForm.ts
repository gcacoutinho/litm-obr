import { useState, useEffect } from 'react'
import { FellowshipThemeCardData, PowerTag, WeaknessTag } from '../obrd/types'
import { useFellowshipThemeCardStorage } from './useFellowshipThemeCardStorage'
import { useDebouncedCallback } from './useDebouncedCallback'

interface FellowshipThemeCardFormState {
  theme: PowerTag
  powerTags: PowerTag[]
  weaknessTags: WeaknessTag[]
  quests: string
  abandonAdvancements: [boolean, boolean, boolean]
  improveAdvancements: [boolean, boolean, boolean]
  milestoneAdvancements: [boolean, boolean, boolean]
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
    abandonAdvancements: fellowshipData?.advancements.abandon || [false, false, false],
    improveAdvancements: fellowshipData?.advancements.improve || [false, false, false],
    milestoneAdvancements: fellowshipData?.advancements.milestone || [false, false, false],
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

  const handleAbandonChange = (index: 0 | 1 | 2, checked: boolean) => {
    const updated = [...formState.abandonAdvancements] as [boolean, boolean, boolean]
    updated[index] = checked
    setFormState(prev => ({ ...prev, abandonAdvancements: updated }))
    updateFellowshipCard({
      advancements: {
        ...fellowshipData!.advancements,
        abandon: updated,
      },
    })
  }

  const handleImproveChange = (index: 0 | 1 | 2, checked: boolean) => {
    const updated = [...formState.improveAdvancements] as [boolean, boolean, boolean]
    updated[index] = checked
    setFormState(prev => ({ ...prev, improveAdvancements: updated }))
    updateFellowshipCard({
      advancements: {
        ...fellowshipData!.advancements,
        improve: updated,
      },
    })
  }

  const handleMilestoneChange = (index: 0 | 1 | 2, checked: boolean) => {
    const updated = [...formState.milestoneAdvancements] as [boolean, boolean, boolean]
    updated[index] = checked
    setFormState(prev => ({ ...prev, milestoneAdvancements: updated }))
    updateFellowshipCard({
      advancements: {
        ...fellowshipData!.advancements,
        milestone: updated,
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