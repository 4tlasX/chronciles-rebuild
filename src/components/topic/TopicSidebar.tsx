'use client';

import { useEffect, useRef } from 'react';
import type { Taxonomy } from '@/lib/db';
import { useUIStore } from '@/stores';
import { TopicIcon } from './TopicIcon';
import { TopicSidebarForm } from './TopicSidebarForm';

interface TopicSidebarProps {
  taxonomies: Taxonomy[];
  postCounts?: Record<number, number>;
  onCreateTopic: (formData: FormData) => Promise<{ success?: boolean; error?: string; taxonomy?: Taxonomy }>;
  onUpdateTopic: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
  onDeleteTopic: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
}

export function TopicSidebar({
  taxonomies,
  postCounts = {},
  onCreateTopic,
  onUpdateTopic,
  onDeleteTopic,
}: TopicSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  const isOpen = useUIStore((state) => state.isTopicSidebarOpen);
  const closeTopicSidebar = useUIStore((state) => state.closeTopicSidebar);
  const selectedTopicId = useUIStore((state) => state.selectedTopicId);
  const setSelectedTopicId = useUIStore((state) => state.setSelectedTopicId);
  const editingTopicId = useUIStore((state) => state.editingTopicId);
  const setEditingTopicId = useUIStore((state) => state.setEditingTopicId);
  const isCreatingTopic = useUIStore((state) => state.isCreatingTopic);
  const setIsCreatingTopic = useUIStore((state) => state.setIsCreatingTopic);

  // Close on escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeTopicSidebar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeTopicSidebar]);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        // Don't close if clicking on the sidebar toggle button
        const target = e.target as HTMLElement;
        if (target.closest('.sidebar-nav-item')) return;
        closeTopicSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeTopicSidebar]);

  const handleTopicClick = (topicId: number) => {
    if (editingTopicId === topicId) return; // Don't select while editing
    setSelectedTopicId(selectedTopicId === topicId ? null : topicId);
  };

  const handleEditClick = (e: React.MouseEvent, topicId: number) => {
    e.stopPropagation();
    setEditingTopicId(editingTopicId === topicId ? null : topicId);
  };

  const handleCreateSubmit = async (formData: FormData) => {
    const result = await onCreateTopic(formData);
    if (result.success) {
      setIsCreatingTopic(false);
    }
    return result;
  };

  const handleUpdateSubmit = async (formData: FormData) => {
    const result = await onUpdateTopic(formData);
    if (result.success) {
      setEditingTopicId(null);
    }
    return result;
  };

  const handleDeleteSubmit = async (formData: FormData) => {
    const result = await onDeleteTopic(formData);
    if (result.success) {
      setEditingTopicId(null);
      // Clear selection if deleted topic was selected
      const deletedId = parseInt(formData.get('id') as string, 10);
      if (selectedTopicId === deletedId) {
        setSelectedTopicId(null);
      }
    }
    return result;
  };

  return (
    <div
      ref={sidebarRef}
      className={`topic-sidebar ${isOpen ? 'topic-sidebar-open' : ''}`}
    >
      <div className="topic-sidebar-header">
        <span className="topic-sidebar-title">TOPICS</span>
        <button
          type="button"
          className="topic-sidebar-add-btn"
          onClick={() => setIsCreatingTopic(!isCreatingTopic)}
          aria-label="Add topic"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Create new topic form */}
      {isCreatingTopic && (
        <div className="topic-sidebar-create-form">
          <TopicSidebarForm
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreatingTopic(false)}
            submitLabel="Add"
          />
        </div>
      )}

      <div className="topic-sidebar-list">
        {/* "All" option to clear filter */}
        <div
          className={`topic-sidebar-item ${selectedTopicId === null ? 'topic-sidebar-item-active' : ''}`}
          onClick={() => setSelectedTopicId(null)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setSelectedTopicId(null);
            }
          }}
        >
          <div className="topic-sidebar-item-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
          <span className="topic-sidebar-item-name">All Posts</span>
        </div>

        {taxonomies.map((topic) => (
          <div key={topic.id}>
            <div
              className={`topic-sidebar-item ${selectedTopicId === topic.id ? 'topic-sidebar-item-active' : ''} ${editingTopicId === topic.id ? 'topic-sidebar-item-editing' : ''}`}
              onClick={() => handleTopicClick(topic.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleTopicClick(topic.id);
                }
              }}
            >
              <div className="topic-sidebar-item-icon">
                <TopicIcon icon={topic.icon} size="md" />
              </div>
              <span className="topic-sidebar-item-name">{topic.name}</span>
              <span className="topic-sidebar-item-count">{postCounts[topic.id] || 0}</span>
              <button
                type="button"
                className="topic-sidebar-item-edit"
                onClick={(e) => handleEditClick(e, topic.id)}
                aria-label={editingTopicId === topic.id ? 'Close edit' : 'Edit topic'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {editingTopicId === topic.id ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </>
                  ) : (
                    <>
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </>
                  )}
                </svg>
              </button>
            </div>

            {/* Inline edit form */}
            {editingTopicId === topic.id && (
              <div className="topic-sidebar-edit-form">
                <TopicSidebarForm
                  topic={topic}
                  onSubmit={handleUpdateSubmit}
                  onCancel={() => setEditingTopicId(null)}
                  onDelete={handleDeleteSubmit}
                  submitLabel="Save"
                  isEditing
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="topic-sidebar-close"
        onClick={closeTopicSidebar}
        aria-label="Close topics"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
