'use client';

import { PostForm } from '@/components/post';
import { FormPanel } from '@/components/layout';
import { createPostAction } from './actions';
import type { Taxonomy } from '@/lib/db';

interface PostCreateFormProps {
  taxonomies?: Taxonomy[];
  inline?: boolean;
}

export function PostCreateForm({ taxonomies = [], inline = false }: PostCreateFormProps) {
  if (inline) {
    return <PostForm taxonomies={taxonomies} onSubmit={createPostAction} submitLabel="Create Post" />;
  }

  return (
    <FormPanel title="Create New Post">
      <PostForm taxonomies={taxonomies} onSubmit={createPostAction} submitLabel="Create Post" />
    </FormPanel>
  );
}
