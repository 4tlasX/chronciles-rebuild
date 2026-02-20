import { TopicIcon } from './TopicIcon';
import type { Taxonomy } from '@/lib/db';

export interface TopicTagProps {
  topic: Taxonomy;
  className?: string;
}

export function TopicTag({ topic, className = '' }: TopicTagProps) {
  const classes = ['tag', className].filter(Boolean).join(' ');

  return (
    <span
      className={classes}
      style={topic.color ? { backgroundColor: topic.color, color: '#fff' } : undefined}
    >
      <TopicIcon icon={topic.icon} size="sm" />
      {topic.name}
    </span>
  );
}
