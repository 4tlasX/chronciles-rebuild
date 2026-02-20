'use client';

import { useState } from 'react';
import { TopicForm } from '@/components/topic';
import { Button } from '@/components/form';
import { updateTopicAction } from './actions';
import type { Taxonomy } from '@/lib/db';

interface TopicEditFormProps {
  topic: Taxonomy;
}

export function TopicEditForm({ topic }: TopicEditFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    await updateTopicAction(formData);
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
      <TopicForm
        topic={topic}
        onSubmit={handleSubmit}
        onCancel={() => setIsOpen(false)}
        submitLabel="Save Changes"
        isEditing
      />
    </div>
  );
}
