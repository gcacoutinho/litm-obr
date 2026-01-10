import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  highlightClassName?: string;
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
const TextInput: React.ForwardRefExoticComponent<
  TextInputProps & React.RefAttributes<HTMLInputElement>
> = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, style, leading, trailing, highlightClassName, value, defaultValue, ...props }, ref): React.ReactElement => {
    const defaultClass: string = 'input-base';
    const combinedClass: string = className ? `${defaultClass} ${className}`.trim() : defaultClass;
    const defaultStyle: React.CSSProperties = { width: '100%', boxSizing: 'border-box' };
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [highlightWidth, setHighlightWidth] = useState<number>(0);
    const highlightText: string = useMemo(() => {
      if (typeof value === 'string' || typeof value === 'number') {
        return String(value);
      }

      if (typeof defaultValue === 'string' || typeof defaultValue === 'number') {
        return String(defaultValue);
      }

      if (Array.isArray(defaultValue)) {
        return defaultValue.join(' ');
      }

      return '';
    }, [value, defaultValue]);
    const highlightStyle: React.CSSProperties | undefined = highlightClassName
      ? ({ '--highlight-width': `${highlightWidth}px` } as React.CSSProperties)
      : undefined;
    const highlightActive: boolean = Boolean(highlightClassName && highlightText.length > 0);

    const handleInputRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;

        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    useLayoutEffect(() => {
      if (!highlightClassName) {
        setHighlightWidth(0);
        return;
      }

      const input = inputRef.current;
      if (!input) {
        return;
      }

      const context = document.createElement('canvas').getContext('2d');
      if (!context) {
        return;
      }

      const style = window.getComputedStyle(input);
      const font = [
        style.fontStyle,
        style.fontVariant,
        style.fontWeight,
        style.fontSize,
        style.fontFamily,
      ]
        .filter((value) => value && value !== 'normal')
        .join(' ');
      context.font = font || `${style.fontSize} ${style.fontFamily}`;

      const paddingLeft = Number.parseFloat(style.paddingLeft) || 0;
      const paddingRight = Number.parseFloat(style.paddingRight) || 0;
      const availableWidth = Math.max(0, input.clientWidth - paddingLeft - paddingRight);
      const measuredWidth = Math.ceil(context.measureText(highlightText).width);
      const nextWidth = Math.min(measuredWidth, availableWidth);
      setHighlightWidth((prev) => (prev === nextWidth ? prev : nextWidth));
    }, [highlightClassName, highlightText]);
    const input: React.ReactElement = (
      <div className="input-content" style={highlightStyle}>
        {highlightActive && <span className={`input-highlight ${highlightClassName}`} />}
        <input
          ref={handleInputRef}
          className={combinedClass}
          {...props}
          value={value}
          defaultValue={defaultValue}
          style={{ ...defaultStyle, ...style }}
        />
      </div>
    );

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
        {input}
        {trailing && <span className="input-trailing">{trailing}</span>}
      </div>
    );
});

TextInput.displayName = 'TextInput';

export default TextInput;
