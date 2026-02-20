'use client';

import { FormGroup, FormRow, TextInput, ColorInput, Button } from '@/components/form';
import type { Taxonomy } from '@/lib/db';

export interface TopicFormProps {
  topic?: Taxonomy;
  onSubmit: (formData: FormData) => void;
  onCancel?: () => void;
  submitLabel?: string;
  isEditing?: boolean;
}

export function TopicForm({
  topic,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  isEditing = false,
}: TopicFormProps) {
  return (
    <form action={onSubmit} className="topic-form">
      {topic && <input type="hidden" name="id" value={topic.id} />}

      <FormRow>
        <FormGroup label="Name" htmlFor="topic-name" required>
          <TextInput
            id="topic-name"
            name="name"
            placeholder="e.g., Technology"
            defaultValue={topic?.name ?? ''}
            required
          />
        </FormGroup>
      </FormRow>

      <FormRow inline>
        <FormGroup label="Icon (emoji)" htmlFor="topic-icon">
          <TextInput
            id="topic-icon"
            name="icon"
            placeholder="💻"
            defaultValue={topic?.icon ?? ''}
          />
        </FormGroup>
        <FormGroup label="Color" htmlFor="topic-color">
          <ColorInput
            id="topic-color"
            name="color"
            defaultValue={topic?.color ?? '#3B82F6'}
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
