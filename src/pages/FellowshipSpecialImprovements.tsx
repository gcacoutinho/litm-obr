import type { ChangeEvent, ReactElement } from 'react';
import { TextInput } from '../components';
import { useSpecialImprovementsForm } from '../hooks/useSpecialImprovementsForm';

const FellowshipSpecialImprovements = (): ReactElement => {
  const { improvements, handleImprovementChange } = useSpecialImprovementsForm();

  return (
    <div className="improvement-inputs">
      {Array.from({ length: 10 }, (_: unknown, i: number) => (
        <TextInput
          key={i}
          value={improvements[i]}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleImprovementChange(i, e.target.value)}
        />
      ))}
    </div>
  );
};

export default FellowshipSpecialImprovements;
