import { useState } from 'react'
import { translations as t } from './translations'
import TextInput from './components/TextInput'
import InputCheckbox from './components/InputCheckbox'

interface ThemeCardProps {
  cardNumber: 1 | 2 | 3 | 4
}

const ThemeCard = ({ cardNumber }: ThemeCardProps) => {
  const [might, setMight] = useState<'origin' | 'adventure' | 'greatness'>('origin')
  const [type, setType] = useState('')
  const [powerTag1, setPowerTag1] = useState('')
  const [powerTag2, setPowerTag2] = useState('')
  const [powerTag3, setPowerTag3] = useState('')
  const [weaknessTag, setWeaknessTag] = useState('')

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
      <TextInput
        style={{ fontSize: '1.2em' }}
        value={powerTag1}
        onChange={(e) => setPowerTag1(e.currentTarget.value)}
        placeholder="Power Tag 1"
        trailing={<InputCheckbox />}
      />
      <TextInput
        value={powerTag2}
        onChange={(e) => setPowerTag2(e.currentTarget.value)}
        placeholder="Power Tag 2"
        trailing={<InputCheckbox />}
      />
      <TextInput
        value={powerTag3}
        onChange={(e) => setPowerTag3(e.currentTarget.value)}
        placeholder="Power Tag 3"
        trailing={<InputCheckbox />}
      />
      <TextInput
        value={weaknessTag}
        onChange={(e) => setWeaknessTag(e.currentTarget.value)}
        placeholder="Weakness tag"
      />
    </div>
  )
}

export default ThemeCard
