import { ReactNode } from 'react';
import { Card, CardHeader, CardActions } from '@/components/card';
import { TopicContent } from './TopicContent';
import type { Taxonomy } from '@/lib/db';

export interface TopicCardProps {
  topic: Taxonomy;
  actions?: ReactNode;
}

export function TopicCard({ topic, actions }: TopicCardProps) {
  return (
    <Card>
      <CardHeader>
        <TopicContent
          name={topic.name}
          icon={topic.icon}
          color={topic.color}
          showId={topic.id}
        />
      </CardHeader>
      {actions && <CardActions>{actions}</CardActions>}
    </Card>
  );
}
