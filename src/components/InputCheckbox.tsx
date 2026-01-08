import React from 'react';

type InputCheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

const InputCheckbox: React.ForwardRefExoticComponent<
  InputCheckboxProps & React.RefAttributes<HTMLInputElement>
> = React.forwardRef<HTMLInputElement, InputCheckboxProps>(
  ({ type, ...props }, ref): React.ReactElement => {
    const resolvedType: string = type ?? 'checkbox';
    return <input ref={ref} type={resolvedType} {...props} />;
  }
);

InputCheckbox.displayName = 'InputCheckbox';

export default InputCheckbox;
