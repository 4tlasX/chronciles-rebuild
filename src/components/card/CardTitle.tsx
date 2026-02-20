import { ReactNode } from 'react';

export interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  const classes = ['card-title', className].filter(Boolean).join(' ');
  return <h3 className={classes}>{children}</h3>;
}
