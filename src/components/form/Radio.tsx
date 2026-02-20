'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const classes = ['form-radio', className].filter(Boolean).join(' ');

    return (
      <label className="form-radio-wrapper" htmlFor={id}>
        <input ref={ref} type="radio" id={id} className={classes} {...props} />
        {label && <span className="form-radio-label">{label}</span>}
      </label>
    );
  }
);

Radio.displayName = 'Radio';
