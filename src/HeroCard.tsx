import React, { useState } from 'react';
import { translations as t } from './translations';

const HeroCard = () => {
  const [characterName, setCharacterName] = useState('');

  const handleCharacterNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const lines = value.split('\n');
    if (lines.length <= 2) {
      setCharacterName(value);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem', position: 'relative' }}>
        <textarea
          placeholder={t['Character Name']}
          rows={2}
          value={characterName}
          onChange={handleCharacterNameChange}
          style={{ fontSize: '1.5em', width: '100%', resize: 'none', textAlign: 'center' }}
        />
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: '#e4d2c1' }}></div>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label className="label-style">{t['Player Name']}</label>
        <input type="text" placeholder={t['Enter player name']} />
      </div>
      <label className="label-style">{t['FELLOWSHIP RELATIONSHIP']}</label>
      <table style={{ marginBottom: '1rem', borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>{t['Companion']}</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>{t['Relationship Tag']}</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }, (_, i) => (
            <tr key={i}>
               <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                 <input type="text" placeholder={t[`Companion ${i + 1}`]} style={{ width: '100%' }} />
               </td>
               <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                 <input type="text" placeholder={t[`Tag ${i + 1}`]} style={{ width: '100%' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ marginRight: '1rem' }}>{t['Promise']}:</span>
        {Array.from({ length: 5 }, (_, i) => (
          <input key={i} type="checkbox" style={{ marginRight: '0.5rem' }} />
        ))}
      </div>
    </div>
  );
};

export default HeroCard;