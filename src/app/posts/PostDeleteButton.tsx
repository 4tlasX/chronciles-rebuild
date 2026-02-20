'use client';

import { Button } from '@/components/form';
import { deletePostAction } from './actions';

interface PostDeleteButtonProps {
  postId: number;
  email: string;
}

export function PostDeleteButton({ postId, email }: PostDeleteButtonProps) {
  const handleDelete = async () => {
    const formData = new FormData();
    formData.append('id', postId.toString());
    formData.append('email', email);
    await deletePostAction(formData);
  };

  return (
    <form action={handleDelete}>
      <Button type="submit" variant="danger" size="sm">
        Delete
      </Button>
    </form>
  );
}
