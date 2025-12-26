import { translations as t } from './translations';

const Backpack = () => {
  return (
    <div>
      <label className="label-style">{t['Backpack']}</label>
      <table style={{ marginBottom: '1rem', borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
          {Array.from({ length: 10 }, (_, i) => (
            <tr key={i}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <input type="text" placeholder={t[`Item ${i + 1}`]} />
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
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <input type="text" placeholder={t[`Note ${i + 1}`]} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Backpack;