import type { ReactElement } from 'react'
import { ThemeCardFields } from '../components'
import { useFellowshipThemeCardForm } from '../hooks/useFellowshipThemeCardForm'

/**
 * Renders the fellowship theme card with power tags, advancements, and quest tracking.
 * Manages form state through useFellowshipThemeCardForm hook.
 */
const FellowshipThemeCard = (): ReactElement => {
  const form = useFellowshipThemeCardForm()

  return (
    <div>
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

export default FellowshipThemeCard
