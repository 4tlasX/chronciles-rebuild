'use client';

import { SettingForm } from '@/components/settings';
import { FormPanel } from '@/components/layout';
import { upsertSettingAction } from './actions';

interface SettingCreateFormProps {
  email: string;
}

export function SettingCreateForm({ email }: SettingCreateFormProps) {
  const handleSubmit = async (formData: FormData) => {
    formData.append('email', email);
    await upsertSettingAction(formData);
  };

  return (
    <FormPanel title="Add or Update Setting">
      <SettingForm onSubmit={handleSubmit} submitLabel="Save Setting" />
    </FormPanel>
  );
}
