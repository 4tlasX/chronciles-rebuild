import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  setupTestSchema,
  teardownTestSchema,
  getTestSchemaName,
} from './setup';
import {
  getSetting,
  getAllSettings,
  upsertSetting,
  deleteSetting,
} from '../tenantQueries';

describe('Settings CRUD Operations', () => {
  let schemaName: string;

  beforeAll(async () => {
    schemaName = await setupTestSchema();
  });

  afterAll(async () => {
    await teardownTestSchema();
  });

  describe('upsertSetting', () => {
    it('should create a new setting', async () => {
      const result = await upsertSetting(schemaName, 'theme', { mode: 'dark' });

      expect(result).toBeDefined();
      expect(result.key).toBe('theme');
      expect(result.value).toEqual({ mode: 'dark' });
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should update an existing setting', async () => {
      await upsertSetting(schemaName, 'language', 'en');
      const updated = await upsertSetting(schemaName, 'language', 'fr');

      expect(updated.key).toBe('language');
      expect(updated.value).toBe('fr');
    });

    it('should handle complex JSON values', async () => {
      const complexValue = {
        nested: { deeply: { value: 123 } },
        array: [1, 2, 3],
        boolean: true,
        nullValue: null,
      };

      const result = await upsertSetting(schemaName, 'complex', complexValue);

      expect(result.value).toEqual(complexValue);
    });
  });

  describe('getSetting', () => {
    it('should retrieve an existing setting', async () => {
      await upsertSetting(schemaName, 'getSingle', 'value123');
      const result = await getSetting(schemaName, 'getSingle');

      expect(result).toBeDefined();
      expect(result?.key).toBe('getSingle');
      expect(result?.value).toBe('value123');
    });

    it('should return null for non-existent setting', async () => {
      const result = await getSetting(schemaName, 'nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('getAllSettings', () => {
    it('should retrieve all settings ordered by key', async () => {
      // Create settings with known keys
      await upsertSetting(schemaName, 'z_setting', 'last');
      await upsertSetting(schemaName, 'a_setting', 'first');

      const results = await getAllSettings(schemaName);

      expect(results.length).toBeGreaterThanOrEqual(2);

      // Find our test settings
      const aIndex = results.findIndex((s) => s.key === 'a_setting');
      const zIndex = results.findIndex((s) => s.key === 'z_setting');

      expect(aIndex).toBeLessThan(zIndex); // Should be ordered alphabetically
    });
  });

  describe('deleteSetting', () => {
    it('should delete an existing setting', async () => {
      await upsertSetting(schemaName, 'toDelete', 'value');

      // Verify it exists
      let result = await getSetting(schemaName, 'toDelete');
      expect(result).not.toBeNull();

      // Delete it
      await deleteSetting(schemaName, 'toDelete');

      // Verify it's gone
      result = await getSetting(schemaName, 'toDelete');
      expect(result).toBeNull();
    });

    it('should not throw when deleting non-existent setting', async () => {
      await expect(
        deleteSetting(schemaName, 'neverExisted')
      ).resolves.not.toThrow();
    });
  });
});
