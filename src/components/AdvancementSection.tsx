import React from 'react'
import Advancement from './Advancement'

interface AdvancementSectionProps {
  type: 'abandon' | 'improve' | 'milestone'
  checkboxes: [boolean, boolean, boolean]
  onCheckboxChange: (index: 0 | 1 | 2, checked: boolean) => void
}

/**
 * Renders an advancement section (Abandon, Improve, or Milestone) with three checkboxes.
 * Used in ThemeCard to organize advancement groups.
 */
export const AdvancementSection: React.FC<AdvancementSectionProps> = ({
  type,
  checkboxes,
  onCheckboxChange,
}) => {
  const labels = {
    abandon: 'Abandon',
    improve: 'Improve',
    milestone: 'Milestone',
  }

  const ariaLabels: Record<'abandon' | 'improve' | 'milestone', [string, string, string]> = {
    abandon: ['Abandon 1', 'Abandon 2', 'Abandon 3'],
    improve: ['Improve 1', 'Improve 2', 'Improve 3'],
    milestone: ['Milestone 1', 'Milestone 2', 'Milestone 3'],
  }

  return (
    <div className="advancement-section">
      <Advancement
        checkboxes={checkboxes}
        label={labels[type]}
        onCheckboxChange={onCheckboxChange}
        labelStyle={{
          fontWeight: 'bold',
          textTransform: 'uppercase',
          color: '#52281a',
          textAlign: 'center',
        }}
        checkboxAriaLabels={ariaLabels[type]}
        containerStyle={{ marginBottom: '1rem' }}
      />
    </div>
  )
}
