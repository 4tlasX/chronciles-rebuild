'use client';

import { TopicForm } from '@/components/topic';
import { FormPanel } from '@/components/layout';
import { createTopicAction } from './actions';

export function TopicCreateForm() {
  return (
    <FormPanel title="Create New Topic">
      <TopicForm onSubmit={createTopicAction} submitLabel="Create Topic" />
    </FormPanel>
  );
}
