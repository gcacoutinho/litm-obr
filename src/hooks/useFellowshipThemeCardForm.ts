import { useState, useEffect } from 'react'
import { FellowshipThemeCardData } from '../obrd/types'
import { useFellowshipThemeCardStorage } from './useFellowshipThemeCardStorage'
import { useDebouncedCallback } from './useDebouncedCallback'

/**
 * Manages form state for the fellowship theme card, including power tags, advancements, and quests.
 * Handles debounced saves and syncs with parent fellowship data changes.
 *
 * @returns Object with form state and handler functions
 */
export function useFellowshipThemeCardForm() {
  const { fellowshipData, updateFellowshipData } = useFellowshipThemeCardStorage()

  // Form state
  const [powerTag1, setPowerTag1] = useState(fellowshipData?.powerTags.tag1.text || '')
  const [powerTag1Scratched, setPowerTag1Scratched] = useState(fellowshipData?.powerTags.tag1.scratched || false)
  const [powerTag2, setPowerTag2] = useState(fellowshipData?.powerTags.tag2.text || '')
  const [powerTag2Scratched, setPowerTag2Scratched] = useState(fellowshipData?.powerTags.tag2.scratched || false)
  const [powerTag3, setPowerTag3] = useState(fellowshipData?.powerTags.tag3.text || '')
  const [powerTag3Scratched, setPowerTag3Scratched] = useState(fellowshipData?.powerTags.tag3.scratched || false)
  const [weaknessTag, setWeaknessTag] = useState(fellowshipData?.weaknessTag || '')
  const [quests, setQuests] = useState(fellowshipData?.quests || '')
  const [abandonAdvancements, setAbandonAdvancements] = useState<[boolean, boolean, boolean]>(
    fellowshipData?.advancements.abandon || [false, false, false]
  )
  const [improveAdvancements, setImproveAdvancements] = useState<[boolean, boolean, boolean]>(
    fellowshipData?.advancements.improve || [false, false, false]
  )
  const [milestoneAdvancements, setMilestoneAdvancements] = useState<[boolean, boolean, boolean]>(
    fellowshipData?.advancements.milestone || [false, false, false]
  )

  // Sync with fellowship data prop changes
  useEffect(() => {
    if (fellowshipData) {
      setPowerTag1(fellowshipData.powerTags.tag1.text)
      setPowerTag1Scratched(fellowshipData.powerTags.tag1.scratched)
      setPowerTag2(fellowshipData.powerTags.tag2.text)
      setPowerTag2Scratched(fellowshipData.powerTags.tag2.scratched)
      setPowerTag3(fellowshipData.powerTags.tag3.text)
      setPowerTag3Scratched(fellowshipData.powerTags.tag3.scratched)
      setWeaknessTag(fellowshipData.weaknessTag)
      setQuests(fellowshipData.quests)
      setAbandonAdvancements(fellowshipData.advancements.abandon)
      setImproveAdvancements(fellowshipData.advancements.improve)
      setMilestoneAdvancements(fellowshipData.advancements.milestone)
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
  const handlePowerTag1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setPowerTag1(value)
    updateFellowshipCard({
      powerTags: {
        ...fellowshipData!.powerTags,
        tag1: { text: value, scratched: powerTag1Scratched },
      },
    })
  }

  const handlePowerTag1ScratchedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setPowerTag1Scratched(checked)
    updateFellowshipCard({
      powerTags: {
        ...fellowshipData!.powerTags,
        tag1: { text: powerTag1, scratched: checked },
      },
    })
  }

  const handlePowerTag2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setPowerTag2(value)
    updateFellowshipCard({
      powerTags: {
        ...fellowshipData!.powerTags,
        tag2: { text: value, scratched: powerTag2Scratched },
      },
    })
  }

  const handlePowerTag2ScratchedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setPowerTag2Scratched(checked)
    updateFellowshipCard({
      powerTags: {
        ...fellowshipData!.powerTags,
        tag2: { text: powerTag2, scratched: checked },
      },
    })
  }

  const handlePowerTag3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setPowerTag3(value)
    updateFellowshipCard({
      powerTags: {
        ...fellowshipData!.powerTags,
        tag3: { text: value, scratched: powerTag3Scratched },
      },
    })
  }

  const handlePowerTag3ScratchedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setPowerTag3Scratched(checked)
    updateFellowshipCard({
      powerTags: {
        ...fellowshipData!.powerTags,
        tag3: { text: powerTag3, scratched: checked },
      },
    })
  }

  const handleWeaknessTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setWeaknessTag(value)
    updateFellowshipCard({ weaknessTag: value })
  }

  const handleQuestsChange = (value: string) => {
    setQuests(value)
    debouncedSaveQuests(value)
  }

  const handleAbandonChange = (index: 0 | 1 | 2, checked: boolean) => {
    const updated = [...abandonAdvancements] as [boolean, boolean, boolean]
    updated[index] = checked
    setAbandonAdvancements(updated)
    updateFellowshipCard({
      advancements: {
        ...fellowshipData!.advancements,
        abandon: updated,
      },
    })
  }

  const handleImproveChange = (index: 0 | 1 | 2, checked: boolean) => {
    const updated = [...improveAdvancements] as [boolean, boolean, boolean]
    updated[index] = checked
    setImproveAdvancements(updated)
    updateFellowshipCard({
      advancements: {
        ...fellowshipData!.advancements,
        improve: updated,
      },
    })
  }

  const handleMilestoneChange = (index: 0 | 1 | 2, checked: boolean) => {
    const updated = [...milestoneAdvancements] as [boolean, boolean, boolean]
    updated[index] = checked
    setMilestoneAdvancements(updated)
    updateFellowshipCard({
      advancements: {
        ...fellowshipData!.advancements,
        milestone: updated,
      },
    })
  }

  return {
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