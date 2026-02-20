'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const classes = ['form-checkbox', className].filter(Boolean).join(' ');

    return (
      <label className="form-checkbox-wrapper" htmlFor={id}>
        <input ref={ref} type="checkbox" id={id} className={classes} {...props} />
        {label && <span className="form-checkbox-label">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
