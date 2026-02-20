import { ReactNode } from 'react';

export interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  const classes = ['card-footer', className].filter(Boolean).join(' ');
  return <div className={classes}>{children}</div>;
}
