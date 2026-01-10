import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Character, ThemeMight } from '../obrd/types'
import { TextInput, ThemeCardFields } from '../components'
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
      <ThemeCardFields
        theme={form.theme}
        powerTags={form.powerTags}
        weaknessTags={form.weaknessTags}
        quests={form.quests}
        abandonAdvancements={form.abandonAdvancements}
        improveAdvancements={form.improveAdvancements}
        milestoneAdvancements={form.milestoneAdvancements}
        onThemeChange={form.handleThemeChange}
        onThemeScratchedChange={form.handleThemeScratchedChange}
        onPowerTagChange={form.handlePowerTagChange}
        onWeaknessTagChange={form.handleWeaknessTagChange}
        onQuestsChange={form.handleQuestsChange}
        onAbandonChange={form.handleAbandonChange}
        onImproveChange={form.handleImproveChange}
        onMilestoneChange={form.handleMilestoneChange}
      />
    </div>
  )
}

export default ThemeCard
