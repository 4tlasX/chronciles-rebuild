import { ReactNode } from 'react';

export interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  const classes = ['card-header', className].filter(Boolean).join(' ');
  return <div className={classes}>{children}</div>;
}
