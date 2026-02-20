import { ReactNode } from 'react';

export interface CardActionsProps {
  children: ReactNode;
  className?: string;
}

export function CardActions({ children, className = '' }: CardActionsProps) {
  const classes = ['card-actions', className].filter(Boolean).join(' ');
  return <div className={classes}>{children}</div>;
}
