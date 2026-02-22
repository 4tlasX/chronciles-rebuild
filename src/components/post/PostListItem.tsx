'use client';

import type { Post, Taxonomy } from '@/lib/db';
import { TopicIcon } from '@/components/topic';

interface PostListItemProps {
  post: Post;
  taxonomy?: Taxonomy | null;
  isActive?: boolean;
  onClick?: () => void;
}

export function PostListItem({ post, taxonomy, isActive = false, onClick }: PostListItemProps) {
  const title = getPostTitle(post);
  const preview = getPostPreview(post);
  const date = formatDate(post.createdAt);
  const isCompleted = post.metadata?.isCompleted === true;

  return (
    <div
      className={`post-list-item ${isActive ? 'post-list-item-active' : ''} ${isCompleted ? 'post-list-item-completed' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      <div className="post-list-item-header">
        {taxonomy && (
          <span className="post-list-item-topic">
            <TopicIcon icon={taxonomy.icon} size="sm" />
          </span>
        )}
        <div className="post-list-item-title">{title}</div>
      </div>
      <div className="post-list-item-preview">{preview}</div>
      <div className="post-list-item-date">{date}</div>
    </div>
  );
}

function getPostTitle(post: Post): string {
  // Try to get title from metadata
  if (post.metadata && typeof post.metadata === 'object' && 'title' in post.metadata) {
    return String(post.metadata.title);
  }
  // Use first line of content as title
  const firstLine = post.content.split('\n')[0].trim();
  return firstLine.length > 50 ? firstLine.slice(0, 50) + '...' : firstLine || 'Untitled';
}

function getPostPreview(post: Post): string {
  // Skip first line (title) and get preview from rest
  const lines = post.content.split('\n');
  const rest = lines.slice(1).join(' ').trim();
  return rest.length > 80 ? rest.slice(0, 80) + '...' : rest || 'No content';
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
