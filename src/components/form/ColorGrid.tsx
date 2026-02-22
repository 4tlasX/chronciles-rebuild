'use client';

export interface ColorOption {
  value: string;
  label: string;
}

export interface ColorGridProps {
  options: ColorOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ColorGrid({ options, value, onChange, disabled }: ColorGridProps) {
  return (
    <div className="color-grid">
      {options.map((option) => {
        const isSelected = value === option.value;
        const isTransparent = option.value === 'transparent';

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => !disabled && onChange(option.value)}
            disabled={disabled}
            title={option.label}
            className={`color-grid-item ${isSelected ? 'color-grid-item-selected' : ''}`}
            style={{
              backgroundColor: isTransparent ? undefined : option.value,
            }}
          >
            {isTransparent && <span className="color-grid-transparent" />}
            <span className="sr-only">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
