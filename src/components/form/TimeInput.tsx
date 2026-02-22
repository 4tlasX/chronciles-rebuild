'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

export interface TimeInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
}

export const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
  ({ error, className = '', ...props }, ref) => {
    const classes = ['form-input', error && 'form-input-error', className]
      .filter(Boolean)
      .join(' ');

    return <input ref={ref} type="time" className={classes} {...props} />;
  }
);

TimeInput.displayName = 'TimeInput';
