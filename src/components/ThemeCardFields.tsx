import type { ChangeEvent, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import type { PowerTag, WeaknessTag } from '../obrd/types'
import TextInput from './TextInput'
import TextAreaInput from './TextAreaInput'
import WeaknessTagLeading from './WeaknessTagLeading'
import { ThemeTagInput } from './ThemeTagInput'
import { PowerTagInput } from './PowerTagInput'
import AdvancementSection from './AdvancementSection'

type ThemeCardFieldsProps = {
  theme: PowerTag
  powerTags: PowerTag[]
  weaknessTags: WeaknessTag[]
  quests: string
  abandonAdvancements: number
  improveAdvancements: number
  milestoneAdvancements: number
  onThemeChange: (e: ChangeEvent<HTMLInputElement>) => void
  onThemeScratchedChange: (e: ChangeEvent<HTMLInputElement>) => void
  onPowerTagChange: (index: number, updatedTag: PowerTag) => void
  onWeaknessTagChange: (index: number, value: string) => void
  onQuestsChange: (value: string) => void
  onAbandonChange: (value: number) => void
  onImproveChange: (value: number) => void
  onMilestoneChange: (value: number) => void
}

const ThemeCardFields = ({
  theme,
  powerTags,
  weaknessTags,
  quests,
  abandonAdvancements,
  improveAdvancements,
  milestoneAdvancements,
  onThemeChange,
  onThemeScratchedChange,
  onPowerTagChange,
  onWeaknessTagChange,
  onQuestsChange,
  onAbandonChange,
  onImproveChange,
  onMilestoneChange,
}: ThemeCardFieldsProps): ReactElement => {
  const { t } = useTranslation()

  return (
    <>
      <ThemeTagInput
        text={theme.text}
        isScratched={theme.isScratched}
        onTextChange={onThemeChange}
        onScratchedChange={onThemeScratchedChange}
        placeholder={t('themeCard.powerTag')}
      />
      {powerTags.map((powerTag, index: number) => (
        <PowerTagInput
          key={`power-tag-${index}`}
          text={powerTag.text}
          isScratched={powerTag.isScratched}
          onTextChange={(e: ChangeEvent<HTMLInputElement>) =>
            onPowerTagChange(index, { ...powerTag, text: e.currentTarget.value })
          }
          onScratchedChange={(e: ChangeEvent<HTMLInputElement>) =>
            onPowerTagChange(index, { ...powerTag, isScratched: e.target.checked })
          }
          placeholder={`${t('themeCard.powerTag')} ${index + 1}`}
        />
      ))}
      {weaknessTags.map((weaknessTag, index: number) => (
        <TextInput
          key={`weakness-tag-${index}`}
          leading={<WeaknessTagLeading />}
          className="tag-input"
          value={weaknessTag}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onWeaknessTagChange(index, e.currentTarget.value)
          }
          highlightClassName="weakness-tag-highlight"
          placeholder={`${t('themeCard.weaknessTag')} ${index + 1}`}
        />
      ))}
      <label className="label-style">{t('themeCard.quest')}</label>
      <TextAreaInput
        lines={3}
        placeholder={t('themeCard.quest')}
        value={quests}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          onQuestsChange(e.currentTarget.value)
        }
      />
      <div className="advancement-container">
        <AdvancementSection
          type="abandon"
          value={abandonAdvancements}
          onCheckboxChange={onAbandonChange}
        />
        <AdvancementSection
          type="improve"
          value={improveAdvancements}
          onCheckboxChange={onImproveChange}
        />
        <AdvancementSection
          type="milestone"
          value={milestoneAdvancements}
          onCheckboxChange={onMilestoneChange}
        />
      </div>
    </>
  )
}

export default ThemeCardFields
