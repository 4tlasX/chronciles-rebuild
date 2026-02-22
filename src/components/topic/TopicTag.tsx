import { TopicIcon } from './TopicIcon';
import type { Taxonomy } from '@/lib/db';

export interface TopicTagProps {
  topic?: Taxonomy;
  name?: string;
  icon?: string | null;
  className?: string;
}

export function TopicTag({ topic, name, icon, className = '' }: TopicTagProps) {
  // Support both topic object and individual props
  const displayName = topic?.name ?? name ?? '';
  const displayIcon = topic?.icon ?? icon ?? null;

  const classes = ['tag', className].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      <TopicIcon icon={displayIcon} size="sm" />
      {displayName}
    </span>
  );
}
