import { useState, useEffect } from 'react'
import { Character, ThemeCardData, ThemeMight } from '../obrd/types'
import { useDebouncedCallback } from './useDebouncedCallback'

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

  // Form state
  const [might, setMight] = useState<ThemeMight>(themeCardData.might)
  const [type, setType] = useState(themeCardData.type)
  const [powerTag1, setPowerTag1] = useState(themeCardData.powerTags.tag1.text)
  const [powerTag1Scratched, setPowerTag1Scratched] = useState(themeCardData.powerTags.tag1.scratched)
  const [powerTag2, setPowerTag2] = useState(themeCardData.powerTags.tag2.text)
  const [powerTag2Scratched, setPowerTag2Scratched] = useState(themeCardData.powerTags.tag2.scratched)
  const [powerTag3, setPowerTag3] = useState(themeCardData.powerTags.tag3.text)
  const [powerTag3Scratched, setPowerTag3Scratched] = useState(themeCardData.powerTags.tag3.scratched)
  const [weaknessTag, setWeaknessTag] = useState(themeCardData.weaknessTag)
  const [quests, setQuests] = useState(themeCardData.quests)
  const [abandonAdvancements, setAbandonAdvancements] = useState<[boolean, boolean, boolean]>(
    themeCardData.advancements.abandon
  )
  const [improveAdvancements, setImproveAdvancements] = useState<[boolean, boolean, boolean]>(
    themeCardData.advancements.improve
  )
  const [milestoneAdvancements, setMilestoneAdvancements] = useState<[boolean, boolean, boolean]>(
    themeCardData.advancements.milestone
  )

  // Sync with character prop changes
  useEffect(() => {
    const data = character[themeCardKey]
    setMight(data.might)
    setType(data.type)
    setPowerTag1(data.powerTags.tag1.text)
    setPowerTag1Scratched(data.powerTags.tag1.scratched)
    setPowerTag2(data.powerTags.tag2.text)
    setPowerTag2Scratched(data.powerTags.tag2.scratched)
    setPowerTag3(data.powerTags.tag3.text)
    setPowerTag3Scratched(data.powerTags.tag3.scratched)
    setWeaknessTag(data.weaknessTag)
    setQuests(data.quests)
    setAbandonAdvancements(data.advancements.abandon)
    setImproveAdvancements(data.advancements.improve)
    setMilestoneAdvancements(data.advancements.milestone)
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
    setMight(newMight)
    updateThemeCard({ might: newMight })
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setType(value)
    updateThemeCard({ type: value })
  }

  const handlePowerTag1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setPowerTag1(value)
    updateThemeCard({
      powerTags: {
        ...themeCardData.powerTags,
        tag1: { text: value, scratched: powerTag1Scratched },
      },
    })
  }

  const handlePowerTag1ScratchedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setPowerTag1Scratched(checked)
    updateThemeCard({
      powerTags: {
        ...themeCardData.powerTags,
        tag1: { text: powerTag1, scratched: checked },
      },
    })
  }

  const handlePowerTag2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setPowerTag2(value)
    updateThemeCard({
      powerTags: {
        ...themeCardData.powerTags,
        tag2: { text: value, scratched: powerTag2Scratched },
      },
    })
  }

  const handlePowerTag2ScratchedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setPowerTag2Scratched(checked)
    updateThemeCard({
      powerTags: {
        ...themeCardData.powerTags,
        tag2: { text: powerTag2, scratched: checked },
      },
    })
  }

  const handlePowerTag3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setPowerTag3(value)
    updateThemeCard({
      powerTags: {
        ...themeCardData.powerTags,
        tag3: { text: value, scratched: powerTag3Scratched },
      },
    })
  }

  const handlePowerTag3ScratchedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setPowerTag3Scratched(checked)
    updateThemeCard({
      powerTags: {
        ...themeCardData.powerTags,
        tag3: { text: powerTag3, scratched: checked },
      },
    })
  }

  const handleWeaknessTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setWeaknessTag(value)
    updateThemeCard({ weaknessTag: value })
  }

  const handleQuestsChange = (value: string) => {
    setQuests(value)
    debouncedSaveQuests(value)
  }

  const handleAbandonChange = (index: 0 | 1 | 2, checked: boolean) => {
    const updated = [...abandonAdvancements] as [boolean, boolean, boolean]
    updated[index] = checked
    setAbandonAdvancements(updated)
    updateThemeCard({
      advancements: {
        ...themeCardData.advancements,
        abandon: updated,
      },
    })
  }

  const handleImproveChange = (index: 0 | 1 | 2, checked: boolean) => {
    const updated = [...improveAdvancements] as [boolean, boolean, boolean]
    updated[index] = checked
    setImproveAdvancements(updated)
    updateThemeCard({
      advancements: {
        ...themeCardData.advancements,
        improve: updated,
      },
    })
  }

  const handleMilestoneChange = (index: 0 | 1 | 2, checked: boolean) => {
    const updated = [...milestoneAdvancements] as [boolean, boolean, boolean]
    updated[index] = checked
    setMilestoneAdvancements(updated)
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
