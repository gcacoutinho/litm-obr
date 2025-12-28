import React, { useState } from 'react';
import TextInput from './components/TextInput';
import InputCheckbox from './components/InputCheckbox';
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
         <TextInput type="text" placeholder={t['Enter player name']} />
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
               <TextInput type="text" placeholder={t[`Companion ${i + 1}`]} />
             </div>
             <div style={{ flex: 1 }}>
                <TextInput type="text" placeholder={t[`Tag ${i + 1}`]} />
             </div>
           </div>
         ))}
      </div>
       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
          <span style={{ marginRight: '1rem', color: '#52281a', fontWeight: '700', textTransform: 'uppercase'}}>{t['Promise']}:</span>
         {Array.from({ length: 5 }, (_, i) => (
            <InputCheckbox key={i} className="promise-checkbox" style={{ marginRight: '0.5rem' }} />
         ))}
      </div>
      <div>
        <label className="label-style">{t['Quintessences']}</label>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <TextInput type="text" placeholder={t[`Quintessece ${i + 1}`]} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroCard;
