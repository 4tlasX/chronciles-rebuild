'use client';

import type { Taxonomy } from '@/lib/db';
import { TopicIcon } from './TopicIcon';

interface TopicListItemProps {
  topic: Taxonomy;
  postCount?: number;
  isActive?: boolean;
  onClick?: () => void;
}

export function TopicListItem({
  topic,
  postCount = 0,
  isActive = false,
  onClick,
}: TopicListItemProps) {
  return (
    <div
      className={`topic-list-item ${isActive ? 'topic-list-item-active' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      <div className="topic-list-item-icon">
        <TopicIcon icon={topic.icon} color={topic.color} size="md" />
      </div>
      <div className="topic-list-item-content">
        <span className="topic-list-item-name">{topic.name}</span>
      </div>
      {postCount > 0 && (
        <span className="topic-list-item-count">{postCount}</span>
      )}
    </div>
  );
}
