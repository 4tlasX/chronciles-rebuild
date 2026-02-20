'use client';

import { Button } from '@/components/form';
import { deleteTopicAction } from './actions';

interface TopicDeleteButtonProps {
  topicId: number;
  email: string;
}

export function TopicDeleteButton({ topicId, email }: TopicDeleteButtonProps) {
  const handleDelete = async () => {
    const formData = new FormData();
    formData.append('id', topicId.toString());
    formData.append('email', email);
    await deleteTopicAction(formData);
  };

  return (
    <form action={handleDelete}>
      <Button type="submit" variant="danger" size="sm">
        Delete
      </Button>
    </form>
  );
}
