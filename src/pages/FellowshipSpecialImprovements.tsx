import { TextInput } from '../components';
import { useSpecialImprovementsForm } from '../hooks/useSpecialImprovementsForm';

const FellowshipSpecialImprovements = () => {
  const { improvements, handleImprovementChange } = useSpecialImprovementsForm();

  return (
    <div className="improvement-inputs">
      {Array.from({ length: 10 }, (_, i) => (
        <TextInput
          key={i}
          value={improvements[i]}
          onChange={(e) => handleImprovementChange(i, e.target.value)}
        />
      ))}
    </div>
  );
};

export default FellowshipSpecialImprovements;