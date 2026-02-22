import { getIconDefinition } from '@/lib/icons';

export interface TopicIconProps {
  icon: string | null;
  color?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
};

export function TopicIcon({ icon, color, size = 'md', className = '' }: TopicIconProps) {
  const iconDef = icon ? getIconDefinition(icon) : null;
  const pixelSize = sizeMap[size];
  const classes = ['topic-icon', className].filter(Boolean).join(' ');

  // If no icon or invalid icon name, show colored dot fallback
  if (!iconDef) {
    return (
      <span
        className={classes}
        style={{
          display: 'inline-block',
          width: pixelSize * 0.5,
          height: pixelSize * 0.5,
          borderRadius: '50%',
          backgroundColor: color || '#6366f1',
        }}
        role="img"
        aria-label="topic indicator"
      />
    );
  }

  return (
    <svg
      className={classes}
      width={pixelSize}
      height={pixelSize}
      viewBox={iconDef.viewBox}
      fill={color || 'currentColor'}
      role="img"
      aria-label="topic icon"
    >
      <path d={iconDef.path} />
    </svg>
  );
}
