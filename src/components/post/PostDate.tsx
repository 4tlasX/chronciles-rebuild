export interface PostDateProps {
  date: Date;
  className?: string;
}

export function PostDate({ date, className = '' }: PostDateProps) {
  const classes = ['post-date', className].filter(Boolean).join(' ');
  const dateObj = date instanceof Date ? date : new Date(date);

  return (
    <time className={classes} dateTime={dateObj.toISOString()}>
      {dateObj.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })}
    </time>
  );
}
