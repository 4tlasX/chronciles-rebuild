export interface TopicIconProps {
  icon: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
};

export function TopicIcon({ icon, size = 'md', className = '' }: TopicIconProps) {
  if (!icon) return null;

  const classes = ['topic-icon', className].filter(Boolean).join(' ');

  return (
    <span
      className={classes}
      style={{ fontSize: sizeMap[size] }}
      role="img"
      aria-label="topic icon"
    >
      {icon}
    </span>
  );
}
