import { Character, ThemeCardData, ThemeMight, PowerTag } from '../obrd/types'

interface UseThemeCardFormProps {
  cardNumber: 1 | 2 | 3 | 4
  character: Character
  onUpdate: (updates: Partial<Character>) => void
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

  const {
    might,
    type,
    theme,
    powerTags,
    weaknessTags,
    quests,
    advancements,
  } = themeCardData

  // Core update function
  const updateThemeCard = (updates: Partial<ThemeCardData>) => {
    const updated = { ...themeCardData, ...updates }
    onUpdate({ [themeCardKey]: updated })
  }

  // Handlers
  const handleMightChange = (newMight: ThemeMight) => {
    updateThemeCard({ might: newMight })
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    updateThemeCard({ type: value })
  }

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    const updatedTheme = { ...themeCardData.theme, text: value }
    updateThemeCard({ theme: updatedTheme })
  }

  const handleThemeScratchedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    const updatedTheme = { ...themeCardData.theme, isScratched: checked }
    updateThemeCard({ theme: updatedTheme })
  }

  const handlePowerTagChange = (index: number, updatedTag: PowerTag) => {
    const updated = [...themeCardData.powerTags]
    updated[index] = updatedTag
    updateThemeCard({ powerTags: updated })
  }

  const handleWeaknessTagChange = (index: number, value: string) => {
    const updated = [...themeCardData.weaknessTags]
    updated[index] = value
    updateThemeCard({ weaknessTags: updated })
  }

  const handleQuestsChange = (value: string) => {
    updateThemeCard({ quests: value })
  }

  const handleAbandonChange = (value: number) => {
    updateThemeCard({
      advancements: {
        ...advancements,
        abandon: value,
      },
    })
  }

  const handleImproveChange = (value: number) => {
    updateThemeCard({
      advancements: {
        ...advancements,
        improve: value,
      },
    })
  }

  const handleMilestoneChange = (value: number) => {
    updateThemeCard({
      advancements: {
        ...advancements,
        milestone: value,
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
