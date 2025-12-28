import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(({ className, style, leading, trailing, ...props }, ref) => {
  const defaultClass = 'input-base';
  const combinedClass = className ? `${defaultClass} ${className}`.trim() : defaultClass;
  const defaultStyle: React.CSSProperties = { width: '100%', boxSizing: 'border-box' };
  
  const input = <input ref={ref} className={combinedClass} {...props} style={{ ...defaultStyle, ...style }} />;
  
  // If no leading or trailing slots, use current behavior
  if (!leading && !trailing) {
    return (
      <div style={{ padding: '8px' }}>
        {input}
      </div>
    );
  }
  
  // With leading/trailing slots, use flex layout
  return (
    <div style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {leading && <span className="input-leading">{leading}</span>}
      <div style={{ flex: 1, minWidth: 0 }}>
        {input}
      </div>
      {trailing && <span className="input-trailing">{trailing}</span>}
    </div>
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;
