'use server';

import { revalidatePath } from 'next/cache';
import { upsertSetting, deleteSetting } from '@/lib/db';
import { getServerSession } from '@/app/auth/actions';

export async function upsertSettingAction(formData: FormData) {
  const session = await getServerSession();
  if (!session) {
    return { error: 'Not authenticated' };
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

  await upsertSetting(session.schemaName, key, value);
  revalidatePath('/settings');
  return { success: true };
}

export async function deleteSettingAction(formData: FormData) {
  const session = await getServerSession();
  if (!session) {
    return { error: 'Not authenticated' };
  }

  const key = formData.get('key') as string;

  if (!key) {
    return { error: 'Key is required' };
  }

  await deleteSetting(session.schemaName, key);
  revalidatePath('/settings');
  return { success: true };
}
