import { useState, useEffect } from 'react';
import { translations as t } from './translations';
import TextInput from './components/TextInput';
import TextAreaInput from './components/TextAreaInput';
import { Character } from './obrd/types';
import { useDebouncedCallback } from './hooks/useDebouncedCallback';

interface BackpackProps {
  character: Character
  onUpdate: (updates: Partial<Character>) => void
}

/**
 * Renders the backpack section with 10 item slots and notes area.
 * Uses debounced saves to avoid excessive updates.
 *
 * @param character - Current character data
 * @param onUpdate - Callback when backpack data changes
 */
const Backpack = ({ character, onUpdate }: BackpackProps) => {
  const [items, setItems] = useState(character.backpack.items);
  const [notes, setNotes] = useState(character.backpack.notes);

  // Sync with character prop changes
  useEffect(() => {
    setItems(character.backpack.items);
    setNotes(character.backpack.notes);
  }, [character.backpack]);

  // Debounced callback for saving items
  const debouncedSaveItems = useDebouncedCallback((updatedItems: string[]) => {
    onUpdate({ backpack: { items: updatedItems, notes } });
  }, 500);

  // Debounced callback for saving notes
  const debouncedSaveNotes = useDebouncedCallback((updatedNotes: string) => {
    onUpdate({ backpack: { items, notes: updatedNotes } });
  }, 500);

  const handleItemChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
    debouncedSaveItems(updated);
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    debouncedSaveNotes(value);
  };

  return (
    <div>
      <label className="label-style">{t['Backpack']}</label>
      <div className="flex-item-container backpack-items-container">
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
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
        />
    </div>
  );
};

export default Backpack;