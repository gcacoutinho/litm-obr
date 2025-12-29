import { useState, useEffect } from 'react';
import { BACKPACK_LABELS, ITEM_PLACEHOLDERS } from './constants';
import { TextInput, TextAreaInput } from './components';
import { Character } from './obrd/types';
import { useDebouncedCallback } from './hooks';

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
      <label className="label-style">{BACKPACK_LABELS.BACKPACK}</label>
      <div className="flex-item-container backpack-items-container">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i}>
            <TextInput type="text" placeholder={ITEM_PLACEHOLDERS[i]} value={items[i]} onChange={(e) => handleItemChange(i, e.target.value)} />
          </div>
        ))}
      </div>
      <label className="label-style">{BACKPACK_LABELS.NOTES}</label>
      <TextAreaInput
        lines={4}
        placeholder={BACKPACK_LABELS.NOTES}
        value={notes}
        onChange={(e) => handleNotesChange(e.target.value)}
      />
    </div>
  );
};

export default Backpack;