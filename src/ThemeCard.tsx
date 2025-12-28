import { useState, useEffect } from 'react'
import { translations as t } from './translations'
import TextInput from './components/TextInput'
import TextAreaInput from './components/TextAreaInput'
import ScratchCheckbox from './components/ScratchCheckbox'
import WeaknessTagLeading from './components/WeaknessTagLeading'
import { Character, ThemeMight } from './obrd/types'
import { useDebouncedCallback } from './hooks/useDebouncedCallback'

interface ThemeCardProps {
  cardNumber: 1 | 2 | 3 | 4
  character: Character
  onUpdate: (updates: Partial<Character>) => void
}

const ThemeCard = ({ cardNumber, character, onUpdate }: ThemeCardProps) => {
  const themeCardKey = `themeCard${cardNumber}` as `themeCard${1 | 2 | 3 | 4}`
  const themeCardData = character[themeCardKey]

  const [might, setMight] = useState<ThemeMight>(themeCardData.might)
  const [type, setType] = useState(themeCardData.type)
  const [powerTag1, setPowerTag1] = useState(themeCardData.powerTags.tag1.text)
  const [powerTag1Scratched, setPowerTag1Scratched] = useState(themeCardData.powerTags.tag1.scratched)
  const [powerTag2, setPowerTag2] = useState(themeCardData.powerTags.tag2.text)
  const [powerTag2Scratched, setPowerTag2Scratched] = useState(themeCardData.powerTags.tag2.scratched)
  const [powerTag3, setPowerTag3] = useState(themeCardData.powerTags.tag3.text)
  const [powerTag3Scratched, setPowerTag3Scratched] = useState(themeCardData.powerTags.tag3.scratched)
  const [weaknessTag, setWeaknessTag] = useState(themeCardData.weaknessTag)
  const [quests, setQuests] = useState(themeCardData.quests)

  // Sync with character prop changes
  useEffect(() => {
    const data = character[themeCardKey]
    setMight(data.might)
    setType(data.type)
    setPowerTag1(data.powerTags.tag1.text)
    setPowerTag1Scratched(data.powerTags.tag1.scratched)
    setPowerTag2(data.powerTags.tag2.text)
    setPowerTag2Scratched(data.powerTags.tag2.scratched)
    setPowerTag3(data.powerTags.tag3.text)
    setPowerTag3Scratched(data.powerTags.tag3.scratched)
    setWeaknessTag(data.weaknessTag)
    setQuests(data.quests)
  }, [character, themeCardKey])

  const updateThemeCard = (updates: Partial<typeof themeCardData>) => {
    const updated = { ...themeCardData, ...updates }
    onUpdate({ [themeCardKey]: updated })
  }

  // Debounced callback for saving quests
  const debouncedSaveQuests = useDebouncedCallback((updatedQuests: string) => {
    updateThemeCard({ quests: updatedQuests })
  }, 500)

  const handleMightChange = (newMight: ThemeMight) => {
    setMight(newMight)
    updateThemeCard({ might: newMight })
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setType(value)
    updateThemeCard({ type: value })
  }

  const handlePowerTag1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setPowerTag1(value)
    updateThemeCard({
      powerTags: {
        ...themeCardData.powerTags,
        tag1: { text: value, scratched: powerTag1Scratched }
      }
    })
  }

  const handlePowerTag1ScratchedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setPowerTag1Scratched(checked)
    updateThemeCard({
      powerTags: {
        ...themeCardData.powerTags,
        tag1: { text: powerTag1, scratched: checked }
      }
    })
  }

  const handlePowerTag2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setPowerTag2(value)
    updateThemeCard({
      powerTags: {
        ...themeCardData.powerTags,
        tag2: { text: value, scratched: powerTag2Scratched }
      }
    })
  }

  const handlePowerTag2ScratchedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setPowerTag2Scratched(checked)
    updateThemeCard({
      powerTags: {
        ...themeCardData.powerTags,
        tag2: { text: powerTag2, scratched: checked }
      }
    })
  }

  const handlePowerTag3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setPowerTag3(value)
    updateThemeCard({
      powerTags: {
        ...themeCardData.powerTags,
        tag3: { text: value, scratched: powerTag3Scratched }
      }
    })
  }

  const handlePowerTag3ScratchedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setPowerTag3Scratched(checked)
    updateThemeCard({
      powerTags: {
        ...themeCardData.powerTags,
        tag3: { text: powerTag3, scratched: checked }
      }
    })
  }

  const handleWeaknessTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setWeaknessTag(value)
    updateThemeCard({ weaknessTag: value })
  }

  const handleQuestsChange = (value: string) => {
    setQuests(value)
    debouncedSaveQuests(value)
  }

  const mightOptions = ['origin', 'adventure', 'greatness'] as const

  return (
    <div>
      <div className="might-selector">
        {mightOptions.map((option) => (
          <button
            key={option}
            className={`might-option ${might === option ? 'active' : ''}`}
            onClick={() => handleMightChange(option)}
          >
            {t[option.charAt(0).toUpperCase() + option.slice(1)]}
          </button>
        ))}
      </div>
      <TextInput
        leading={<label>Type: </label>}
        value={type}
        onChange={handleTypeChange}
        placeholder="theme type"
      />
      <TextInput
        style={{ fontSize: '1.2em' }}
        value={powerTag1}
        onChange={handlePowerTag1Change}
        placeholder="Power Tag 1"
        trailing={<ScratchCheckbox checked={powerTag1Scratched} onChange={handlePowerTag1ScratchedChange} />}
      />
      <TextInput
        value={powerTag2}
        onChange={handlePowerTag2Change}
        placeholder="Power Tag 2"
        trailing={<ScratchCheckbox checked={powerTag2Scratched} onChange={handlePowerTag2ScratchedChange} />}
      />
      <TextInput
        value={powerTag3}
        onChange={handlePowerTag3Change}
        placeholder="Power Tag 3"
        trailing={<ScratchCheckbox checked={powerTag3Scratched} onChange={handlePowerTag3ScratchedChange} />}
      />
      <TextInput
        leading={<WeaknessTagLeading />}
        value={weaknessTag}
        onChange={handleWeaknessTagChange}
        placeholder="Weakness tag"
      />
       <label className="label-style">QUEST</label>
       <TextAreaInput
         lines={3}
         placeholder="quest"
         value={quests}
         onChange={(e) => handleQuestsChange(e.target.value)}
       />
    </div>
  )
}

export default ThemeCard
