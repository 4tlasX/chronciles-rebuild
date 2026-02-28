'use client';

import { useRef, useState } from 'react';
import type { Taxonomy } from '@/lib/db';

interface TopicSidebarFormProps {
  topic?: Taxonomy;
  onSubmit: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
  onCancel: () => void;
  onDelete?: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
  submitLabel?: string;
  isEditing?: boolean;
}

export function TopicSidebarForm({
  topic,
  onSubmit,
  onCancel,
  onDelete,
  submitLabel = 'Save',
  isEditing = false,
}: TopicSidebarFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const formData = new FormData(formRef.current!);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!onDelete || isDeleting) return;

    setIsDeleting(true);
    const formData = new FormData();
    formData.set('id', String(topic?.id));
    await onDelete(formData);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="topic-sidebar-form">
      {topic && <input type="hidden" name="id" value={topic.id} />}

      <div className="topic-sidebar-form-fields">
        <input
          type="text"
          name="name"
          placeholder="Topic name"
          defaultValue={topic?.name ?? ''}
          required
          autoFocus
          className="topic-sidebar-form-input"
          onKeyDown={handleKeyDown}
        />
        <input
          type="text"
          name="icon"
          placeholder="Icon (e.g., book)"
          defaultValue={topic?.icon ?? ''}
          className="topic-sidebar-form-input topic-sidebar-form-input-icon"
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="topic-sidebar-form-actions">
        <button
          type="submit"
          className="topic-sidebar-form-btn topic-sidebar-form-btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? '...' : submitLabel}
        </button>
        <button
          type="button"
          className="topic-sidebar-form-btn topic-sidebar-form-btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        {isEditing && onDelete && (
          <>
            {showDeleteConfirm ? (
              <button
                type="button"
                className="topic-sidebar-form-btn topic-sidebar-form-btn-danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? '...' : 'Confirm'}
              </button>
            ) : (
              <button
                type="button"
                className="topic-sidebar-form-btn topic-sidebar-form-btn-danger-outline"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete
              </button>
            )}
          </>
        )}
      </div>
    </form>
  );
}
