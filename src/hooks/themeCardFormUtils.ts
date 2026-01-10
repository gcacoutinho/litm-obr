import type { ChangeEvent } from 'react'
import type { PowerTag, WeaknessTag } from '../obrd/types'

type ThemeCardBasics = {
  theme: PowerTag
  powerTags: PowerTag[]
  weaknessTags: WeaknessTag[]
  quests: string
  advancements: {
    abandon: number
    improve: number
    milestone: number
  }
}

type ThemeCardFormHandlers = {
  handleThemeChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleThemeScratchedChange: (e: ChangeEvent<HTMLInputElement>) => void
  handlePowerTagChange: (index: number, updatedTag: PowerTag) => void
  handleWeaknessTagChange: (index: number, value: WeaknessTag) => void
  handleQuestsChange: (value: string) => void
  handleAbandonChange: (value: number) => void
  handleImproveChange: (value: number) => void
  handleMilestoneChange: (value: number) => void
}

export function createThemeCardFormHandlers<T extends ThemeCardBasics>(
  current: T,
  update: (updates: Partial<T>) => void
): ThemeCardFormHandlers {
  const handleThemeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.currentTarget.value
    const updatedTheme: PowerTag = { ...current.theme, text: value }
    update({ theme: updatedTheme })
  }

  const handleThemeScratchedChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const checked: boolean = e.target.checked
    const updatedTheme: PowerTag = { ...current.theme, isScratched: checked }
    update({ theme: updatedTheme })
  }

  const handlePowerTagChange = (index: number, updatedTag: PowerTag): void => {
    const updated: PowerTag[] = [...current.powerTags]
    updated[index] = updatedTag
    update({ powerTags: updated })
  }

  const handleWeaknessTagChange = (index: number, value: WeaknessTag): void => {
    const updated: WeaknessTag[] = [...current.weaknessTags]
    updated[index] = value
    update({ weaknessTags: updated })
  }

  const handleQuestsChange = (value: string): void => {
    update({ quests: value })
  }

  const handleAbandonChange = (value: number): void => {
    update({
      advancements: {
        ...current.advancements,
        abandon: value,
      },
    })
  }

  const handleImproveChange = (value: number): void => {
    update({
      advancements: {
        ...current.advancements,
        improve: value,
      },
    })
  }

  const handleMilestoneChange = (value: number): void => {
    update({
      advancements: {
        ...current.advancements,
        milestone: value,
      },
    })
  }

  return {
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
