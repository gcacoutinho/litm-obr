import React from 'react';
import scratchesSvg from '../assets/scratches.svg?raw';

interface ScratchCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const ScratchCheckbox = React.forwardRef<HTMLInputElement, ScratchCheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <label className="scratch-checkbox-wrapper">
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
