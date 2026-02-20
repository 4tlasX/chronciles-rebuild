import { TopicIcon } from './TopicIcon';
import { TopicColorSwatch } from './TopicColorSwatch';

export interface TopicContentProps {
  name: string;
  icon?: string | null;
  color?: string | null;
  showId?: number;
}

export function TopicContent({ name, icon, color, showId }: TopicContentProps) {
  return (
    <div className="topic-content">
      <div className="topic-content-main">
        <TopicIcon icon={icon ?? null} size="lg" />
        <span className="topic-name">{name}</span>
        <TopicColorSwatch color={color ?? null} />
      </div>
      {showId !== undefined && (
        <span className="topic-id">ID: {showId}</span>
      )}
    </div>
  );
}
