'use client';

import { Button } from '@/components/form';
import { deleteSettingAction } from './actions';

interface SettingDeleteButtonProps {
  settingKey: string;
}

export function SettingDeleteButton({ settingKey }: SettingDeleteButtonProps) {
  const handleDelete = async () => {
    const formData = new FormData();
    formData.append('key', settingKey);
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
