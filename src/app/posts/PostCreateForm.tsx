'use client';

import { PostForm } from '@/components/post';
import { FormPanel } from '@/components/layout';
import { createPostAction } from './actions';

export function PostCreateForm() {
  return (
    <FormPanel title="Create New Post">
      <PostForm onSubmit={createPostAction} submitLabel="Create Post" />
    </FormPanel>
  );
}
