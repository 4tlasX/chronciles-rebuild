export interface SettingValueProps {
  value: unknown;
  className?: string;
  truncate?: boolean;
  maxLength?: number;
}

export function SettingValue({
  value,
  className = '',
  truncate = true,
  maxLength = 50,
}: SettingValueProps) {
  const classes = ['setting-value', className].filter(Boolean).join(' ');

  const displayValue =
    typeof value === 'string' ? value : JSON.stringify(value);

  const truncatedValue =
    truncate && displayValue.length > maxLength
      ? `${displayValue.slice(0, maxLength)}...`
      : displayValue;

  return (
    <code className={classes} title={displayValue}>
      {truncatedValue}
    </code>
  );
}
