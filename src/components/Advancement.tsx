import React from 'react';
import InputCheckbox from './InputCheckbox';

interface AdvancementProps {
  checkboxes: [boolean, boolean, boolean];
  label: string;
  onCheckboxChange: (index: 0 | 1 | 2, checked: boolean) => void;
  containerStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  checkboxClassName?: string;
  checkboxAriaLabels?: [string, string, string];
}

const Advancement = ({
  checkboxes,
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

  const checkboxesContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const defaultCheckboxStyle: React.CSSProperties = {
    marginRight: '0.5rem',
  };

  return (
    <div style={defaultContainerStyle}>
      <div style={checkboxesContainerStyle}>
        {checkboxes.map((checked, index) => (
          <InputCheckbox
            key={index}
            className={checkboxClassName || 'promise-checkbox'}
            style={defaultCheckboxStyle}
            checked={checked}
            onChange={(e) =>
              onCheckboxChange(index as 0 | 1 | 2, e.target.checked)
            }
            aria-label={
              checkboxAriaLabels ? checkboxAriaLabels[index] : undefined
            }
          />
        ))}
      </div>
      <div style={defaultLabelStyle}>{label}</div>
    </div>
  );
};

export default Advancement;
