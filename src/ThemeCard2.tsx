import ThemeCard from './ThemeCard';
import { Character } from './obrd/types';

interface ThemeCard2Props {
  character: Character
  onUpdate: (updates: Partial<Character>) => void
}

const ThemeCard2 = ({ character, onUpdate }: ThemeCard2Props) => {
  return <ThemeCard cardNumber={2} character={character} onUpdate={onUpdate} />;
};

export default ThemeCard2;