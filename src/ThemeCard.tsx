import { useState, useEffect } from 'react'
import { translations as t } from './translations'
import TextInput from './components/TextInput'
import ScratchCheckbox from './components/ScratchCheckbox'
import WeaknessTagLeading from './components/WeaknessTagLeading'
import { Character, ThemeMight } from './obrd/types'

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
  const [quest1, setQuest1] = useState(themeCardData.quests.quest1)
  const [quest2, setQuest2] = useState(themeCardData.quests.quest2)
  const [quest3, setQuest3] = useState(themeCardData.quests.quest3)

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
    setQuest1(data.quests.quest1)
    setQuest2(data.quests.quest2)
    setQuest3(data.quests.quest3)
  }, [character, themeCardKey])

  const updateThemeCard = (updates: Partial<typeof themeCardData>) => {
    const updated = { ...themeCardData, ...updates }
    onUpdate({ [themeCardKey]: updated })
  }

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

  const handleQuest1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setQuest1(value)
    updateThemeCard({
      quests: { ...themeCardData.quests, quest1: value }
    })
  }

  const handleQuest2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setQuest2(value)
    updateThemeCard({
      quests: { ...themeCardData.quests, quest2: value }
    })
  }

  const handleQuest3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setQuest3(value)
    updateThemeCard({
      quests: { ...themeCardData.quests, quest3: value }
    })
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
      <TextInput
        value={quest1}
        onChange={handleQuest1Change}
        placeholder="Quest 1"
      />
      <TextInput
        value={quest2}
        onChange={handleQuest2Change}
        placeholder="Quest 2"
      />
      <TextInput
        value={quest3}
        onChange={handleQuest3Change}
        placeholder="Quest 3"
      />
    </div>
  )
}

export default ThemeCard
