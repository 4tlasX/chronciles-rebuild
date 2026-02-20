import { Card } from '@/components/card';

export interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <Card>
      <div className="empty-state">
        <p>{message}</p>
      </div>
    </Card>
  );
}
