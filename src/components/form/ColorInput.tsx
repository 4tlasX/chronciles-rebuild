'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

export interface ColorInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {}

export const ColorInput = forwardRef<HTMLInputElement, ColorInputProps>(
  ({ className = '', ...props }, ref) => {
    const classes = ['form-color', className].filter(Boolean).join(' ');

    return <input ref={ref} type="color" className={classes} {...props} />;
  }
);

ColorInput.displayName = 'ColorInput';
