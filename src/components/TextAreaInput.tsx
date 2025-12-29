import React, { useRef } from 'react';
import './TextAreaInput.css';

interface TextAreaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  lines: number;
}

/**
 * Multi-line text input with line-count visualization.
 * Displays horizontal lines in the background to show available lines.
 *
 * @param lines - Number of lines to display
 * @param props - Standard HTML textarea element props
 * @param ref - Reference to the underlying textarea element
 *
 * @example
 * <TextAreaInput
 *   lines={4}
 *   placeholder="Enter notes"
 *   value={notes}
 *   onChange={handleChange}
 * />
 */
const TextAreaInput = React.forwardRef<HTMLTextAreaElement, TextAreaInputProps>(
  ({ className, style, lines, value: propValue, ...props }, ref) => {
    const defaultClass = 'input-base';
    const combinedClass = className ? `${defaultClass} ${className}`.trim() : defaultClass;

    const lineHeightEm = 1.5;
    const lineHeight = `${lineHeightEm}em`;

    const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      <div className="input-wrapper">
        <textarea
          ref={ref ? (el) => {
            textareaRef.current = el;
            if (typeof ref === 'function') {
              ref(el);
            } else if (ref) {
              ref.current = el;
            }
          } : textareaRef}
          rows={lines}
          className={combinedClass}
          value={propValue ?? ''}
          {...props}
          style={{ ...defaultStyle, ...style }}
        />
      </div>
    );
  }
);

TextAreaInput.displayName = 'TextAreaInput';

export default TextAreaInput;
