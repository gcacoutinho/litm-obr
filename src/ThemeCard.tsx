import { Character } from './obrd/types'
import TextInput from './components/TextInput'
import TextAreaInput from './components/TextAreaInput'
import WeaknessTagLeading from './components/WeaknessTagLeading'
import { PowerTagInput } from './components/PowerTagInput'
import { AdvancementSection } from './components/AdvancementSection'
import { useThemeCardForm } from './hooks/useThemeCardForm'

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
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
      <TextInput
        leading={<label>Type: </label>}
        value={form.type}
        onChange={form.handleTypeChange}
        placeholder="theme type"
      />
      <PowerTagInput
        tagNumber={1}
        text={form.powerTag1}
        scratched={form.powerTag1Scratched}
        onTextChange={form.handlePowerTag1Change}
        onScratchedChange={form.handlePowerTag1ScratchedChange}
      />
      <PowerTagInput
        tagNumber={2}
        text={form.powerTag2}
        scratched={form.powerTag2Scratched}
        onTextChange={form.handlePowerTag2Change}
        onScratchedChange={form.handlePowerTag2ScratchedChange}
      />
      <PowerTagInput
        tagNumber={3}
        text={form.powerTag3}
        scratched={form.powerTag3Scratched}
        onTextChange={form.handlePowerTag3Change}
        onScratchedChange={form.handlePowerTag3ScratchedChange}
      />
      <TextInput
        leading={<WeaknessTagLeading />}
        value={form.weaknessTag}
        onChange={form.handleWeaknessTagChange}
        placeholder="Weakness tag"
      />
      <label className="label-style">QUEST</label>
      <TextAreaInput
        lines={3}
        placeholder="quest"
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
