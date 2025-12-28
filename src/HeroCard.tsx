import React, { useState, useEffect } from 'react';
import TextInput from './components/TextInput';
import InputCheckbox from './components/InputCheckbox';
import { translations as t } from './translations';
import { Character } from './obrd/types';

interface HeroCardProps {
  character: Character
  onUpdate: (updates: Partial<Character>) => void
}

const HeroCard = ({ character, onUpdate }: HeroCardProps) => {
  const [characterName, setCharacterName] = useState(character.characterName);
  const [playerName, setPlayerName] = useState(character.playerName);
  const [fellowshipRelationships, setFellowshipRelationships] = useState(character.fellowshipRelationships);
  const [promises, setPromises] = useState(character.promises);
  const [quintessences, setQuintessences] = useState(character.quintessences);

  // Sync with character prop changes
  useEffect(() => {
    setCharacterName(character.characterName);
    setPlayerName(character.playerName);
    setFellowshipRelationships(character.fellowshipRelationships);
    setPromises(character.promises);
    setQuintessences(character.quintessences);
  }, [character]);

  const handleCharacterNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const lines = value.split('\n');
    if (lines.length <= 2) {
      setCharacterName(value);
      onUpdate({ characterName: value });
    }
  };

  const handlePlayerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPlayerName(value);
    onUpdate({ playerName: value });
  };

  const handleCompanionChange = (index: number, value: string) => {
    const updated = [...fellowshipRelationships];
    updated[index] = { ...updated[index], companion: value };
    setFellowshipRelationships(updated);
    onUpdate({ fellowshipRelationships: updated });
  };

  const handleRelationshipTagChange = (index: number, value: string) => {
    const updated = [...fellowshipRelationships];
    updated[index] = { ...updated[index], relationshipTag: value };
    setFellowshipRelationships(updated);
    onUpdate({ fellowshipRelationships: updated });
  };

  const handlePromiseChange = (index: number, checked: boolean) => {
    const updated = [...promises];
    updated[index] = checked;
    setPromises(updated);
    onUpdate({ promises: updated });
  };

  const handleQuintessenceChange = (index: number, value: string) => {
    const updated = [...quintessences];
    updated[index] = value;
    setQuintessences(updated);
    onUpdate({ quintessences: updated });
  };

  return (
    <div>
      <div style={{ margin: '1rem', marginTop: '8px', position: 'relative' }}>
        <textarea
          placeholder={t['Character Name']}
          rows={2}
          value={characterName}
          onChange={handleCharacterNameChange}
          className="input-base"
          style={{ fontSize: '1.5em', width: '100%', resize: 'none', textAlign: 'center' }}
        />
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: '#e4d2c1' }}></div>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label className="label-style">{t['Player Name']}</label>
         <TextInput type="text" placeholder={t['Enter player name']} value={playerName} onChange={handlePlayerNameChange} />
      </div>
      <label className="label-style">{t['FELLOWSHIP RELATIONSHIP']}</label>
      <div style={{ marginBottom: '1rem', width: '100%' }}>
        {/* Header Row */}
         <div style={{ display: 'flex', borderTop: '1px solid #ccc', borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc' }}>
           <div style={{ flex: 1, padding: '8px', color: '#52281a', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#fef8ef', borderRight: '1px solid #e4d2c1' }}>{t['Companion']}</div>
           <div style={{ flex: 1, padding: '8px', color: '#52281a', fontWeight: 'bold', backgroundColor: '#fef8ef', textAlign: 'center' }}>{t['Relationship Tag']}</div>
         </div>
         {/* Data Rows */}
         {Array.from({ length: 5 }, (_, i) => (
           <div key={i} style={{ display: 'flex' }}>
             <div style={{ flex: 1, borderRight: '1px solid #e4d2c1' }}>
               <TextInput type="text" placeholder={t[`Companion ${i + 1}`]} value={fellowshipRelationships[i].companion} onChange={(e) => handleCompanionChange(i, e.target.value)} />
             </div>
             <div style={{ flex: 1 }}>
                <TextInput type="text" placeholder={t[`Tag ${i + 1}`]} value={fellowshipRelationships[i].relationshipTag} onChange={(e) => handleRelationshipTagChange(i, e.target.value)} />
             </div>
           </div>
         ))}
      </div>
       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
          <span style={{ marginRight: '1rem', color: '#52281a', fontWeight: '700', textTransform: 'uppercase'}}>{t['Promise']}:</span>
         {Array.from({ length: 5 }, (_, i) => (
            <InputCheckbox key={i} className="promise-checkbox" style={{ marginRight: '0.5rem' }} checked={promises[i]} onChange={(e) => handlePromiseChange(i, e.target.checked)} />
         ))}
      </div>
      <div>
        <label className="label-style">{t['Quintessences']}</label>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <TextInput type="text" placeholder={t[`Quintessece ${i + 1}`]} value={quintessences[i]} onChange={(e) => handleQuintessenceChange(i, e.target.value)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroCard;
