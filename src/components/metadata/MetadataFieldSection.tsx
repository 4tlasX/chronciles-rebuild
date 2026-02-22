'use client';

import { ReactNode } from 'react';

export interface MetadataFieldSectionProps {
  fieldType: string;
  selectedTaxonomyName: string | null;
  title: string;
  children: ReactNode;
}

export function MetadataFieldSection({
  fieldType,
  selectedTaxonomyName,
  title,
  children,
}: MetadataFieldSectionProps) {
  // Check if this section should be visible
  const isVisible = selectedTaxonomyName?.toLowerCase() === fieldType.toLowerCase();

  if (!isVisible) {
    return null;
  }

  return (
    <div className="metadata-field-section">
      <div className="metadata-field-section-header">
        <span className="metadata-field-section-title">{title}</span>
      </div>
      <div className="metadata-field-section-content">
        {children}
      </div>
    </div>
  );
}
