import { ReactNode } from 'react';

export interface FormPanelProps {
  title: string;
  children: ReactNode;
}

export function FormPanel({ title, children }: FormPanelProps) {
  return (
    <div className="form-panel">
      <h2 className="form-panel-title">{title}</h2>
      {children}
    </div>
  );
}
