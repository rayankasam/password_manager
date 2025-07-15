import { Input } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

interface EditableCellProps {
  value: string;
  onChange: (newValue: string) => void;
}

const EditableCell = ({ value, onChange }: EditableCellProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);  // Reset if parent value changes externally
  }, [value]);

  return (
    <Input
      value={localValue}
      onChange={(e) => {
        setLocalValue(e.target.value);
        onChange(e.target.value);
      }}
      autoFocus
    />
  );
};

export default EditableCell;

