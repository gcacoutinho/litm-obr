import { useState, useEffect } from 'react';
import { translations as t } from './translations';
import TextInput from './components/TextInput';
import TextAreaInput from './components/TextAreaInput';
import { Character } from './obrd/types';

interface BackpackProps {
  character: Character
  onUpdate: (updates: Partial<Character>) => void
}

const Backpack = ({ character, onUpdate }: BackpackProps) => {
  const [items, setItems] = useState(character.backpack.items);
  const [notes, setNotes] = useState(character.backpack.notes);

  // Sync with character prop changes
  useEffect(() => {
    setItems(character.backpack.items);
    setNotes(character.backpack.notes);
  }, [character.backpack]);

  const handleItemChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
    onUpdate({ backpack: { items: updated, notes } });
  };

  const handleNotesChange = (value: string) => {
    const lines = value.split('\n');
    // Trim each line and ensure we have exactly 4 elements
    const updated = Array.from({ length: 4 }, (_, i) => (lines[i] || '').trim());
    setNotes(updated);
    onUpdate({ backpack: { items, notes: updated } });
  };

  return (
    <div>
      <label className="label-style">{t['Backpack']}</label>
      <div className="flex-item-container" style={{ marginBottom: '1rem', width: '100%' }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i}>
            <TextInput type="text" placeholder={t[`Item ${i + 1}`]} value={items[i]} onChange={(e) => handleItemChange(i, e.target.value)} />
          </div>
        ))}
      </div>
      <label className="label-style">{t['Notes']}</label>
      <TextAreaInput
        lines={4}
        placeholder={t['Notes']}
        value={notes.join('\n')}
        onChange={(e) => handleNotesChange(e.currentTarget.value)}
      />
    </div>
  );
};

export default Backpack;