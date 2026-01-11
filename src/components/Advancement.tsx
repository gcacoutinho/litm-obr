import React from 'react';
import InputCheckboxGroup from './InputCheckboxGroup';

interface AdvancementProps {
  value: number;
  label: string;
  onCheckboxChange: (value: number) => void;
  containerClassName?: string;
  labelClassName?: string;
  checkboxClassName?: string;
  checkboxAriaLabels?: [string, string, string];
}

const Advancement = ({
  value,
  label,
  onCheckboxChange,
  containerClassName,
  labelClassName,
  checkboxClassName,
  checkboxAriaLabels,
}: AdvancementProps): React.ReactElement => {
  const containerClass = containerClassName
    ? `advancement ${containerClassName}`
    : 'advancement';
  const labelClass = labelClassName
    ? `advancement-label ${labelClassName}`
    : 'advancement-label';
  const getAriaLabel: ((index: number) => string) | undefined = checkboxAriaLabels
    ? (index: number): string => checkboxAriaLabels[index]
    : undefined;

  return (
    <div className={containerClass}>
      <InputCheckboxGroup
        count={3}
        value={value}
        onChange={onCheckboxChange}
        checkboxClassName={checkboxClassName || 'custom-checkbox'}
        getAriaLabel={getAriaLabel}
      />
      <div className={labelClass}>{label}</div>
    </div>
  );
};

export default Advancement;
