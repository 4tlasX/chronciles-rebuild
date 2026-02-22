'use server';

import { revalidatePath } from 'next/cache';
import { createPost, updatePost, deletePost } from '@/lib/db';
import { getServerSession } from '@/app/auth/actions';

export async function createPostAction(formData: FormData) {
  const session = await getServerSession();
  if (!session) {
    return { error: 'Not authenticated' };
  }

  const content = formData.get('content') as string;
  const metadataStr = formData.get('metadata') as string;
  const taxonomyId = formData.get('taxonomyId') as string;
  const specializedMetadataStr = formData.get('specializedMetadata') as string;

  if (!content?.trim()) {
    return { error: 'Content is required' };
  }

  // Start with generic metadata from key-value pairs
  let metadata: Record<string, unknown> = {};
  if (metadataStr?.trim()) {
    try {
      metadata = JSON.parse(metadataStr);
    } catch {
      return { error: 'Invalid metadata JSON' };
    }
  }

  // Add taxonomy ID to metadata if selected
  if (taxonomyId) {
    metadata._taxonomyId = parseInt(taxonomyId, 10);
  }

  // Merge specialized metadata if present
  if (specializedMetadataStr?.trim()) {
    try {
      const specializedMetadata = JSON.parse(specializedMetadataStr);
      metadata = { ...metadata, ...specializedMetadata };
    } catch {
      return { error: 'Invalid specialized metadata JSON' };
    }
  }

  await createPost(session.schemaName, content, metadata);
  revalidatePath('/');
  return { success: true };
}

export async function updatePostAction(formData: FormData) {
  const session = await getServerSession();
  if (!session) {
    return { error: 'Not authenticated' };
  }

  const id = parseInt(formData.get('id') as string, 10);
  const content = formData.get('content') as string;
  const metadataStr = formData.get('metadata') as string;
  const taxonomyId = formData.get('taxonomyId') as string;
  const specializedMetadataStr = formData.get('specializedMetadata') as string;

  if (!id) {
    return { error: 'Post ID is required' };
  }

  const updates: { content?: string; metadata?: Record<string, unknown> } = {};

  if (content?.trim()) {
    updates.content = content;
  }

  // Start with generic metadata from key-value pairs
  let metadata: Record<string, unknown> = {};
  if (metadataStr?.trim()) {
    try {
      metadata = JSON.parse(metadataStr);
    } catch {
      return { error: 'Invalid metadata JSON' };
    }
  }

  // Add taxonomy ID to metadata if selected (or clear it if none selected)
  if (taxonomyId) {
    metadata._taxonomyId = parseInt(taxonomyId, 10);
  }

  // Merge specialized metadata if present
  if (specializedMetadataStr?.trim()) {
    try {
      const specializedMetadata = JSON.parse(specializedMetadataStr);
      metadata = { ...metadata, ...specializedMetadata };
    } catch {
      return { error: 'Invalid specialized metadata JSON' };
    }
  }

  // Always update metadata (even if empty, to clear previous taxonomy)
  updates.metadata = metadata;

  await updatePost(session.schemaName, id, updates);
  revalidatePath('/');
  return { success: true };
}

export async function deletePostAction(formData: FormData) {
  const session = await getServerSession();
  if (!session) {
    return { error: 'Not authenticated' };
  }

  const id = parseInt(formData.get('id') as string, 10);

  if (!id) {
    return { error: 'Post ID is required' };
  }

  await deletePost(session.schemaName, id);
  revalidatePath('/');
  return { success: true };
}
