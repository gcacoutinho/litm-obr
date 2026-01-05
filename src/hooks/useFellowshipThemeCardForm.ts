import { FellowshipThemeCardData, PowerTag, createEmptyFellowshipThemeCard } from '../obrd/types'
import { useFellowshipThemeCardStorage } from './useFellowshipThemeCardStorage'

/**
 * Manages form state for the fellowship theme card, including power tags, advancements, and quests.
 * Handles debounced saves and syncs with parent fellowship data changes.
 *
 * @returns Object with form state and handler functions
 */
export function useFellowshipThemeCardForm() {
  const { fellowshipData, updateFellowshipData } = useFellowshipThemeCardStorage()

  const current = fellowshipData ?? createEmptyFellowshipThemeCard()
  const {
    theme,
    powerTags,
    weaknessTags,
    quests,
    advancements,
  } = current

  // Core update function
  const updateFellowshipCard = (updates: Partial<FellowshipThemeCardData>) => {
    updateFellowshipData(updates)
  }

  // Handlers
  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    const updatedTheme = { ...current.theme, text: value }
    updateFellowshipCard({ theme: updatedTheme })
  }

  const handleThemeScratchedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    const updatedTheme = { ...current.theme, isScratched: checked }
    updateFellowshipCard({ theme: updatedTheme })
  }

  const handlePowerTagChange = (index: number, updatedTag: PowerTag) => {
    const updated = [...current.powerTags]
    updated[index] = updatedTag
    updateFellowshipCard({ powerTags: updated })
  }

  const handleWeaknessTagChange = (index: number, value: string) => {
    const updated = [...current.weaknessTags]
    updated[index] = value
    updateFellowshipCard({ weaknessTags: updated })
  }

  const handleQuestsChange = (value: string) => {
    updateFellowshipCard({ quests: value })
  }

  const handleAbandonChange = (value: number) => {
    updateFellowshipCard({
      advancements: {
        ...advancements,
        abandon: value,
      },
    })
  }

  const handleImproveChange = (value: number) => {
    updateFellowshipCard({
      advancements: {
        ...advancements,
        improve: value,
      },
    })
  }

  const handleMilestoneChange = (value: number) => {
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
