import React, { useRef, useCallback, useState } from 'react';
import './TextAreaInput.css';

interface TextAreaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  lines: number;
}

const TextAreaInput = React.forwardRef<HTMLTextAreaElement, TextAreaInputProps>(
  ({ className, style, lines, onChange, value: propValue, ...props }, ref) => {
    const defaultClass = 'input-base';
    const combinedClass = className ? `${defaultClass} ${className}`.trim() : defaultClass;

    const lineHeightEm = 1.5;
    const lineHeight = `${lineHeightEm}em`;
    const baseFontSizePixels = 16; // standard browser default
    const lineHeightPixels = lineHeightEm * baseFontSizePixels;

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isFlashing, setIsFlashing] = useState(false);
    const prevValueRef = useRef<string>(propValue?.toString() ?? '');

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = event.target.value;
        const textarea = event.target;
        const isDeleting = newValue.length < prevValueRef.current.length;

        // Allow deletions unconditionally
        if (isDeleting) {
          prevValueRef.current = newValue;
          if (onChange) {
            onChange(event);
          }
          return;
        }

        // Measure scroll height to determine rendered line count for additions
        // Use setTimeout to ensure DOM has updated with new content
        setTimeout(() => {
          const scrollHeight = textarea.scrollHeight;
          const renderedLines = Math.ceil(scrollHeight / lineHeightPixels);

          if (renderedLines > lines) {
            // Exceeded limit: revert to previous value and flash
            textarea.value = prevValueRef.current;
            
            // Trigger flash animation
            setIsFlashing(true);
            const timeoutId = setTimeout(() => setIsFlashing(false), 600);
            return () => clearTimeout(timeoutId);
          } else {
            // Within limit: update previous value and call original onChange
            prevValueRef.current = newValue;
            
            if (onChange) {
              onChange(event);
            }
          }
        }, 0);
      },
      [lines, onChange, lineHeightPixels]
    );

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
          ref={ref ? (el) => {
            textareaRef.current = el;
            if (typeof ref === 'function') {
              ref(el);
            } else if (ref) {
              ref.current = el;
            }
          } : textareaRef}
          rows={lines}
          className={`${combinedClass} ${isFlashing ? 'textareaInput--error' : ''}`}
          value={propValue ?? ''}
          onChange={handleChange}
          {...props}
          style={{ ...defaultStyle, ...style }}
        />
      </div>
    );
  }
);

TextAreaInput.displayName = 'TextAreaInput';

export default TextAreaInput;
