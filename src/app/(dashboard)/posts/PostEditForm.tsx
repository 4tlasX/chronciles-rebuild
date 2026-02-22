'use client';

import { useState } from 'react';
import { PostForm } from '@/components/post';
import { Button } from '@/components/form';
import { updatePostAction } from './actions';
import type { Post, Taxonomy } from '@/lib/db';

interface PostEditFormProps {
  post: Post;
  taxonomies?: Taxonomy[];
  inline?: boolean;
  onCancel?: () => void;
}

export function PostEditForm({ post, taxonomies = [], inline = false, onCancel }: PostEditFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    await updatePostAction(formData);
    setIsOpen(false);
  };

  // Inline mode - always show the form directly
  if (inline) {
    return (
      <PostForm
        key={post.id}
        post={post}
        taxonomies={taxonomies}
        onSubmit={updatePostAction}
        onCancel={onCancel}
        submitLabel="Save"
        isEditing
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
        onSubmit={handleSubmit}
        onCancel={() => setIsOpen(false)}
        submitLabel="Save"
        isEditing
      />
    </div>
  );
}
