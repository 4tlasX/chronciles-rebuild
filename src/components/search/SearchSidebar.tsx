'use client';

import { useEffect, useRef } from 'react';
import { useUIStore } from '@/stores';

export function SearchSidebar() {
  const sidebarRef = useRef<HTMLDivElement>(null);

  const isOpen = useUIStore((state) => state.isSearchSidebarOpen);
  const closeSearchSidebar = useUIStore((state) => state.closeSearchSidebar);
  const searchKeyword = useUIStore((state) => state.searchKeyword);
  const setSearchKeyword = useUIStore((state) => state.setSearchKeyword);
  const searchDateFrom = useUIStore((state) => state.searchDateFrom);
  const setSearchDateFrom = useUIStore((state) => state.setSearchDateFrom);
  const searchDateTo = useUIStore((state) => state.searchDateTo);
  const setSearchDateTo = useUIStore((state) => state.setSearchDateTo);
  const clearSearchFilters = useUIStore((state) => state.clearSearchFilters);

  // Close on escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSearchSidebar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeSearchSidebar]);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement;
        if (target.closest('.sidebar-nav-item')) return;
        closeSearchSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeSearchSidebar]);

  const hasFilters = searchKeyword || searchDateFrom || searchDateTo;

  return (
    <div
      ref={sidebarRef}
      className={`search-sidebar ${isOpen ? 'search-sidebar-open' : ''}`}
    >
      <div className="search-sidebar-header">
        <span className="search-sidebar-title">SEARCH</span>
        {hasFilters && (
          <button
            type="button"
            className="search-sidebar-clear-btn"
            onClick={clearSearchFilters}
            aria-label="Clear filters"
          >
            Clear
          </button>
        )}
      </div>

      <div className="search-sidebar-content">
        {/* Keyword search */}
        <div className="search-sidebar-field">
          <label className="search-sidebar-label">Keyword</label>
          <input
            type="text"
            className="search-sidebar-input"
            placeholder="Search content..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>

        {/* Date range */}
        <div className="search-sidebar-field">
          <label className="search-sidebar-label">From</label>
          <input
            type="date"
            className="search-sidebar-input search-sidebar-date"
            value={searchDateFrom}
            onChange={(e) => setSearchDateFrom(e.target.value)}
          />
        </div>
        <div className="search-sidebar-field">
          <label className="search-sidebar-label">To</label>
          <input
            type="date"
            className="search-sidebar-input search-sidebar-date"
            value={searchDateTo}
            onChange={(e) => setSearchDateTo(e.target.value)}
          />
        </div>
      </div>

      <button
        type="button"
        className="search-sidebar-close"
        onClick={closeSearchSidebar}
        aria-label="Close search"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
