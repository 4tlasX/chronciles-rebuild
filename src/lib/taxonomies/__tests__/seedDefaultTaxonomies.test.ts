import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { seedDefaultTaxonomies, seedOptionalTaxonomy } from '../seedDefaultTaxonomies';
import { coreTaxonomies, optionalTaxonomies } from '../defaultTaxonomies';
import { getAllTaxonomies } from '../../db/tenantQueries';
import {
  setupTestSchema,
  teardownTestSchema,
} from '../../db/__tests__/setup';

describe('seedDefaultTaxonomies', () => {
  let schemaName: string;

  beforeAll(async () => {
    schemaName = await setupTestSchema();
  });

  afterAll(async () => {
    await teardownTestSchema();
  });

  describe('seedDefaultTaxonomies', () => {
    it('should seed all core taxonomies', async () => {
      await seedDefaultTaxonomies(schemaName);

      const taxonomies = await getAllTaxonomies(schemaName);

      expect(taxonomies.length).toBe(coreTaxonomies.length);
    });

    it('should create taxonomies with correct names', async () => {
      const taxonomies = await getAllTaxonomies(schemaName);
      const names = taxonomies.map((t) => t.name);

      for (const core of coreTaxonomies) {
        expect(names).toContain(core.name);
      }
    });

    it('should create taxonomies with correct icons', async () => {
      const taxonomies = await getAllTaxonomies(schemaName);

      for (const core of coreTaxonomies) {
        const seeded = taxonomies.find((t) => t.name === core.name);
        expect(seeded?.icon).toBe(core.icon);
      }
    });

    it('should create taxonomies with correct colors', async () => {
      const taxonomies = await getAllTaxonomies(schemaName);

      for (const core of coreTaxonomies) {
        const seeded = taxonomies.find((t) => t.name === core.name);
        expect(seeded?.color).toBe(core.color);
      }
    });

    it('should be idempotent (running twice does not create duplicates)', async () => {
      // Run twice
      await seedDefaultTaxonomies(schemaName);
      await seedDefaultTaxonomies(schemaName);

      const taxonomies = await getAllTaxonomies(schemaName);

      // Should still have same count (ON CONFLICT DO NOTHING)
      expect(taxonomies.length).toBe(coreTaxonomies.length);
    });
  });

  describe('seedOptionalTaxonomy', () => {
    it('should seed Food taxonomy', async () => {
      await seedOptionalTaxonomy(schemaName, 'Food');

      const taxonomies = await getAllTaxonomies(schemaName);
      const food = taxonomies.find((t) => t.name === 'Food');

      expect(food).toBeDefined();
      expect(food?.icon).toBe('utensils');
    });

    it('should seed Medication taxonomy', async () => {
      await seedOptionalTaxonomy(schemaName, 'Medication');

      const taxonomies = await getAllTaxonomies(schemaName);
      const medication = taxonomies.find((t) => t.name === 'Medication');

      expect(medication).toBeDefined();
      expect(medication?.icon).toBe('pills');
    });

    it('should seed Goal taxonomy', async () => {
      await seedOptionalTaxonomy(schemaName, 'Goal');

      const taxonomies = await getAllTaxonomies(schemaName);
      const goal = taxonomies.find((t) => t.name === 'Goal');

      expect(goal).toBeDefined();
      expect(goal?.icon).toBe('bullseye');
    });

    it('should seed Milestone taxonomy', async () => {
      await seedOptionalTaxonomy(schemaName, 'Milestone');

      const taxonomies = await getAllTaxonomies(schemaName);
      const milestone = taxonomies.find((t) => t.name === 'Milestone');

      expect(milestone).toBeDefined();
      expect(milestone?.icon).toBe('flag');
    });

    it('should seed Exercise taxonomy', async () => {
      await seedOptionalTaxonomy(schemaName, 'Exercise');

      const taxonomies = await getAllTaxonomies(schemaName);
      const exercise = taxonomies.find((t) => t.name === 'Exercise');

      expect(exercise).toBeDefined();
      expect(exercise?.icon).toBe('dumbbell');
    });

    it('should seed Allergy taxonomy', async () => {
      await seedOptionalTaxonomy(schemaName, 'Allergy');

      const taxonomies = await getAllTaxonomies(schemaName);
      const allergy = taxonomies.find((t) => t.name === 'Allergy');

      expect(allergy).toBeDefined();
      expect(allergy?.icon).toBe('triangle-exclamation');
    });

    it('should be case insensitive', async () => {
      // These should all work
      await expect(seedOptionalTaxonomy(schemaName, 'food')).resolves.not.toThrow();
      await expect(seedOptionalTaxonomy(schemaName, 'FOOD')).resolves.not.toThrow();
      await expect(seedOptionalTaxonomy(schemaName, 'Food')).resolves.not.toThrow();
    });

    it('should throw for unknown taxonomy', async () => {
      await expect(
        seedOptionalTaxonomy(schemaName, 'UnknownTaxonomy')
      ).rejects.toThrow('Unknown optional taxonomy: UnknownTaxonomy');
    });

    it('should throw for core taxonomy names', async () => {
      // Core taxonomies are not in optionalTaxonomies
      await expect(seedOptionalTaxonomy(schemaName, 'Task')).rejects.toThrow();
      await expect(seedOptionalTaxonomy(schemaName, 'Event')).rejects.toThrow();
    });

    it('should be idempotent', async () => {
      // Seed same optional taxonomy multiple times
      await seedOptionalTaxonomy(schemaName, 'Food');
      await seedOptionalTaxonomy(schemaName, 'Food');
      await seedOptionalTaxonomy(schemaName, 'Food');

      const taxonomies = await getAllTaxonomies(schemaName);
      const foodCount = taxonomies.filter((t) => t.name === 'Food').length;

      expect(foodCount).toBe(1);
    });
  });

  describe('Integration', () => {
    it('should have all taxonomies after seeding core and all optional', async () => {
      // Count current taxonomies
      const beforeOptional = await getAllTaxonomies(schemaName);

      // Seed all optional
      for (const optional of optionalTaxonomies) {
        await seedOptionalTaxonomy(schemaName, optional.name);
      }

      const afterOptional = await getAllTaxonomies(schemaName);

      // Should have core + optional
      expect(afterOptional.length).toBe(
        coreTaxonomies.length + optionalTaxonomies.length
      );
    });
  });
});
