import React from 'react';

interface InputCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputCheckbox = React.forwardRef<HTMLInputElement, InputCheckboxProps>(
  ({ type, ...props }, ref) => {
    return <input ref={ref} type="checkbox" {...props} />;
  }
);

InputCheckbox.displayName = 'InputCheckbox';

export default InputCheckbox;
