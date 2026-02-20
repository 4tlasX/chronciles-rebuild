'use client';

import { FormGroup, FormRow, TextInput, Textarea, Button } from '@/components/form';
import type { Setting } from '@/lib/db';

export interface SettingFormProps {
  setting?: Setting;
  onSubmit: (formData: FormData) => void;
  onCancel?: () => void;
  submitLabel?: string;
  isEditing?: boolean;
}

export function SettingForm({
  setting,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  isEditing = false,
}: SettingFormProps) {
  const valueStr = setting
    ? typeof setting.value === 'string'
      ? setting.value
      : JSON.stringify(setting.value, null, 2)
    : '';

  return (
    <form action={onSubmit} className="setting-form">
      <FormRow inline>
        <FormGroup label="Key" htmlFor="setting-key" required>
          <TextInput
            id="setting-key"
            name="key"
            placeholder="e.g., site_name"
            defaultValue={setting?.key ?? ''}
            readOnly={isEditing}
            required
          />
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup
          label="Value (string or JSON)"
          htmlFor="setting-value"
          hint="Enter plain text or valid JSON"
        >
          <Textarea
            id="setting-value"
            name="value"
            placeholder='e.g., "My Blog" or {"theme": "dark"}'
            defaultValue={valueStr}
            rows={3}
          />
        </FormGroup>
      </FormRow>

      <div className="form-actions">
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
