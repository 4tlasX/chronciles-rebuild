export interface SettingDateProps {
  date: Date;
  className?: string;
}

export function SettingDate({ date, className = '' }: SettingDateProps) {
  const classes = ['setting-date', className].filter(Boolean).join(' ');
  const dateObj = date instanceof Date ? date : new Date(date);

  return (
    <time className={classes} dateTime={dateObj.toISOString()}>
      {dateObj.toLocaleDateString()}
    </time>
  );
}
