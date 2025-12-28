import ThemeCard from './ThemeCard';
import { Character } from './obrd/types';

interface ThemeCard4Props {
  character: Character
  onUpdate: (updates: Partial<Character>) => void
}

const ThemeCard4 = ({ character, onUpdate }: ThemeCard4Props) => {
  return <ThemeCard cardNumber={4} character={character} onUpdate={onUpdate} />;
};

export default ThemeCard4;