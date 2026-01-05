import { useTranslation } from 'react-i18next';
import { TextInput, TextAreaInput } from '../components';
import { Character } from '../obrd/types';

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
  const { t } = useTranslation();
  const items = character.backpack.items;
  const notes = character.backpack.notes;

  const handleItemChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    onUpdate({ backpack: { items: updated, notes } });
  };

  const handleNotesChange = (value: string) => {
    onUpdate({ backpack: { items, notes: value } });
  };

  return (
    <div>
      <label className="label-style">{t('backpack.label')}</label>
      <div className="flex-item-container backpack-items-container">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i}>
            <TextInput type="text" placeholder={`${t('backpack.item')} ${i + 1}`} value={items[i]} onChange={(e) => handleItemChange(i, e.target.value)} />
          </div>
        ))}
      </div>
      <label className="label-style">{t('backpack.notes')}</label>
      <TextAreaInput
        lines={4}
        placeholder={t('backpack.notes')}
        value={notes}
        onChange={(e) => handleNotesChange(e.target.value)}
      />
    </div>
  );
};

export default Backpack;
