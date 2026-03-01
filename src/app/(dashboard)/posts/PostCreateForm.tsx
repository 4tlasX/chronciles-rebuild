'use client';

import { PostForm } from '@/components/post';
import { FormPanel } from '@/components/layout';
import { createPostAction } from './actions';
import { useEncryption } from '@/components/encryption';
import type { Taxonomy } from '@/lib/db';

interface PostCreateFormProps {
  taxonomies?: Taxonomy[];
  inline?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}

export function PostCreateForm({ taxonomies = [], inline = false, onSave, onCancel }: PostCreateFormProps) {
  const { isUnlocked, encryptPost } = useEncryption();

  const handleSubmit = async (formData: FormData) => {
    // If encryption is unlocked, encrypt the content before sending
    if (isUnlocked) {
      const content = formData.get('content') as string;
      const metadataStr = formData.get('metadata') as string;
      const taxonomyId = formData.get('taxonomyId') as string;
      const specializedMetadataStr = formData.get('specializedMetadata') as string;

      // Build metadata object
      let metadata: Record<string, unknown> = {};
      if (metadataStr?.trim()) {
        try {
          metadata = JSON.parse(metadataStr);
        } catch {
          // Invalid JSON, will be caught by server
        }
      }
      if (taxonomyId) {
        metadata._taxonomyId = parseInt(taxonomyId, 10);
      }
      if (specializedMetadataStr?.trim()) {
        try {
          const specializedMetadata = JSON.parse(specializedMetadataStr);
          metadata = { ...metadata, ...specializedMetadata };
        } catch {
          // Invalid JSON
        }
      }

      // Encrypt content and metadata
      const encrypted = await encryptPost(content, metadata);

      // Create new FormData with encrypted payload
      const encryptedFormData = new FormData();
      encryptedFormData.set('isEncrypted', 'true');
      encryptedFormData.set('encryptedPayload', JSON.stringify(encrypted));

      await createPostAction(encryptedFormData);
    } else {
      // Not encrypted, send as plaintext
      await createPostAction(formData);
    }
    onSave?.();
  };

  if (inline) {
    return <PostForm taxonomies={taxonomies} onSubmit={handleSubmit} onCancel={onCancel} submitLabel="Create Post" />;
  }

  return (
    <FormPanel title="Create New Post">
      <PostForm taxonomies={taxonomies} onSubmit={handleSubmit} onCancel={onCancel} submitLabel="Create Post" />
    </FormPanel>
  );
}
