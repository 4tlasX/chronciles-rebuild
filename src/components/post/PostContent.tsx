export interface PostContentProps {
  content: string;
  className?: string;
  truncate?: boolean;
  maxLength?: number;
}

export function PostContent({
  content,
  className = '',
  truncate = false,
  maxLength = 200,
}: PostContentProps) {
  const classes = ['post-content', className].filter(Boolean).join(' ');

  const displayContent =
    truncate && content.length > maxLength
      ? `${content.slice(0, maxLength)}...`
      : content;

  return <p className={classes}>{displayContent}</p>;
}
