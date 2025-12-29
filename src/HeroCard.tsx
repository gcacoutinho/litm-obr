import React, { useState, useEffect } from 'react';
import { TextInput, InputCheckbox } from './components';
import {
  HERO_CARD_LABELS,
  COMPANION_PLACEHOLDERS,
  TAG_PLACEHOLDERS,
  QUINTESSENCE_PLACEHOLDERS,
} from './constants';
import { Character } from './obrd/types';

interface HeroCardProps {
  character: Character
  onUpdate: (updates: Partial<Character>) => void
}

/**
 * Renders the hero card with character name, player name, fellowship relationships, promises, and quintessences.
 * Uses controlled component pattern with synchronization to parent character prop.
 */
const HeroCard = ({ character, onUpdate }: HeroCardProps) => {
  // Display values derived from character + pending changes
  const [characterName, setCharacterName] = useState(character.characterName)
  const [playerName, setPlayerName] = useState(character.playerName)
  const [fellowshipRelationships, setFellowshipRelationships] = useState(character.fellowshipRelationships)
  const [promises, setPromises] = useState(character.promises)
  const [quintessences, setQuintessences] = useState(character.quintessences)

  // Sync local state when character prop changes
  useEffect(() => {
    setCharacterName(character.characterName)
    setPlayerName(character.playerName)
    setFellowshipRelationships(character.fellowshipRelationships)
    setPromises(character.promises)
    setQuintessences(character.quintessences)
  }, [character])

  const handleCharacterNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    const lines = value.split('\n')
    if (lines.length <= 2) {
      setCharacterName(value)
      onUpdate({ characterName: value })
    }
  }

  const handlePlayerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPlayerName(value)
    onUpdate({ playerName: value })
  }

  const handleCompanionChange = (index: number, value: string) => {
    const updated = [...fellowshipRelationships]
    updated[index] = { ...updated[index], companion: value }
    setFellowshipRelationships(updated)
    onUpdate({ fellowshipRelationships: updated })
  }

  const handleRelationshipTagChange = (index: number, value: string) => {
    const updated = [...fellowshipRelationships]
    updated[index] = { ...updated[index], relationshipTag: value }
    setFellowshipRelationships(updated)
    onUpdate({ fellowshipRelationships: updated })
  }

  const handlePromiseChange = (index: number, checked: boolean) => {
    const updated = [...promises]
    updated[index] = checked
    setPromises(updated)
    onUpdate({ promises: updated })
  }

  const handleQuintessenceChange = (index: number, value: string) => {
    const updated = [...quintessences]
    updated[index] = value
    setQuintessences(updated)
    onUpdate({ quintessences: updated })
  }

  return (
    <div>
      <div className="hero-card-name-wrapper">
        <textarea
          placeholder={HERO_CARD_LABELS.CHARACTER_NAME}
          rows={2}
          value={characterName}
          onChange={handleCharacterNameChange}
          className="input-base hero-card-name-input"
        />
        <div className="hero-card-name-divider"></div>
      </div>
      <div className="hero-card-section">
        <label className="label-style">{HERO_CARD_LABELS.PLAYER_NAME}</label>
        <TextInput type="text" placeholder={HERO_CARD_LABELS.ENTER_PLAYER_NAME} value={playerName} onChange={handlePlayerNameChange} />
      </div>
      <label className="label-style">{HERO_CARD_LABELS.FELLOWSHIP_RELATIONSHIP}</label>
      <div className="hero-card-section">
        {/* Header Row */}
        <div className="hero-card-section-label">
          <div className="hero-card-section-header">{HERO_CARD_LABELS.COMPANION}</div>
          <div className="hero-card-section-header hero-card-section-header-last">{HERO_CARD_LABELS.RELATIONSHIP_TAG}</div>
        </div>
        {/* Data Rows */}
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="hero-card-row">
            <div className="hero-card-row-cell">
              <TextInput type="text" placeholder={COMPANION_PLACEHOLDERS[i]} value={fellowshipRelationships[i].companion} onChange={(e) => handleCompanionChange(i, e.target.value)} />
            </div>
            <div className="hero-card-row-cell hero-card-row-cell-last">
              <TextInput type="text" placeholder={TAG_PLACEHOLDERS[i]} value={fellowshipRelationships[i].relationshipTag} onChange={(e) => handleRelationshipTagChange(i, e.target.value)} />
            </div>
          </div>
        ))}
      </div>
      <div className="hero-promises-container">
        <span className="hero-promises-label">{HERO_CARD_LABELS.PROMISE}:</span>
        {Array.from({ length: 5 }, (_, i) => (
          <InputCheckbox key={i} className="promise-checkbox hero-promise-checkbox" checked={promises[i]} onChange={(e) => handlePromiseChange(i, e.target.checked)} />
        ))}
      </div>
      <div>
        <label className="label-style">{HERO_CARD_LABELS.QUINTESSENCES}</label>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="hero-card-row">
            <div className="hero-card-row-cell hero-card-row-cell-last">
              <TextInput type="text" placeholder={QUINTESSENCE_PLACEHOLDERS[i]} value={quintessences[i]} onChange={(e) => handleQuintessenceChange(i, e.target.value)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
};

export default HeroCard;
