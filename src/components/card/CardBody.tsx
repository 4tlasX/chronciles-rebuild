import { ReactNode } from 'react';

export interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  const classes = ['card-body', className].filter(Boolean).join(' ');
  return <div className={classes}>{children}</div>;
}
