'use client';

import { FormGroup, FormRow, TextInput, Button } from '@/components/form';
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

      <FormRow inline>
        <FormGroup label="Name" htmlFor="topic-name" required>
          <TextInput
            id="topic-name"
            name="name"
            placeholder="e.g., Technology"
            defaultValue={topic?.name ?? ''}
            required
          />
        </FormGroup>
        <FormGroup label="Icon" htmlFor="topic-icon">
          <TextInput
            id="topic-icon"
            name="icon"
            placeholder="book"
            defaultValue={topic?.icon ?? ''}
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
