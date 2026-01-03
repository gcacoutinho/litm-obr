import React from 'react';
import InputCheckboxGroup from './InputCheckboxGroup';

interface AdvancementProps {
  value: number;
  label: string;
  onCheckboxChange: (value: number) => void;
  containerStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  checkboxClassName?: string;
  checkboxAriaLabels?: [string, string, string];
}

const Advancement = ({
  value,
  label,
  onCheckboxChange,
  containerStyle,
  labelStyle,
  checkboxClassName,
  checkboxAriaLabels,
}: AdvancementProps) => {
  const defaultContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    ...containerStyle,
  };

  const defaultLabelStyle: React.CSSProperties = {
    ...labelStyle,
  };
  const getAriaLabel = checkboxAriaLabels
    ? (index: number) => checkboxAriaLabels[index]
    : undefined;

  return (
    <div style={defaultContainerStyle}>
      <InputCheckboxGroup
        count={3}
        value={value}
        onChange={onCheckboxChange}
        checkboxClassName={checkboxClassName || 'promise-checkbox'}
        getAriaLabel={getAriaLabel}
      />
      <div style={defaultLabelStyle}>{label}</div>
    </div>
  );
};

export default Advancement;
