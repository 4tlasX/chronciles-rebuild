'use client';

import { Button } from '@/components/form';
import { deleteTopicAction } from './actions';

interface TopicDeleteButtonProps {
  topicId: number;
}

export function TopicDeleteButton({ topicId }: TopicDeleteButtonProps) {
  const handleDelete = async () => {
    const formData = new FormData();
    formData.append('id', topicId.toString());
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
