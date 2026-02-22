'use client';

import { useState, useRef, useEffect } from 'react';
import { TopicIcon } from './TopicIcon';
import type { Taxonomy } from '@/lib/db';

export interface TaxonomySelectorProps {
  taxonomies: Taxonomy[];
  selectedId: number | null;
  onChange: (taxonomy: Taxonomy | null) => void;
  placeholder?: string;
}

export function TaxonomySelector({
  taxonomies,
  selectedId,
  onChange,
  placeholder = 'Select a topic...',
}: TaxonomySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedTaxonomy = taxonomies.find((t) => t.id === selectedId) || null;

  // Filter taxonomies by search query
  const filteredTaxonomies = taxonomies.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (taxonomy: Taxonomy | null) => {
    onChange(taxonomy);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="taxonomy-selector" ref={containerRef}>
      <button
        type="button"
        className="taxonomy-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedTaxonomy ? (
          <span className="taxonomy-selector-selected">
            <TopicIcon
              icon={selectedTaxonomy.icon}
              color={selectedTaxonomy.color}
              size="sm"
            />
            <span className="taxonomy-selector-name">{selectedTaxonomy.name}</span>
          </span>
        ) : (
          <span className="taxonomy-selector-placeholder">{placeholder}</span>
        )}
        <span className={`taxonomy-selector-chevron ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="taxonomy-selector-dropdown" role="listbox">
          <div className="taxonomy-selector-search">
            <input
              ref={inputRef}
              type="text"
              className="taxonomy-selector-search-input"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="taxonomy-selector-options">
            <button
              type="button"
              className={`taxonomy-selector-option ${selectedId === null ? 'selected' : ''}`}
              onClick={() => handleSelect(null)}
              role="option"
              aria-selected={selectedId === null}
            >
              <span className="taxonomy-selector-option-none">None</span>
            </button>
            {filteredTaxonomies.map((taxonomy) => (
              <button
                key={taxonomy.id}
                type="button"
                className={`taxonomy-selector-option ${selectedId === taxonomy.id ? 'selected' : ''}`}
                onClick={() => handleSelect(taxonomy)}
                role="option"
                aria-selected={selectedId === taxonomy.id}
              >
                <TopicIcon
                  icon={taxonomy.icon}
                  color={taxonomy.color}
                  size="sm"
                />
                <span className="taxonomy-selector-option-name">{taxonomy.name}</span>
              </button>
            ))}
            {filteredTaxonomies.length === 0 && searchQuery && (
              <div className="taxonomy-selector-no-results">No topics found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
