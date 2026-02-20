import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  setupTestSchema,
  teardownTestSchema,
} from './setup';
import {
  createTaxonomy,
  getTaxonomy,
  getAllTaxonomies,
  updateTaxonomy,
  deleteTaxonomy,
} from '../tenantQueries';

describe('Taxonomies CRUD Operations', () => {
  let schemaName: string;

  beforeAll(async () => {
    schemaName = await setupTestSchema();
  });

  afterAll(async () => {
    await teardownTestSchema();
  });

  describe('createTaxonomy', () => {
    it('should create a taxonomy with just a name', async () => {
      const result = await createTaxonomy(schemaName, 'Technology');

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe('Technology');
      expect(result.icon).toBeNull();
      expect(result.color).toBeNull();
    });

    it('should create a taxonomy with icon and color', async () => {
      const result = await createTaxonomy(schemaName, 'Design', {
        icon: '🎨',
        color: '#FF5733',
      });

      expect(result.name).toBe('Design');
      expect(result.icon).toBe('🎨');
      expect(result.color).toBe('#FF5733');
    });

    it('should create a taxonomy with only icon', async () => {
      const result = await createTaxonomy(schemaName, 'Music', {
        icon: '🎵',
      });

      expect(result.name).toBe('Music');
      expect(result.icon).toBe('🎵');
      expect(result.color).toBeNull();
    });

    it('should create a taxonomy with only color', async () => {
      const result = await createTaxonomy(schemaName, 'Nature', {
        color: '#00FF00',
      });

      expect(result.name).toBe('Nature');
      expect(result.icon).toBeNull();
      expect(result.color).toBe('#00FF00');
    });

    it('should enforce unique taxonomy names', async () => {
      await createTaxonomy(schemaName, 'UniqueTest');

      await expect(
        createTaxonomy(schemaName, 'UniqueTest')
      ).rejects.toThrow();
    });
  });

  describe('getTaxonomy', () => {
    it('should retrieve an existing taxonomy by ID', async () => {
      const created = await createTaxonomy(schemaName, 'GetTest', {
        icon: '📚',
        color: '#123456',
      });

      const result = await getTaxonomy(schemaName, created.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(created.id);
      expect(result?.name).toBe('GetTest');
      expect(result?.icon).toBe('📚');
      expect(result?.color).toBe('#123456');
    });

    it('should return null for non-existent ID', async () => {
      const result = await getTaxonomy(schemaName, 99999);

      expect(result).toBeNull();
    });
  });

  describe('getAllTaxonomies', () => {
    it('should retrieve all taxonomies ordered by name', async () => {
      // Create taxonomies with known names
      await createTaxonomy(schemaName, 'Zebra');
      await createTaxonomy(schemaName, 'Alpha');

      const results = await getAllTaxonomies(schemaName);

      expect(results.length).toBeGreaterThanOrEqual(2);

      // Find our test taxonomies
      const alphaIndex = results.findIndex((t) => t.name === 'Alpha');
      const zebraIndex = results.findIndex((t) => t.name === 'Zebra');

      expect(alphaIndex).toBeLessThan(zebraIndex); // Should be ordered alphabetically
    });
  });

  describe('updateTaxonomy', () => {
    it('should update taxonomy name', async () => {
      const created = await createTaxonomy(schemaName, 'OldName');

      const updated = await updateTaxonomy(schemaName, created.id, {
        name: 'NewName',
      });

      expect(updated.id).toBe(created.id);
      expect(updated.name).toBe('NewName');
    });

    it('should update taxonomy icon', async () => {
      const created = await createTaxonomy(schemaName, 'IconTest', {
        icon: '🔴',
      });

      const updated = await updateTaxonomy(schemaName, created.id, {
        icon: '🔵',
      });

      expect(updated.icon).toBe('🔵');
    });

    it('should update taxonomy color', async () => {
      const created = await createTaxonomy(schemaName, 'ColorTest', {
        color: '#000000',
      });

      const updated = await updateTaxonomy(schemaName, created.id, {
        color: '#FFFFFF',
      });

      expect(updated.color).toBe('#FFFFFF');
    });

    it('should update multiple fields at once', async () => {
      const created = await createTaxonomy(schemaName, 'MultiUpdate');

      const updated = await updateTaxonomy(schemaName, created.id, {
        name: 'MultiUpdated',
        icon: '✨',
        color: '#ABCDEF',
      });

      expect(updated.name).toBe('MultiUpdated');
      expect(updated.icon).toBe('✨');
      expect(updated.color).toBe('#ABCDEF');
    });
  });

  describe('deleteTaxonomy', () => {
    it('should delete an existing taxonomy', async () => {
      const created = await createTaxonomy(schemaName, 'ToDelete');

      // Verify it exists
      let result = await getTaxonomy(schemaName, created.id);
      expect(result).not.toBeNull();

      // Delete it
      await deleteTaxonomy(schemaName, created.id);

      // Verify it's gone
      result = await getTaxonomy(schemaName, created.id);
      expect(result).toBeNull();
    });

    it('should not throw when deleting non-existent taxonomy', async () => {
      await expect(
        deleteTaxonomy(schemaName, 99999)
      ).resolves.not.toThrow();
    });
  });
});
