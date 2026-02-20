'use client';

import { FormGroup, FormRow, Textarea, KeyValueList, Button } from '@/components/form';
import type { Post } from '@/lib/db';
import type { KeyValuePairData } from '@/components/form';

export interface PostFormProps {
  post?: Post;
  onSubmit: (formData: FormData) => void;
  onCancel?: () => void;
  submitLabel?: string;
  isEditing?: boolean;
}

function metadataToKeyValuePairs(
  metadata: Record<string, unknown>
): KeyValuePairData[] {
  return Object.entries(metadata).map(([key, value]) => ({
    key,
    value: typeof value === 'string' ? value : JSON.stringify(value),
  }));
}

export function PostForm({
  post,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  isEditing = false,
}: PostFormProps) {
  const initialPairs = post ? metadataToKeyValuePairs(post.metadata) : [];

  return (
    <form action={onSubmit} className="post-form">
      {post && <input type="hidden" name="id" value={post.id} />}

      <FormRow>
        <FormGroup label="Content" htmlFor="post-content" required>
          <Textarea
            id="post-content"
            name="content"
            placeholder="Write your post content..."
            defaultValue={post?.content ?? ''}
            required
          />
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup label="Metadata" htmlFor="post-metadata">
          <KeyValueList
            initialPairs={initialPairs}
            name="metadata"
            keyPlaceholder="Key"
            valuePlaceholder="Value"
            addButtonText="Add Metadata Field"
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
