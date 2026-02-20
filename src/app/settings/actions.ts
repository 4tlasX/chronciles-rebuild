'use server';

import { revalidatePath } from 'next/cache';
import {
  upsertSetting,
  deleteSetting,
  getTenantSchemaByEmail,
} from '@/lib/db';

const DEMO_EMAIL = 'demo@chronicles.local';

async function getSchema(formData: FormData): Promise<string | null> {
  const email = (formData.get('email') as string) || DEMO_EMAIL;
  return getTenantSchemaByEmail(email);
}

export async function upsertSettingAction(formData: FormData) {
  const schemaName = await getSchema(formData);
  if (!schemaName) {
    return { error: 'User not found' };
  }

  const key = formData.get('key') as string;
  const valueStr = formData.get('value') as string;

  if (!key?.trim()) {
    return { error: 'Key is required' };
  }

  let value: unknown = valueStr;

  // Try to parse as JSON, otherwise keep as string
  if (valueStr?.trim()) {
    try {
      value = JSON.parse(valueStr);
    } catch {
      value = valueStr;
    }
  }

  await upsertSetting(schemaName, key, value);
  revalidatePath('/settings');
  return { success: true };
}

export async function deleteSettingAction(formData: FormData) {
  const schemaName = await getSchema(formData);
  if (!schemaName) {
    return { error: 'User not found' };
  }

  const key = formData.get('key') as string;

  if (!key) {
    return { error: 'Key is required' };
  }

  await deleteSetting(schemaName, key);
  revalidatePath('/settings');
  return { success: true };
}
