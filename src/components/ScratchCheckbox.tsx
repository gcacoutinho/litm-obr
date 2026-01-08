import React from 'react';
import scratchesSvg from '../assets/scratches.svg?raw';

type ScratchCheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

const ScratchCheckbox: React.ForwardRefExoticComponent<
  ScratchCheckboxProps & React.RefAttributes<HTMLInputElement>
> = React.forwardRef<HTMLInputElement, ScratchCheckboxProps>(
  ({ className, ...props }, ref): React.ReactElement => {
    const svgMarkup: string = scratchesSvg;
    const wrapperClassName: string = ['scratch-checkbox-wrapper', className]
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
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
      </label>
    );
  }
);

ScratchCheckbox.displayName = 'ScratchCheckbox';

export default ScratchCheckbox;
