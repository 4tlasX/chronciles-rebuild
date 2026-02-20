'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
  showToggle?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ error, showToggle = true, className = '', ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    const classes = ['form-input', error && 'form-input-error', className]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="password-input-wrapper">
        <input
          ref={ref}
          type={visible ? 'text' : 'password'}
          className={classes}
          {...props}
        />
        {showToggle && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setVisible(!visible)}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
