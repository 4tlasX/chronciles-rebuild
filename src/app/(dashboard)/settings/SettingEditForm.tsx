'use client';

import { useState } from 'react';
import { SettingForm } from '@/components/settings';
import { Button } from '@/components/form';
import { upsertSettingAction } from './actions';
import type { Setting } from '@/lib/db';

interface SettingEditFormProps {
  setting: Setting;
}

export function SettingEditForm({ setting }: SettingEditFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    await upsertSettingAction(formData);
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
    <div className="edit-form-container edit-form-dropdown">
      <SettingForm
        setting={setting}
        onSubmit={handleSubmit}
        onCancel={() => setIsOpen(false)}
        submitLabel="Save"
        isEditing
      />
    </div>
  );
}
