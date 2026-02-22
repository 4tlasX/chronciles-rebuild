'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

export interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, description, className = '', id, checked, onChange, disabled, ...props }, ref) => {
    return (
      <label
        className={`form-toggle-wrapper ${disabled ? 'form-toggle-disabled' : ''}`}
        htmlFor={id}
      >
        <div className="form-toggle-content">
          {label && <span className="form-toggle-label">{label}</span>}
          {description && <span className="form-toggle-description">{description}</span>}
        </div>
        <div className="form-toggle-switch-wrapper">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            className="form-toggle-input"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            {...props}
          />
          <span className={`form-toggle-switch ${checked ? 'form-toggle-switch-on' : ''}`}>
            <span className="form-toggle-knob" />
          </span>
        </div>
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';
