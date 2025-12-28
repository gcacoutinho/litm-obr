import { useState } from 'react'
import { translations as t } from './translations'
import TextInput from './components/TextInput'

interface ThemeCardProps {
  cardNumber: 1 | 2 | 3 | 4
}

const ThemeCard = ({ cardNumber }: ThemeCardProps) => {
  const [might, setMight] = useState<'origin' | 'adventure' | 'greatness'>('origin')
  const [type, setType] = useState('')

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
      <TextInput
        leading={<label>Type: </label>}
        value={type}
        onChange={(e) => setType(e.currentTarget.value)}
        placeholder="theme type"
      />
    </div>
  )
}

export default ThemeCard
