'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ error, className = '', ...props }, ref) => {
    const classes = ['form-input', error && 'form-input-error', className]
      .filter(Boolean)
      .join(' ');

    return <input ref={ref} type="number" className={classes} {...props} />;
  }
);

NumberInput.displayName = 'NumberInput';
