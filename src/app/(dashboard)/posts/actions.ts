'use server';

import { revalidatePath } from 'next/cache';
import { createPost, updatePost, deletePost, getAllPostsWithEncryption, createEncryptedPost } from '@/lib/db';
import { getServerSession } from '@/app/auth/actions';
import type { SerializedPostWithEncryption } from '@/lib/db';

/**
 * Helper to convert base64 to Buffer
 */
function base64ToBuffer(base64: string): Buffer {
  return Buffer.from(base64, 'base64');
}

export async function createPostAction(formData: FormData) {
  const session = await getServerSession();
  if (!session) {
    return { error: 'Not authenticated' };
  }

  // Check if this is an encrypted post
  const isEncrypted = formData.get('isEncrypted') === 'true';
  const encryptedPayloadStr = formData.get('encryptedPayload') as string | null;

  if (isEncrypted && encryptedPayloadStr) {
    // Handle encrypted post
    try {
      const encryptedPayload = JSON.parse(encryptedPayloadStr);
      const post = await createEncryptedPost(session.schemaName, {
        contentEncrypted: base64ToBuffer(encryptedPayload.contentEncrypted),
        contentIv: base64ToBuffer(encryptedPayload.contentIv),
        metadataEncrypted: base64ToBuffer(encryptedPayload.metadataEncrypted),
        metadataIv: base64ToBuffer(encryptedPayload.metadataIv),
      });
      revalidatePath('/');
      return { success: true, post };
    } catch (err) {
      return { error: 'Failed to create encrypted post' };
    }
  }

  // Handle plaintext post (fallback for non-encrypted users)
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

  const post = await createPost(session.schemaName, content, metadata);
  revalidatePath('/');
  return { success: true, post };
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

  const post = await updatePost(session.schemaName, id, updates);
  revalidatePath('/');

  // Convert to serialized format for client
  const serializedPost: SerializedPostWithEncryption = {
    ...post,
    contentEncrypted: null,
    contentIv: null,
    metadataEncrypted: null,
    metadataIv: null,
    isEncrypted: false,
  };

  return { success: true, post: serializedPost };
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

// Helper to convert Buffer to base64 string for client serialization
function bufferToBase64(buffer: Buffer | null): string | null {
  if (!buffer) return null;
  return buffer.toString('base64');
}

export async function loadMorePostsAction(
  offset: number,
  limit: number = 50
): Promise<{ posts: SerializedPostWithEncryption[]; hasMore: boolean; error?: string }> {
  const session = await getServerSession();
  if (!session) {
    return { posts: [], hasMore: false, error: 'Not authenticated' };
  }

  const rawPosts = await getAllPostsWithEncryption(session.schemaName, { limit, offset });

  // Convert Buffer fields to base64 strings for client serialization
  const posts = rawPosts.map((post) => ({
    ...post,
    contentEncrypted: bufferToBase64(post.contentEncrypted),
    contentIv: bufferToBase64(post.contentIv),
    metadataEncrypted: bufferToBase64(post.metadataEncrypted),
    metadataIv: bufferToBase64(post.metadataIv),
  }));

  return { posts, hasMore: posts.length === limit };
}
