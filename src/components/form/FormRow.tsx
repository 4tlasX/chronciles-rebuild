import { ReactNode } from 'react';

export interface FormRowProps {
  inline?: boolean;
  children: ReactNode;
}

export function FormRow({ inline = false, children }: FormRowProps) {
  const className = inline ? 'form-row form-row-inline' : 'form-row';
  return <div className={className}>{children}</div>;
}
