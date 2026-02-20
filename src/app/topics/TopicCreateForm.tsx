'use client';

import { TopicForm } from '@/components/topic';
import { FormPanel } from '@/components/layout';
import { createTopicAction } from './actions';

interface TopicCreateFormProps {
  email: string;
}

export function TopicCreateForm({ email }: TopicCreateFormProps) {
  const handleSubmit = async (formData: FormData) => {
    formData.append('email', email);
    await createTopicAction(formData);
  };

  return (
    <FormPanel title="Create New Topic">
      <TopicForm onSubmit={handleSubmit} submitLabel="Create Topic" />
    </FormPanel>
  );
}
