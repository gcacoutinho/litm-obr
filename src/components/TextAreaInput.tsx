import React from 'react';

interface TextAreaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  lines: number;
}

const TextAreaInput = React.forwardRef<HTMLTextAreaElement, TextAreaInputProps>(
  ({ className, style, lines, ...props }, ref) => {
    const defaultClass = 'input-base';
    const combinedClass = className ? `${defaultClass} ${className}`.trim() : defaultClass;

    const lineHeightEm = 1.5;
    const lineHeight = `${lineHeightEm}em`;

    const defaultStyle: React.CSSProperties = {
      width: '100%',
      boxSizing: 'border-box',
      resize: 'none',
      overflow: 'hidden',
      lineHeight: lineHeightEm,
      height: `calc(${lines} * ${lineHeight})`,
      minHeight: `calc(${lines} * ${lineHeight})`,
      maxHeight: `calc(${lines} * ${lineHeight})`,
      borderBottom: 'none',
      padding: 0,
      backgroundRepeat: 'repeat-y',
      backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent calc(${lineHeight} - 1px), #e4d2c1 calc(${lineHeight} - 1px), #e4d2c1 ${lineHeight})`,
    };

    return (
      <div style={{ padding: '8px' }}>
        <textarea
          ref={ref}
          rows={lines}
          className={combinedClass}
          {...props}
          style={{ ...defaultStyle, ...style }}
        />
      </div>
    );
  }
);

TextAreaInput.displayName = 'TextAreaInput';

export default TextAreaInput;
