import { translations as t } from './translations';
import TextInput from './components/TextInput';

const Backpack = () => {
  return (
    <div>
      <label className="label-style">{t['Backpack']}</label>
      <div className="flex-item-container" style={{ marginBottom: '1rem', width: '100%' }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i}>
            <TextInput type="text" placeholder={t[`Item ${i + 1}`]} />
          </div>
        ))}
      </div>
      <label className="label-style">{t['Notes']}</label>
      <div className="flex-item-container" style={{ marginBottom: '1rem', width: '100%' }}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i}>
            <TextInput type="text" placeholder={t[`Note ${i + 1}`]} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Backpack;