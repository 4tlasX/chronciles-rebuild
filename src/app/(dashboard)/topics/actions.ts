'use server';

import { revalidatePath } from 'next/cache';
import { createTaxonomy, updateTaxonomy, deleteTaxonomy } from '@/lib/db';
import { getServerSession } from '@/app/auth/actions';

export async function createTopicAction(formData: FormData) {
  const session = await getServerSession();
  if (!session) {
    return { error: 'Not authenticated' };
  }

  const name = formData.get('name') as string;
  const icon = formData.get('icon') as string;
  const color = formData.get('color') as string;

  if (!name?.trim()) {
    return { error: 'Name is required' };
  }

  await createTaxonomy(session.schemaName, name, {
    icon: icon || undefined,
    color: color || undefined,
  });

  revalidatePath('/');
  return { success: true };
}

export async function updateTopicAction(formData: FormData) {
  const session = await getServerSession();
  if (!session) {
    return { error: 'Not authenticated' };
  }

  const id = parseInt(formData.get('id') as string, 10);
  const name = formData.get('name') as string;
  const icon = formData.get('icon') as string;
  const color = formData.get('color') as string;

  if (!id) {
    return { error: 'Topic ID is required' };
  }

  const updates: { name?: string; icon?: string; color?: string } = {};

  if (name?.trim()) {
    updates.name = name;
  }
  if (icon !== undefined) {
    updates.icon = icon || undefined;
  }
  if (color !== undefined) {
    updates.color = color || undefined;
  }

  await updateTaxonomy(session.schemaName, id, updates);
  revalidatePath('/');
  return { success: true };
}

export async function deleteTopicAction(formData: FormData) {
  const session = await getServerSession();
  if (!session) {
    return { error: 'Not authenticated' };
  }

  const id = parseInt(formData.get('id') as string, 10);

  if (!id) {
    return { error: 'Topic ID is required' };
  }

  await deleteTaxonomy(session.schemaName, id);
  revalidatePath('/');
  return { success: true };
}
