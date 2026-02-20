import { ReactNode } from 'react';

export interface FormGroupProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormGroup({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: FormGroupProps) {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={htmlFor}>
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <span className="form-hint">{hint}</span>}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
