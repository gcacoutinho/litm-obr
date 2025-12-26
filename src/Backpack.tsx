import { translations as t } from './translations';
import Input from './components/Input';

const Backpack = () => {
  return (
    <div>
      <label className="label-style">{t['Backpack']}</label>
      <table style={{ marginBottom: '1rem', borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
          {Array.from({ length: 10 }, (_, i) => (
            <tr key={i}>
              <td style={{ border: '1px solid #ccc', padding: 0 }}>
                <Input type="text" placeholder={t[`Item ${i + 1}`]} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <label className="label-style">{t['Notes']}</label>
      <table style={{ marginBottom: '1rem', borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
          {Array.from({ length: 4 }, (_, i) => (
            <tr key={i}>
              <td style={{ border: '1px solid #ccc', padding: 0 }}>
                <Input type="text" placeholder={t[`Note ${i + 1}`]} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Backpack;