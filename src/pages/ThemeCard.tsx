import { useTranslation } from 'react-i18next'
import { Character } from '../obrd/types'
import { TextInput, TextAreaInput, WeaknessTagLeading, ThemeTagInput, PowerTagInput, AdvancementSection } from '../components'
import { useThemeCardForm } from '../hooks'

interface ThemeCardProps {
  cardNumber: 1 | 2 | 3 | 4
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
const ThemeCard = ({ cardNumber, character, onUpdate }: ThemeCardProps) => {
  const { t } = useTranslation()
  const form = useThemeCardForm({ cardNumber, character, onUpdate })

  const mightOptions = ['origin', 'adventure', 'greatness'] as const

  return (
    <div>
      <div className="might-selector">
        {mightOptions.map((option) => (
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
         placeholder={t('themeCard.type')}
       />
       <ThemeTagInput
         text={form.theme.text}
         isScratched={form.theme.isScratched}
         onTextChange={form.handleThemeChange}
         onScratchedChange={form.handleThemeScratchedChange}
         placeholder={t('themeCard.powerTag')}
       />
       {form.powerTags.map((powerTag, index) => (
         <PowerTagInput
           key={`power-tag-${index}`}
           text={powerTag.text}
           isScratched={powerTag.isScratched}
           onTextChange={(e) => form.handlePowerTagChange(index, { ...powerTag, text: e.currentTarget.value })}
           onScratchedChange={(e) => form.handlePowerTagChange(index, { ...powerTag, isScratched: e.target.checked })}
           placeholder={`${t('themeCard.powerTag')} ${index + 1}`}
         />
       ))}
       {form.weaknessTags.map((weaknessTag, index) => (
         <TextInput
           key={`weakness-tag-${index}`}
           leading={<WeaknessTagLeading />}
           value={weaknessTag}
           onChange={(e) => form.handleWeaknessTagChange(index, e.currentTarget.value)}
           placeholder={`${t('themeCard.weaknessTag')} ${index + 1}`}
         />
       ))}
      <label className="label-style">{t('themeCard.quest')}</label>
      <TextAreaInput
        lines={3}
        placeholder={t('themeCard.quest')}
        value={form.quests}
        onChange={(e) => form.handleQuestsChange((e.target as HTMLTextAreaElement).value)}
      />
      <div className="advancement-container">
        <AdvancementSection
          type="abandon"
          checkboxes={form.abandonAdvancements}
          onCheckboxChange={form.handleAbandonChange}
        />
        <AdvancementSection
          type="improve"
          checkboxes={form.improveAdvancements}
          onCheckboxChange={form.handleImproveChange}
        />
        <AdvancementSection
          type="milestone"
          checkboxes={form.milestoneAdvancements}
          onCheckboxChange={form.handleMilestoneChange}
        />
      </div>
    </div>
  )
}

export default ThemeCard
