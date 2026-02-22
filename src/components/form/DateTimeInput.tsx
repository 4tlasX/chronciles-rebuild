'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

export interface DateTimeInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
}

export const DateTimeInput = forwardRef<HTMLInputElement, DateTimeInputProps>(
  ({ error, className = '', ...props }, ref) => {
    const classes = ['form-input', error && 'form-input-error', className]
      .filter(Boolean)
      .join(' ');

    return <input ref={ref} type="datetime-local" className={classes} {...props} />;
  }
);

DateTimeInput.displayName = 'DateTimeInput';
