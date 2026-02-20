'use client';

import { Button } from '@/components/form';
import { deleteSettingAction } from './actions';

interface SettingDeleteButtonProps {
  settingKey: string;
  email: string;
}

export function SettingDeleteButton({ settingKey, email }: SettingDeleteButtonProps) {
  const handleDelete = async () => {
    const formData = new FormData();
    formData.append('key', settingKey);
    formData.append('email', email);
    await deleteSettingAction(formData);
  };

  return (
    <form action={handleDelete}>
      <Button type="submit" variant="danger" size="sm">
        Delete
      </Button>
    </form>
  );
}
