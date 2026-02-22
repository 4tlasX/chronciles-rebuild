'use client';

import { useState } from 'react';
import { PostForm } from '@/components/post';
import { Button } from '@/components/form';
import { updatePostAction } from './actions';
import type { Post, Taxonomy } from '@/lib/db';

interface PostEditFormProps {
  post: Post;
  taxonomies?: Taxonomy[];
  initialTaxonomyId?: number | null;
  inline?: boolean;
  onCancel?: () => void;
  onSave?: () => void;
}

export function PostEditForm({ post, taxonomies = [], initialTaxonomyId, inline = false, onCancel, onSave }: PostEditFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    await updatePostAction(formData);
    setIsOpen(false);
    onSave?.();
  };

  // Inline mode - always show the form directly
  if (inline) {
    const handleInlineSubmit = async (formData: FormData) => {
      await updatePostAction(formData);
      onSave?.();
    };

    return (
      <PostForm
        key={post.id}
        post={post}
        taxonomies={taxonomies}
        initialTaxonomyId={initialTaxonomyId}
        onSubmit={handleInlineSubmit}
        onCancel={onCancel}
        submitLabel="Save"
        isEditing
        enterToSubmit
      />
    );
  }

  // Toggle mode - show button, then form
  if (!isOpen) {
    return (
      <Button variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
        Edit
      </Button>
    );
  }

  return (
    <div className="edit-form-container">
      <PostForm
        post={post}
        taxonomies={taxonomies}
        initialTaxonomyId={initialTaxonomyId}
        onSubmit={handleSubmit}
        onCancel={() => setIsOpen(false)}
        submitLabel="Save"
        isEditing
      />
    </div>
  );
}
