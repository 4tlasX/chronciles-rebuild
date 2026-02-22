'use client';

import { SettingForm } from '@/components/settings';
import { FormPanel } from '@/components/layout';
import { upsertSettingAction } from './actions';

export function SettingCreateForm() {
  return (
    <FormPanel title="Add or Update Setting">
      <SettingForm onSubmit={upsertSettingAction} submitLabel="Save Setting" />
    </FormPanel>
  );
}
