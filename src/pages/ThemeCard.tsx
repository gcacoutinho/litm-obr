import type { ChangeEvent, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Character, ThemeMight } from '../obrd/types'
import { TextInput, TextAreaInput, WeaknessTagLeading, ThemeTagInput, PowerTagInput, AdvancementSection } from '../components'
import { useThemeCardForm } from '../hooks'

type ThemeCardNumber = 1 | 2 | 3 | 4

interface ThemeCardProps {
  cardNumber: ThemeCardNumber
  character: Character
  onUpdate: (updates: Partial<Character>) => void
}

/**
 * Renders a theme card with power tags, advancements, and quest tracking.
 * Manages form state through useThemeCardForm hook.
 *
 * @param cardNumber - Which theme card (1-4) to display
 * @param character - Current character data
 * @param onUpdate - Callback when theme card data changes
 */
const ThemeCard = ({ cardNumber, character, onUpdate }: ThemeCardProps): ReactElement => {
  const { t } = useTranslation()
  const form = useThemeCardForm({ cardNumber, character, onUpdate })

  const mightOptions: ThemeMight[] = ['origin', 'adventure', 'greatness']

  return (
    <div>
      <div className="might-selector">
        {mightOptions.map((option: ThemeMight) => (
          <button
            key={option}
            className={`might-option ${form.might === option ? 'active' : ''}`}
            onClick={() => form.handleMightChange(option)}
          >
            {t(`mightOptions.${option}`)}
          </button>
        ))}
      </div>
      <TextInput
        leading={<label>{t('themeCard.type')}</label>}
        value={form.type}
        onChange={form.handleTypeChange}
        placeholder={t('themeCard.typePlaceholder')}
      />
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

export default ThemeCard
