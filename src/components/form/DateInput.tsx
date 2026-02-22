'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

export interface DateInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ error, className = '', ...props }, ref) => {
    const classes = ['form-input', error && 'form-input-error', className]
      .filter(Boolean)
      .join(' ');

    return <input ref={ref} type="date" className={classes} {...props} />;
  }
);

DateInput.displayName = 'DateInput';
