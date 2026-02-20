'use server';

import { revalidatePath } from 'next/cache';
import {
  createPost,
  updatePost,
  deletePost,
  getTenantSchemaByEmail,
} from '@/lib/db';

const DEMO_EMAIL = 'demo@chronicles.local';

async function getSchema(formData: FormData): Promise<string | null> {
  const email = (formData.get('email') as string) || DEMO_EMAIL;
  return getTenantSchemaByEmail(email);
}

export async function createPostAction(formData: FormData) {
  const schemaName = await getSchema(formData);
  if (!schemaName) {
    return { error: 'User not found' };
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

  await createPost(schemaName, content, metadata);
  revalidatePath('/posts');
  return { success: true };
}

export async function updatePostAction(formData: FormData) {
  const schemaName = await getSchema(formData);
  if (!schemaName) {
    return { error: 'User not found' };
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

  await updatePost(schemaName, id, updates);
  revalidatePath('/posts');
  return { success: true };
}

export async function deletePostAction(formData: FormData) {
  const schemaName = await getSchema(formData);
  if (!schemaName) {
    return { error: 'User not found' };
  }

  const id = parseInt(formData.get('id') as string, 10);

  if (!id) {
    return { error: 'Post ID is required' };
  }

  await deletePost(schemaName, id);
  revalidatePath('/posts');
  return { success: true };
}
