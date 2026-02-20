'use client';

import { PostForm } from '@/components/post';
import { FormPanel } from '@/components/layout';
import { createPostAction } from './actions';

interface PostCreateFormProps {
  email: string;
}

export function PostCreateForm({ email }: PostCreateFormProps) {
  const handleSubmit = async (formData: FormData) => {
    formData.append('email', email);
    await createPostAction(formData);
  };

  return (
    <FormPanel title="Create New Post">
      <PostForm onSubmit={handleSubmit} submitLabel="Create Post" />
    </FormPanel>
  );
}
