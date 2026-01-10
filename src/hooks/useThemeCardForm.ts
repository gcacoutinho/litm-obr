import type { ChangeEvent } from 'react'
import { Character, ThemeCardData, ThemeMight, PowerTag, WeaknessTag } from '../obrd/types'
import { createThemeCardFormHandlers } from './themeCardFormUtils'

type ThemeCardNumber = 1 | 2 | 3 | 4
type ThemeCardKey = `themeCard${ThemeCardNumber}`

interface UseThemeCardFormProps {
  cardNumber: ThemeCardNumber
  character: Character
  onUpdate: (updates: Partial<Character>) => void
}

type UseThemeCardFormResult = {
  might: ThemeMight
  type: string
  theme: PowerTag
  powerTags: PowerTag[]
  weaknessTags: WeaknessTag[]
  quests: string
  abandonAdvancements: number
  improveAdvancements: number
  milestoneAdvancements: number
  handleMightChange: (newMight: ThemeMight) => void
  handleTypeChange: (e: ChangeEvent<HTMLInputElement>) => void
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
 * Manages form state for a theme card, including power tags, advancements, and quests.
 * Handles debounced saves and syncs with parent character changes.
 *
 * @param cardNumber - Which theme card (1-4) to manage
 * @param character - Current character data
 * @param onUpdate - Callback when theme card data changes
 * @returns Object with form state and handler functions
 */
export function useThemeCardForm(
  { cardNumber, character, onUpdate }: UseThemeCardFormProps
): UseThemeCardFormResult {
  const themeCardKey: ThemeCardKey = `themeCard${cardNumber}` as ThemeCardKey
  const themeCardData: ThemeCardData = character[themeCardKey]

  const {
    might,
    type,
    theme,
    powerTags,
    weaknessTags,
    quests,
    advancements,
  }: ThemeCardData = themeCardData

  // Core update function
  const updateThemeCard = (updates: Partial<ThemeCardData>): void => {
    const updated: ThemeCardData = { ...themeCardData, ...updates }
    onUpdate({ [themeCardKey]: updated })
  }

  // Handlers
  const handleMightChange = (newMight: ThemeMight): void => {
    updateThemeCard({ might: newMight })
  }

  const handleTypeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.currentTarget.value
    updateThemeCard({ type: value })
  }

  const {
    handleThemeChange,
    handleThemeScratchedChange,
    handlePowerTagChange,
    handleWeaknessTagChange,
    handleQuestsChange,
    handleAbandonChange,
    handleImproveChange,
    handleMilestoneChange,
  } = createThemeCardFormHandlers(themeCardData, updateThemeCard)

  return {
    might,
    type,
    theme,
    powerTags,
    weaknessTags,
    quests,
    abandonAdvancements: advancements.abandon,
    improveAdvancements: advancements.improve,
    milestoneAdvancements: advancements.milestone,
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
