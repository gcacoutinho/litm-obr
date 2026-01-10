import type { ChangeEvent, ReactElement } from 'react';
import { TextInput } from '../components';
import { useSpecialImprovementsStorage } from '../hooks/useSpecialImprovementsStorage';

const FellowshipSpecialImprovements = (): ReactElement => {
  const { specialImprovements, updateSpecialImprovements } = useSpecialImprovementsStorage();

  const handleImprovementChange = (index: number, value: string): void => {
    const updated: string[] = [...specialImprovements];
    updated[index] = value;
    updateSpecialImprovements(updated);
  };

  return (
    <div className="improvement-inputs">
      {Array.from({ length: 10 }, (_: unknown, i: number) => (
        <TextInput
          key={i}
          value={specialImprovements[i]}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleImprovementChange(i, e.target.value)}
        />
      ))}
    </div>
  );
};

export default FellowshipSpecialImprovements;
