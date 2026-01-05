import React from 'react';

type InputCheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

const InputCheckbox = React.forwardRef<HTMLInputElement, InputCheckboxProps>(
  ({ type, ...props }, ref) => {
    const resolvedType = type ?? 'checkbox';
    return <input ref={ref} type={resolvedType} {...props} />;
  }
);

InputCheckbox.displayName = 'InputCheckbox';

export default InputCheckbox;
