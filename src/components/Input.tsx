import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, style, type, ...props }, ref) => {
  const isCheckbox = type === 'checkbox';
  const defaultClass = isCheckbox ? '' : 'input-base';
  const combinedClass = className ? `${defaultClass} ${className}`.trim() : defaultClass;
  const defaultStyle: React.CSSProperties = isCheckbox ? {} : { width: '100%', boxSizing: 'border-box' };
  
  const input = <input ref={ref} type={type} className={combinedClass} {...props} style={{ ...defaultStyle, ...style }} />;
  
  // Wrap non-checkbox inputs with padding container
  if (isCheckbox) {
    return input;
  }
  
  return (
    <div style={{ padding: '8px' }}>
      {input}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;