/**
 * Seed default settings for a new tenant
 */

import { upsertSetting } from '../db/tenantQueries';
import { DEFAULT_SETTINGS, SettingKey } from './settingsConfig';

/**
 * Seeds all default settings for a new tenant.
 * This should be called during tenant registration.
 */
export async function seedDefaultSettings(schemaName: string): Promise<void> {
  const settingKeys = Object.keys(DEFAULT_SETTINGS) as SettingKey[];

  for (const key of settingKeys) {
    await upsertSetting(schemaName, key, DEFAULT_SETTINGS[key]);
  }
}

/**
 * Ensures a specific setting exists with its default value.
 * Does not overwrite existing values.
 */
export async function ensureSettingExists(
  schemaName: string,
  key: SettingKey
): Promise<void> {
  const { getSetting } = await import('../db/tenantQueries');
  const existing = await getSetting(schemaName, key);

  if (!existing) {
    await upsertSetting(schemaName, key, DEFAULT_SETTINGS[key]);
  }
}

/**
 * Ensures all default settings exist without overwriting existing values.
 * Useful for migrations when new settings are added.
 */
export async function ensureAllSettingsExist(schemaName: string): Promise<void> {
  const { getSetting } = await import('../db/tenantQueries');
  const settingKeys = Object.keys(DEFAULT_SETTINGS) as SettingKey[];

  for (const key of settingKeys) {
    const existing = await getSetting(schemaName, key);
    if (!existing) {
      await upsertSetting(schemaName, key, DEFAULT_SETTINGS[key]);
    }
  }
}
