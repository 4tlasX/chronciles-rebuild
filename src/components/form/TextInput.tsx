'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ error, className = '', ...props }, ref) => {
    const classes = ['form-input', error && 'form-input-error', className]
      .filter(Boolean)
      .join(' ');

    return <input ref={ref} type="text" className={classes} {...props} />;
  }
);

TextInput.displayName = 'TextInput';
