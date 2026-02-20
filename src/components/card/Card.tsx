import { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({ children, className = '', noPadding = false }: CardProps) {
  const classes = ['card', noPadding && 'card-no-padding', className]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}
