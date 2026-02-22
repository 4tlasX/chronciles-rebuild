'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

export interface RangeInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
  showValue?: boolean;
  labels?: { min?: string; max?: string };
}

export const RangeInput = forwardRef<HTMLInputElement, RangeInputProps>(
  ({ error, showValue = true, labels, className = '', value, ...props }, ref) => {
    const classes = ['form-input-range', error && 'form-input-error', className]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="range-input-wrapper">
        <input
          ref={ref}
          type="range"
          className={classes}
          value={value}
          {...props}
        />
        <div className="range-input-labels">
          {labels?.min && <span className="range-label-min">{labels.min}</span>}
          {showValue && <span className="range-value">{value}</span>}
          {labels?.max && <span className="range-label-max">{labels.max}</span>}
        </div>
      </div>
    );
  }
);

RangeInput.displayName = 'RangeInput';
