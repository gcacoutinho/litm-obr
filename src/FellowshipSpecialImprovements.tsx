import { TextInput } from './components';

const FellowshipSpecialImprovements = () => {
  return (
    <div className="improvement-inputs">
      {Array.from({ length: 10 }, (_, i) => (
        <TextInput key={i} />
      ))}
    </div>
  );
};

export default FellowshipSpecialImprovements;