import { TopicIcon } from './TopicIcon';
import type { Taxonomy } from '@/lib/db';

export interface TopicTagProps {
  topic?: Taxonomy;
  name?: string;
  icon?: string | null;
  color?: string | null;
  className?: string;
}

export function TopicTag({ topic, name, icon, color, className = '' }: TopicTagProps) {
  // Support both topic object and individual props
  const displayName = topic?.name ?? name ?? '';
  const displayIcon = topic?.icon ?? icon ?? null;
  const displayColor = topic?.color ?? color ?? null;

  const classes = ['tag', className].filter(Boolean).join(' ');

  return (
    <span
      className={classes}
      style={displayColor ? { backgroundColor: displayColor, color: '#fff' } : undefined}
    >
      <TopicIcon icon={displayIcon} color="#fff" size="sm" />
      {displayName}
    </span>
  );
}
