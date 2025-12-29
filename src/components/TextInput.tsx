import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

/**
 * Flexible text input component with optional leading and trailing elements.
 * Automatically adjusts layout based on whether leading/trailing slots are used.
 *
 * @param leading - Optional element to display before the input (e.g., icon or label)
 * @param trailing - Optional element to display after the input (e.g., checkbox or button)
 * @param props - Standard HTML input element props
 * @param ref - Reference to the underlying input element
 *
 * @example
 * <TextInput
 *   leading={<label>Name:</label>}
 *   trailing={<ScratchCheckbox />}
 *   placeholder="Enter name"
 * />
 */
const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(({ className, style, leading, trailing, ...props }, ref) => {
  const defaultClass = 'input-base';
  const combinedClass = className ? `${defaultClass} ${className}`.trim() : defaultClass;
  const defaultStyle: React.CSSProperties = { width: '100%', boxSizing: 'border-box' };
  
  const input = <input ref={ref} className={combinedClass} {...props} style={{ ...defaultStyle, ...style }} />;
  
  // If no leading or trailing slots, use current behavior
  if (!leading && !trailing) {
    return (
      <div className="input-wrapper">
        {input}
      </div>
    );
  }
  
  // With leading/trailing slots, use flex layout
  return (
    <div className="input-wrapper input-wrapper-flex">
      {leading && <span className="input-leading">{leading}</span>}
      <div className="input-content">
        {input}
      </div>
      {trailing && <span className="input-trailing">{trailing}</span>}
    </div>
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;
