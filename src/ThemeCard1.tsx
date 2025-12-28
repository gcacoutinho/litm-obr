import ThemeCard from './ThemeCard';
import { Character } from './obrd/types';

interface ThemeCard1Props {
  character: Character
  onUpdate: (updates: Partial<Character>) => void
}

const ThemeCard1 = ({ character, onUpdate }: ThemeCard1Props) => {
  return <ThemeCard cardNumber={1} character={character} onUpdate={onUpdate} />;
};

export default ThemeCard1;