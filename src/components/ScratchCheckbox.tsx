import React from 'react';
import scratchesSvg from '../assets/scratches.svg?raw';

type ScratchCheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

const ScratchCheckbox = React.forwardRef<HTMLInputElement, ScratchCheckboxProps>(
  ({ className, ...props }, ref) => {
    const wrapperClassName = ['scratch-checkbox-wrapper', className]
      .filter(Boolean)
      .join(' ');
    return (
      <label className={wrapperClassName}>
        <input
          ref={ref}
          type="checkbox"
          className="scratch-checkbox-input"
          {...props}
        />
        <div
          className="scratch-checkbox-icon"
          dangerouslySetInnerHTML={{ __html: scratchesSvg }}
        />
      </label>
    );
  }
);

ScratchCheckbox.displayName = 'ScratchCheckbox';

export default ScratchCheckbox;
