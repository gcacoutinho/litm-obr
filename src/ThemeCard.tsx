import { useState } from 'react'
import { translations as t } from './translations'

interface ThemeCardProps {
  cardNumber: 1 | 2 | 3 | 4
}

const ThemeCard = ({ cardNumber }: ThemeCardProps) => {
  const [might, setMight] = useState<'origin' | 'adventure' | 'greatness'>('origin')

  const mightOptions = ['origin', 'adventure', 'greatness'] as const

  return (
    <div>
      <div className="might-selector">
        {mightOptions.map((option) => (
          <button
            key={option}
            className={`might-option ${might === option ? 'active' : ''}`}
            onClick={() => setMight(option)}
          >
            {t[option.charAt(0).toUpperCase() + option.slice(1)]}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ThemeCard
