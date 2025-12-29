import { useTranslation } from 'react-i18next'
import { TextInput, TextAreaInput, WeaknessTagLeading, PowerTagInput, AdvancementSection } from './components'
import { useFellowshipThemeCardForm } from './hooks/useFellowshipThemeCardForm'

/**
 * Renders the fellowship theme card with power tags, advancements, and quest tracking.
 * Manages form state through useFellowshipThemeCardForm hook.
 */
const FellowshipThemeCard = () => {
  const { t } = useTranslation()
  const form = useFellowshipThemeCardForm()

  return (
    <div>
      <PowerTagInput
        tagNumber={1}
        text={form.powerTag1}
        scratched={form.powerTag1Scratched}
        onTextChange={form.handlePowerTag1Change}
        onScratchedChange={form.handlePowerTag1ScratchedChange}
        placeholder={`${t('themeCard.powerTag')} 1`}
      />
      <PowerTagInput
        tagNumber={2}
        text={form.powerTag2}
        scratched={form.powerTag2Scratched}
        onTextChange={form.handlePowerTag2Change}
        onScratchedChange={form.handlePowerTag2ScratchedChange}
        placeholder={`${t('themeCard.powerTag')} 2`}
      />
      <PowerTagInput
        tagNumber={3}
        text={form.powerTag3}
        scratched={form.powerTag3Scratched}
        onTextChange={form.handlePowerTag3Change}
        onScratchedChange={form.handlePowerTag3ScratchedChange}
        placeholder={`${t('themeCard.powerTag')} 3`}
      />
      <TextInput
        leading={<WeaknessTagLeading />}
        value={form.weaknessTag}
        onChange={form.handleWeaknessTagChange}
        placeholder={t('themeCard.weaknessTag')}
      />
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

export default FellowshipThemeCard