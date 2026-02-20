export interface PostMetaProps {
  metadata: Record<string, unknown>;
  className?: string;
}

export function PostMeta({ metadata, className = '' }: PostMetaProps) {
  const entries = Object.entries(metadata);

  if (entries.length === 0) return null;

  const classes = ['post-meta', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {entries.map(([key, value]) => (
        <div key={key} className="post-meta-item">
          <span className="post-meta-key">{key}:</span>
          <span className="post-meta-value">
            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
          </span>
        </div>
      ))}
    </div>
  );
}
