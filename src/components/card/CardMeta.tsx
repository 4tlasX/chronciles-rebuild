import { ReactNode } from 'react';

export interface CardMetaProps {
  children: ReactNode;
  className?: string;
}

export function CardMeta({ children, className = '' }: CardMetaProps) {
  const classes = ['card-meta', className].filter(Boolean).join(' ');
  return <span className={classes}>{children}</span>;
}
