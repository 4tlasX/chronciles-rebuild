'use client';

import { PostForm } from '@/components/post';
import { FormPanel } from '@/components/layout';
import { createPostAction } from './actions';
import type { Taxonomy } from '@/lib/db';

interface PostCreateFormProps {
  taxonomies?: Taxonomy[];
  inline?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}

export function PostCreateForm({ taxonomies = [], inline = false, onSave, onCancel }: PostCreateFormProps) {
  const handleSubmit = async (formData: FormData) => {
    await createPostAction(formData);
    onSave?.();
  };

  if (inline) {
    return <PostForm taxonomies={taxonomies} onSubmit={handleSubmit} onCancel={onCancel} submitLabel="Create Post" />;
  }

  return (
    <FormPanel title="Create New Post">
      <PostForm taxonomies={taxonomies} onSubmit={handleSubmit} onCancel={onCancel} submitLabel="Create Post" />
    </FormPanel>
  );
}
