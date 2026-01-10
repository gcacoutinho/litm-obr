import type { ChangeEvent } from 'react'
import { FellowshipThemeCardData, PowerTag, WeaknessTag, createEmptyFellowshipThemeCard } from '../obrd/types'
import { createThemeCardFormHandlers } from './themeCardFormUtils'
import { useFellowshipThemeCardStorage } from './useFellowshipThemeCardStorage'

type UseFellowshipThemeCardFormResult = {
  theme: PowerTag
  powerTags: PowerTag[]
  weaknessTags: WeaknessTag[]
  quests: string
  abandonAdvancements: number
  improveAdvancements: number
  milestoneAdvancements: number
  handleThemeChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleThemeScratchedChange: (e: ChangeEvent<HTMLInputElement>) => void
  handlePowerTagChange: (index: number, updatedTag: PowerTag) => void
  handleWeaknessTagChange: (index: number, value: string) => void
  handleQuestsChange: (value: string) => void
  handleAbandonChange: (value: number) => void
  handleImproveChange: (value: number) => void
  handleMilestoneChange: (value: number) => void
}

/**
 * Manages form state for the fellowship theme card, including power tags, advancements, and quests.
 * Handles debounced saves and syncs with parent fellowship data changes.
 *
 * @returns Object with form state and handler functions
 */
export function useFellowshipThemeCardForm(): UseFellowshipThemeCardFormResult {
  const { fellowshipData, updateFellowshipData } = useFellowshipThemeCardStorage()

  const current: FellowshipThemeCardData = fellowshipData ?? createEmptyFellowshipThemeCard()
  const {
    theme,
    powerTags,
    weaknessTags,
    quests,
    advancements,
  }: FellowshipThemeCardData = current

  // Core update function
  const updateFellowshipCard = (updates: Partial<FellowshipThemeCardData>): void => {
    updateFellowshipData(updates)
  }

  // Handlers
  const {
    handleThemeChange,
    handleThemeScratchedChange,
    handlePowerTagChange,
    handleWeaknessTagChange,
    handleQuestsChange,
    handleAbandonChange,
    handleImproveChange,
    handleMilestoneChange,
  } = createThemeCardFormHandlers(current, updateFellowshipCard)

  return {
    theme,
    powerTags,
    weaknessTags,
    quests,
    abandonAdvancements: advancements.abandon,
    improveAdvancements: advancements.improve,
    milestoneAdvancements: advancements.milestone,
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
