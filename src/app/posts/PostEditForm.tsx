'use client';

import { useState } from 'react';
import { PostForm } from '@/components/post';
import { Button } from '@/components/form';
import { updatePostAction } from './actions';
import type { Post } from '@/lib/db';

interface PostEditFormProps {
  post: Post;
}

export function PostEditForm({ post }: PostEditFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    await updatePostAction(formData);
    setIsOpen(false);
  };

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
        onSubmit={handleSubmit}
        onCancel={() => setIsOpen(false)}
        submitLabel="Save Changes"
        isEditing
      />
    </div>
  );
}
