'use client';

import type { Post, Taxonomy } from '@/lib/db';
import { TopicIcon, TopicTag } from '@/components/topic';
import { hasSpecializedFields } from '@/lib/taxonomies';

interface PostViewProps {
  post: Post;
  taxonomy?: Taxonomy | null;
}

export function PostView({ post, taxonomy }: PostViewProps) {
  const date = formatDate(post.createdAt);
  const time = formatTime(post.createdAt);
  const metadata = post.metadata || {};
  const hasSpecialized = taxonomy && hasSpecializedFields(taxonomy.name);

  // Filter metadata for display
  const displayMetadata = Object.entries(metadata).filter(
    ([key]) => !key.startsWith('_') && !isSpecializedField(key, taxonomy?.name)
  );

  const shortDate = formatShortDate(post.createdAt);

  return (
    <article className="post-view">
      <header className="post-view-header">
        <div className="post-view-header-row">
          <span className="post-view-date-short">{shortDate}</span>
          {taxonomy && (
            <div className="post-view-topic">
              <TopicTag name={taxonomy.name} icon={taxonomy.icon} />
            </div>
          )}
        </div>
        <div className="post-view-meta">
          <span className="post-view-date">{date}</span>
          <span className="post-view-time">{time}</span>
        </div>
      </header>

      {/* Specialized metadata display */}
      {hasSpecialized && (
        <div className="post-view-specialized-metadata">
          <SpecializedMetadataDisplay taxonomyName={taxonomy.name} metadata={metadata} />
        </div>
      )}

      <div className="post-view-content">
        {post.content}
      </div>

      {/* Generic metadata display */}
      {displayMetadata.length > 0 && (
        <div className="post-view-metadata">
          {displayMetadata.map(([key, value]) => (
            <div key={key} className="post-view-metadata-item">
              <span className="post-view-metadata-key">{key}</span>
              <span className="post-view-metadata-value">{formatMetadataValue(value)}</span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

// Helper to check if a key is a specialized field
function isSpecializedField(key: string, taxonomyName?: string): boolean {
  if (!taxonomyName) return false;
  const name = taxonomyName.toLowerCase();

  const specializedKeys: Record<string, string[]> = {
    task: ['isCompleted', 'isInProgress', 'isAutoMigrating', 'milestoneIds'],
    goal: ['type', 'status', 'targetDate'],
    milestone: ['goalIds', 'isCompleted', 'completedAt'],
    event: ['startDate', 'startTime', 'endDate', 'endTime', 'location', 'address', 'phone', 'notes'],
    meeting: ['topic', 'attendees', 'startDate', 'startTime', 'endDate', 'endTime', 'location', 'address', 'phone', 'notes'],
    symptom: ['severity', 'occurredAt', 'duration', 'notes'],
    food: ['mealType', 'consumedAt', 'ingredients', 'calories', 'notes'],
    medication: ['dosage', 'frequency', 'scheduleTimes', 'isActive', 'notes', 'startDate'],
    exercise: ['type', 'otherType', 'duration', 'intensity', 'distance', 'distanceUnit', 'calories', 'performedAt', 'notes'],
  };

  return specializedKeys[name]?.includes(key) || false;
}

// Specialized metadata display component
function SpecializedMetadataDisplay({
  taxonomyName,
  metadata,
}: {
  taxonomyName: string;
  metadata: Record<string, unknown>;
}) {
  const name = taxonomyName.toLowerCase();

  switch (name) {
    case 'task':
      return (
        <div className="specialized-metadata task-metadata">
          {Boolean(metadata.isCompleted) && <span className="status-badge completed">Completed</span>}
          {Boolean(metadata.isInProgress) && <span className="status-badge in-progress">In Progress</span>}
          {Boolean(metadata.isAutoMigrating) && <span className="status-badge auto-migrate">Auto-migrate</span>}
        </div>
      );

    case 'goal':
      return (
        <div className="specialized-metadata goal-metadata">
          <span className="status-badge">{formatLabel(String(metadata.type || ''))}</span>
          <span className={`status-badge ${String(metadata.status || '')}`}>{formatLabel(String(metadata.status || ''))}</span>
          {Boolean(metadata.targetDate) && (
            <span className="metadata-detail">Target: {formatDateValue(String(metadata.targetDate))}</span>
          )}
        </div>
      );

    case 'event':
    case 'meeting':
      return (
        <div className="specialized-metadata event-metadata">
          {Boolean(metadata.startDate) && (
            <span className="metadata-detail">
              {formatDateValue(String(metadata.startDate))} at {String(metadata.startTime || '')}
            </span>
          )}
          {Boolean(metadata.location) && <span className="metadata-detail">📍 {String(metadata.location)}</span>}
          {name === 'meeting' && Boolean(metadata.attendees) && (
            <span className="metadata-detail">👥 {String(metadata.attendees)}</span>
          )}
        </div>
      );

    case 'symptom':
      return (
        <div className="specialized-metadata symptom-metadata">
          <span className="severity-badge" data-severity={String(metadata.severity || 5)}>
            Severity: {String(metadata.severity || 5)}/10
          </span>
          {Boolean(metadata.duration) && <span className="metadata-detail">{String(metadata.duration)} minutes</span>}
        </div>
      );

    case 'food':
      return (
        <div className="specialized-metadata food-metadata">
          <span className="status-badge">{formatLabel(String(metadata.mealType || ''))}</span>
          {Boolean(metadata.calories) && <span className="metadata-detail">{String(metadata.calories)} cal</span>}
        </div>
      );

    case 'medication':
      return (
        <div className="specialized-metadata medication-metadata">
          {Boolean(metadata.dosage) && <span className="metadata-detail">{String(metadata.dosage)}</span>}
          <span className="status-badge">{formatLabel(String(metadata.frequency || ''))}</span>
          {Boolean(metadata.isActive) && <span className="status-badge active">Active</span>}
        </div>
      );

    case 'exercise':
      return (
        <div className="specialized-metadata exercise-metadata">
          <span className="status-badge">{formatLabel(String(metadata.type || ''))}</span>
          {Boolean(metadata.duration) && <span className="metadata-detail">{String(metadata.duration)} min</span>}
          {Boolean(metadata.distance) && (
            <span className="metadata-detail">
              {String(metadata.distance)} {String(metadata.distanceUnit || '')}
            </span>
          )}
          {Boolean(metadata.calories) && <span className="metadata-detail">{String(metadata.calories)} cal</span>}
        </div>
      );

    default:
      return null;
  }
}

function formatLabel(value: string): string {
  if (!value) return '';
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDateValue(value: string): string {
  try {
    return new Date(value).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return value;
  }
}

function formatMetadataValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatShortDate(date: Date): string {
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
