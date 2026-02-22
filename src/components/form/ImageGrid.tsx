'use client';

export interface ImageOption {
  value: string;
  label: string;
  artist?: string | null;
}

export interface ImageGridProps {
  options: ImageOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ImageGrid({ options, value, onChange, disabled }: ImageGridProps) {
  return (
    <div className="image-grid">
      {options.map((option) => {
        const isSelected = value === option.value;
        const isNone = !option.value;

        return (
          <button
            key={option.value || 'none'}
            type="button"
            onClick={() => !disabled && onChange(option.value)}
            disabled={disabled}
            title={option.label}
            className={`image-grid-item ${isSelected ? 'image-grid-item-selected' : ''}`}
          >
            {isNone ? (
              <span className="image-grid-none">None</span>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={option.value}
                alt={option.label}
                className="image-grid-img"
                loading="lazy"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
