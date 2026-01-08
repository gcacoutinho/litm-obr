import type { ChangeEvent } from 'react'
import { FellowshipThemeCardData, PowerTag, WeaknessTag, createEmptyFellowshipThemeCard } from '../obrd/types'
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
  const handleThemeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.currentTarget.value
    const updatedTheme: PowerTag = { ...current.theme, text: value }
    updateFellowshipCard({ theme: updatedTheme })
  }

  const handleThemeScratchedChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const checked: boolean = e.target.checked
    const updatedTheme: PowerTag = { ...current.theme, isScratched: checked }
    updateFellowshipCard({ theme: updatedTheme })
  }

  const handlePowerTagChange = (index: number, updatedTag: PowerTag): void => {
    const updated: PowerTag[] = [...current.powerTags]
    updated[index] = updatedTag
    updateFellowshipCard({ powerTags: updated })
  }

  const handleWeaknessTagChange = (index: number, value: string): void => {
    const updated: WeaknessTag[] = [...current.weaknessTags]
    updated[index] = value
    updateFellowshipCard({ weaknessTags: updated })
  }

  const handleQuestsChange = (value: string): void => {
    updateFellowshipCard({ quests: value })
  }

  const handleAbandonChange = (value: number): void => {
    updateFellowshipCard({
      advancements: {
        ...advancements,
        abandon: value,
      },
    })
  }

  const handleImproveChange = (value: number): void => {
    updateFellowshipCard({
      advancements: {
        ...advancements,
        improve: value,
      },
    })
  }

  const handleMilestoneChange = (value: number): void => {
    updateFellowshipCard({
      advancements: {
        ...advancements,
        milestone: value,
      },
    })
  }

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
