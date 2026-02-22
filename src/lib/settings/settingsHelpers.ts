/**
 * Helper functions for working with typed settings
 */

import { getAllSettings, getSetting } from '../db/tenantQueries';
import {
  AllSettings,
  DEFAULT_SETTINGS,
  SettingKey,
  parseSettingValue,
} from './settingsConfig';

/**
 * Get all settings for a tenant with proper typing.
 * Missing settings are filled in with defaults.
 */
export async function getTypedSettings(
  schemaName: string
): Promise<AllSettings> {
  const rawSettings = await getAllSettings(schemaName);

  // Start with defaults
  const settings: AllSettings = { ...DEFAULT_SETTINGS };

  // Override with actual values
  for (const raw of rawSettings) {
    const key = raw.key as SettingKey;
    if (key in DEFAULT_SETTINGS) {
      // Use type assertion to handle dynamic key assignment
      (settings as unknown as Record<string, unknown>)[key] = parseSettingValue(key, raw.value);
    }
  }

  return settings;
}

/**
 * Get a single typed setting with a default fallback.
 */
export async function getTypedSetting<K extends SettingKey>(
  schemaName: string,
  key: K
): Promise<AllSettings[K]> {
  const raw = await getSetting(schemaName, key);

  if (!raw) {
    return DEFAULT_SETTINGS[key];
  }

  return parseSettingValue(key, raw.value);
}

/**
 * Check if a feature is enabled.
 */
export async function isFeatureEnabled(
  schemaName: string,
  feature: 'food' | 'medication' | 'goals' | 'milestones' | 'exercise' | 'allergies'
): Promise<boolean> {
  const settingKey = `${feature}Enabled` as SettingKey;
  return getTypedSetting(schemaName, settingKey) as Promise<boolean>;
}
