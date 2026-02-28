'use client';

import { useState } from 'react';
import Image from 'next/image';

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
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (imageUrl: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageUrl));
  };

  const handleImageError = (imageUrl: string) => {
    setFailedImages((prev) => new Set(prev).add(imageUrl));
  };

  return (
    <div className="image-grid">
      {options.map((option) => {
        const isSelected = value === option.value;
        const isNone = !option.value;
        const isLoaded = loadedImages.has(option.value);
        const isFailed = failedImages.has(option.value);

        return (
          <button
            key={option.value || 'none'}
            type="button"
            onClick={() => !disabled && onChange(option.value)}
            disabled={disabled}
            title={option.label}
            className={`image-grid-item ${isSelected ? 'image-grid-item-selected' : ''} ${!isLoaded && !isNone ? 'image-grid-item-loading' : ''}`}
          >
            {isNone ? (
              <span className="image-grid-none">None</span>
            ) : isFailed ? (
              <span className="image-grid-none">Error</span>
            ) : (
              <>
                {!isLoaded && <span className="image-grid-loading-spinner" />}
                <Image
                  src={option.value}
                  alt={option.label}
                  width={160}
                  height={90}
                  className={`image-grid-img ${isLoaded ? 'image-grid-img-loaded' : ''}`}
                  loading="lazy"
                  onLoad={() => handleImageLoad(option.value)}
                  onError={() => handleImageError(option.value)}
                  quality={50}
                />
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
