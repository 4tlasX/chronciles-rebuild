'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

export interface EmailInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({ error, className = '', ...props }, ref) => {
    const classes = ['form-input', error && 'form-input-error', className]
      .filter(Boolean)
      .join(' ');

    return <input ref={ref} type="email" className={classes} {...props} />;
  }
);

EmailInput.displayName = 'EmailInput';
