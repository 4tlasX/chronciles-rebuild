'use server';

import { revalidatePath } from 'next/cache';
import {
  createTaxonomy,
  updateTaxonomy,
  deleteTaxonomy,
  getTenantSchemaByEmail,
} from '@/lib/db';

const DEMO_EMAIL = 'demo@chronicles.local';

async function getSchema(formData: FormData): Promise<string | null> {
  const email = (formData.get('email') as string) || DEMO_EMAIL;
  return getTenantSchemaByEmail(email);
}

export async function createTopicAction(formData: FormData) {
  const schemaName = await getSchema(formData);
  if (!schemaName) {
    return { error: 'User not found' };
  }

  const name = formData.get('name') as string;
  const icon = formData.get('icon') as string;
  const color = formData.get('color') as string;

  if (!name?.trim()) {
    return { error: 'Name is required' };
  }

  await createTaxonomy(schemaName, name, {
    icon: icon || undefined,
    color: color || undefined,
  });

  revalidatePath('/topics');
  return { success: true };
}

export async function updateTopicAction(formData: FormData) {
  const schemaName = await getSchema(formData);
  if (!schemaName) {
    return { error: 'User not found' };
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

  await updateTaxonomy(schemaName, id, updates);
  revalidatePath('/topics');
  return { success: true };
}

export async function deleteTopicAction(formData: FormData) {
  const schemaName = await getSchema(formData);
  if (!schemaName) {
    return { error: 'User not found' };
  }

  const id = parseInt(formData.get('id') as string, 10);

  if (!id) {
    return { error: 'Topic ID is required' };
  }

  await deleteTaxonomy(schemaName, id);
  revalidatePath('/topics');
  return { success: true };
}
