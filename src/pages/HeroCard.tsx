import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, InputCheckboxGroup } from '../components';
import { Character } from '../obrd/types';

interface HeroCardProps {
  character: Character
  onUpdate: (updates: Partial<Character>) => void
}

/**
 * Renders the hero card with character name, player name, fellowship relationships, promises, and quintessences.
 * Uses controlled component pattern with synchronization to parent character prop.
 */
type FellowshipRelationships = Character['fellowshipRelationships']
type Quintessences = Character['quintessences']

const HeroCard = ({ character, onUpdate }: HeroCardProps): React.ReactElement => {
  const { t } = useTranslation()
  // Display values derived from character + pending changes
  const [characterName, setCharacterName] = useState<string>(character.characterName)
  const [playerName, setPlayerName] = useState<string>(character.playerName)
  const [fellowshipRelationships, setFellowshipRelationships] =
    useState<FellowshipRelationships>(character.fellowshipRelationships)
  const [promises, setPromises] = useState<number>(character.promises)
  const [quintessences, setQuintessences] = useState<Quintessences>(character.quintessences)

  // Sync local state when character prop changes
  useEffect(() => {
    setCharacterName(character.characterName)
    setPlayerName(character.playerName)
    setFellowshipRelationships(character.fellowshipRelationships)
    setPromises(character.promises)
    setQuintessences(character.quintessences)
  }, [character])

  // Helper to update array items and sync state
  const updateArrayItem = <T,>(
    array: T[],
    index: number,
    updater: (item: T) => T,
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    updateKey: keyof Character
  ): void => {
    const updated: T[] = [...array]
    updated[index] = updater(updated[index])
    setState(updated)
    onUpdate({ [updateKey]: updated } as Partial<Character>)
  }

  const handleCharacterNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const value: string = e.target.value
    const lines: string[] = value.split('\n')
    if (lines.length <= 2) {
      setCharacterName(value)
      onUpdate({ characterName: value })
    }
  }

  const handlePlayerNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value
    setPlayerName(value)
    onUpdate({ playerName: value })
  }

  const handleCompanionChange = (index: number, value: string): void => {
    updateArrayItem(fellowshipRelationships, index, item => ({ ...item, companion: value }), setFellowshipRelationships, 'fellowshipRelationships')
  }

  const handleRelationshipTagChange = (index: number, value: string): void => {
    updateArrayItem(fellowshipRelationships, index, item => ({ ...item, relationshipTag: value }), setFellowshipRelationships, 'fellowshipRelationships')
  }

  const handlePromiseChange = (value: number): void => {
    setPromises(value)
    onUpdate({ promises: value })
  }

  const handleQuintessenceChange = (index: number, value: string): void => {
    updateArrayItem(quintessences, index, () => value, setQuintessences, 'quintessences')
  }

  return (
    <div>
      <div className="hero-card-name-wrapper">
        <textarea
          placeholder={t('heroCard.characterName')}
          rows={2}
          value={characterName}
          onChange={handleCharacterNameChange}
          className="input-base hero-card-name-input"
        />
        <div className="hero-card-name-divider"></div>
      </div>
      <div className="hero-card-section">
        <label className="label-style">{t('heroCard.playerName')}</label>
        <TextInput type="text" placeholder={t('heroCard.enterPlayerName')} value={playerName} onChange={handlePlayerNameChange} />
      </div>
      <label className="label-style">{t('heroCard.fellowshipRelationship')}</label>
      <div className="hero-card-section">
        {/* Header Row */}
        <div className="hero-card-section-label">
          <div className="hero-card-section-header">{t('heroCard.companion')}</div>
          <div className="hero-card-section-header hero-card-section-header-last">{t('heroCard.relationshipTag')}</div>
        </div>
        {/* Data Rows */}
        {Array.from({ length: 5 }, (_: unknown, i: number) => (
          <div key={i} className="hero-card-row">
            <div className="hero-card-row-cell">
              <TextInput
                type="text"
                placeholder={`${t('heroCard.companion')} ${i + 1}`}
                value={fellowshipRelationships[i].companion}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleCompanionChange(i, e.target.value)
                }
              />
            </div>
            <div className="hero-card-row-cell hero-card-row-cell-last">
              <TextInput
                type="text"
                placeholder={`${t('heroCard.tag')} ${i + 1}`}
                value={fellowshipRelationships[i].relationshipTag}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleRelationshipTagChange(i, e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>
      <div className="hero-promises-container">
        <span className="hero-promises-label">{t('heroCard.promise')}:</span>
        <InputCheckboxGroup
          count={5}
          value={promises}
          onChange={handlePromiseChange}
          checkboxClassName="promise-checkbox hero-promise-checkbox"
        />
      </div>
      <div>
        <label className="label-style">{t('heroCard.quintessences')}</label>
        {Array.from({ length: 5 }, (_: unknown, i: number) => (
          <div key={i} className="hero-card-row">
            <div className="hero-card-row-cell hero-card-row-cell-last">
              <TextInput
                type="text"
                placeholder={`${t('heroCard.quintessence')} ${i + 1}`}
                value={quintessences[i]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleQuintessenceChange(i, e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
};

export default HeroCard;
