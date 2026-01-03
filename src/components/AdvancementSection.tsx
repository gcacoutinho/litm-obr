import React from 'react'
import { useTranslation } from 'react-i18next'
import Advancement from './Advancement'

interface AdvancementSectionProps {
  type: 'abandon' | 'improve' | 'milestone'
  value: number
  onCheckboxChange: (value: number) => void
}

/**
 * Renders an advancement section (Abandon, Improve, or Milestone) with three checkboxes.
 * Used in ThemeCard to organize advancement groups.
 */
export const AdvancementSection: React.FC<AdvancementSectionProps> = ({
  type,
  value,
  onCheckboxChange,
}) => {
  const { t } = useTranslation()

  const ariaLabels: Record<'abandon' | 'improve' | 'milestone', [string, string, string]> = {
    abandon: [`${t('themeCard.abandon')} 1`, `${t('themeCard.abandon')} 2`, `${t('themeCard.abandon')} 3`],
    improve: [`${t('themeCard.improve')} 1`, `${t('themeCard.improve')} 2`, `${t('themeCard.improve')} 3`],
    milestone: [`${t('themeCard.milestone')} 1`, `${t('themeCard.milestone')} 2`, `${t('themeCard.milestone')} 3`],
  }

  return (
    <div className="advancement-section">
      <Advancement
        value={value}
        label={t(`themeCard.${type}`)}
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
