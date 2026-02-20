import { ReactNode } from 'react';

export interface PageContainerProps {
  children: ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return <div className="container">{children}</div>;
}
