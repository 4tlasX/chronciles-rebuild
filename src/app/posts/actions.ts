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

  if (!content?.trim()) {
    return { error: 'Content is required' };
  }

  let metadata = {};
  if (metadataStr?.trim()) {
    try {
      metadata = JSON.parse(metadataStr);
    } catch {
      return { error: 'Invalid metadata JSON' };
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

  if (!id) {
    return { error: 'Post ID is required' };
  }

  const updates: { content?: string; metadata?: Record<string, unknown> } = {};

  if (content?.trim()) {
    updates.content = content;
  }

  if (metadataStr?.trim()) {
    try {
      updates.metadata = JSON.parse(metadataStr);
    } catch {
      return { error: 'Invalid metadata JSON' };
    }
  }

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
