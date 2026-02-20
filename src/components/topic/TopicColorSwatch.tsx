export interface TopicColorSwatchProps {
  color: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
};

export function TopicColorSwatch({
  color,
  size = 'md',
  className = '',
}: TopicColorSwatchProps) {
  if (!color) return null;

  const classes = ['color-swatch', className].filter(Boolean).join(' ');
  const dimension = sizeMap[size];

  return (
    <span
      className={classes}
      style={{
        backgroundColor: color,
        width: dimension,
        height: dimension,
      }}
      title={color}
      aria-label={`Color: ${color}`}
    />
  );
}
