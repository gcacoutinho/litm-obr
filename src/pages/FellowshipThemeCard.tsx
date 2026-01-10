import type { ChangeEvent, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { TextInput, TextAreaInput, WeaknessTagLeading, ThemeTagInput, PowerTagInput, AdvancementSection } from '../components'
import { useFellowshipThemeCardForm } from '../hooks/useFellowshipThemeCardForm'

/**
 * Renders the fellowship theme card with power tags, advancements, and quest tracking.
 * Manages form state through useFellowshipThemeCardForm hook.
 */
const FellowshipThemeCard = (): ReactElement => {
  const { t } = useTranslation()
  const form = useFellowshipThemeCardForm()

  return (
    <div>
      <ThemeTagInput
        text={form.theme.text}
        isScratched={form.theme.isScratched}
        onTextChange={form.handleThemeChange}
        onScratchedChange={form.handleThemeScratchedChange}
        placeholder={t('themeCard.powerTag')}
      />
      {form.powerTags.map((powerTag, index: number) => (
        <PowerTagInput
          key={`power-tag-${index}`}
          text={powerTag.text}
          isScratched={powerTag.isScratched}
          onTextChange={(e: ChangeEvent<HTMLInputElement>) =>
            form.handlePowerTagChange(index, { ...powerTag, text: e.currentTarget.value })
          }
          onScratchedChange={(e: ChangeEvent<HTMLInputElement>) =>
            form.handlePowerTagChange(index, { ...powerTag, isScratched: e.target.checked })
          }
          placeholder={`${t('themeCard.powerTag')} ${index + 1}`}
        />
      ))}
      {form.weaknessTags.map((weaknessTag, index: number) => (
        <TextInput
          key={`weakness-tag-${index}`}
          leading={<WeaknessTagLeading />}
          className="tag-input"
          value={weaknessTag}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            form.handleWeaknessTagChange(index, e.currentTarget.value)
          }
          highlightClassName="weakness-tag-highlight"
          placeholder={`${t('themeCard.weaknessTag')} ${index + 1}`}
        />
      ))}
      <label className="label-style">{t('themeCard.quest')}</label>
      <TextAreaInput
        lines={3}
        placeholder={t('themeCard.quest')}
        value={form.quests}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          form.handleQuestsChange(e.currentTarget.value)
        }
      />
      <div className="advancement-container">
        <AdvancementSection
          type="abandon"
          value={form.abandonAdvancements}
          onCheckboxChange={form.handleAbandonChange}
        />
        <AdvancementSection
          type="improve"
          value={form.improveAdvancements}
          onCheckboxChange={form.handleImproveChange}
        />
        <AdvancementSection
          type="milestone"
          value={form.milestoneAdvancements}
          onCheckboxChange={form.handleMilestoneChange}
        />
      </div>
    </div>
  )
}

export default FellowshipThemeCard
