import ThemeCard from './ThemeCard';
import { Character } from './obrd/types';

interface ThemeCard3Props {
  character: Character
  onUpdate: (updates: Partial<Character>) => void
}

const ThemeCard3 = ({ character, onUpdate }: ThemeCard3Props) => {
  return <ThemeCard cardNumber={3} character={character} onUpdate={onUpdate} />;
};

export default ThemeCard3;