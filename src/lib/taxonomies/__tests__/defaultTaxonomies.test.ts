import { describe, it, expect } from 'vitest';
import {
  coreTaxonomies,
  optionalTaxonomies,
  allDefaultTaxonomies,
  hasSpecializedFields,
} from '../defaultTaxonomies';

describe('defaultTaxonomies', () => {
  describe('coreTaxonomies', () => {
    it('should have 10 core taxonomies', () => {
      expect(coreTaxonomies).toHaveLength(10);
    });

    it('should include Task taxonomy', () => {
      const task = coreTaxonomies.find((t) => t.name === 'Task');
      expect(task).toBeDefined();
      expect(task?.icon).toBe('circle-check');
      expect(task?.color).toMatch(/^#[0-9A-Fa-f]{6}$/i);
    });

    it('should include Idea taxonomy', () => {
      const idea = coreTaxonomies.find((t) => t.name === 'Idea');
      expect(idea).toBeDefined();
      expect(idea?.icon).toBe('lightbulb');
    });

    it('should include Research taxonomy', () => {
      const research = coreTaxonomies.find((t) => t.name === 'Research');
      expect(research).toBeDefined();
      expect(research?.icon).toBe('magnifying-glass');
    });

    it('should include Event taxonomy', () => {
      const event = coreTaxonomies.find((t) => t.name === 'Event');
      expect(event).toBeDefined();
      expect(event?.icon).toBe('calendar');
    });

    it('should include Meeting taxonomy', () => {
      const meeting = coreTaxonomies.find((t) => t.name === 'Meeting');
      expect(meeting).toBeDefined();
      expect(meeting?.icon).toBe('users');
    });

    it('should include Symptom taxonomy', () => {
      const symptom = coreTaxonomies.find((t) => t.name === 'Symptom');
      expect(symptom).toBeDefined();
      expect(symptom?.icon).toBe('flask');
    });

    it('should include Music taxonomy', () => {
      const music = coreTaxonomies.find((t) => t.name === 'Music');
      expect(music).toBeDefined();
      expect(music?.icon).toBe('music');
    });

    it('should include Books taxonomy', () => {
      const books = coreTaxonomies.find((t) => t.name === 'Books');
      expect(books).toBeDefined();
      expect(books?.icon).toBe('book');
    });

    it('should include TV/Movies taxonomy', () => {
      const tv = coreTaxonomies.find((t) => t.name === 'TV/Movies');
      expect(tv).toBeDefined();
      expect(tv?.icon).toBe('film');
    });

    it('should include Quote taxonomy', () => {
      const quote = coreTaxonomies.find((t) => t.name === 'Quote');
      expect(quote).toBeDefined();
      expect(quote?.icon).toBe('quote-left');
    });

    it('all taxonomies should have name, icon, and color', () => {
      for (const taxonomy of coreTaxonomies) {
        expect(taxonomy.name).toBeDefined();
        expect(taxonomy.name.length).toBeGreaterThan(0);
        expect(taxonomy.icon).toBeDefined();
        expect(taxonomy.color).toMatch(/^#[0-9A-Fa-f]{6}$/i);
      }
    });

    it('all taxonomy names should be unique', () => {
      const names = coreTaxonomies.map((t) => t.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });
  });

  describe('optionalTaxonomies', () => {
    it('should have 6 optional taxonomies', () => {
      expect(optionalTaxonomies).toHaveLength(6);
    });

    it('should include Food taxonomy', () => {
      const food = optionalTaxonomies.find((t) => t.name === 'Food');
      expect(food).toBeDefined();
      expect(food?.icon).toBe('utensils');
    });

    it('should include Medication taxonomy', () => {
      const medication = optionalTaxonomies.find((t) => t.name === 'Medication');
      expect(medication).toBeDefined();
      expect(medication?.icon).toBe('pills');
    });

    it('should include Goal taxonomy', () => {
      const goal = optionalTaxonomies.find((t) => t.name === 'Goal');
      expect(goal).toBeDefined();
      expect(goal?.icon).toBe('bullseye');
    });

    it('should include Milestone taxonomy', () => {
      const milestone = optionalTaxonomies.find((t) => t.name === 'Milestone');
      expect(milestone).toBeDefined();
      expect(milestone?.icon).toBe('flag');
    });

    it('should include Exercise taxonomy', () => {
      const exercise = optionalTaxonomies.find((t) => t.name === 'Exercise');
      expect(exercise).toBeDefined();
      expect(exercise?.icon).toBe('dumbbell');
    });

    it('should include Allergy taxonomy', () => {
      const allergy = optionalTaxonomies.find((t) => t.name === 'Allergy');
      expect(allergy).toBeDefined();
      expect(allergy?.icon).toBe('triangle-exclamation');
    });

    it('all optional taxonomies should have name, icon, and color', () => {
      for (const taxonomy of optionalTaxonomies) {
        expect(taxonomy.name).toBeDefined();
        expect(taxonomy.name.length).toBeGreaterThan(0);
        expect(taxonomy.icon).toBeDefined();
        expect(taxonomy.color).toMatch(/^#[0-9A-Fa-f]{6}$/i);
      }
    });
  });

  describe('allDefaultTaxonomies', () => {
    it('should combine core and optional taxonomies', () => {
      expect(allDefaultTaxonomies).toHaveLength(
        coreTaxonomies.length + optionalTaxonomies.length
      );
    });

    it('should contain all core taxonomies', () => {
      for (const core of coreTaxonomies) {
        expect(allDefaultTaxonomies).toContain(core);
      }
    });

    it('should contain all optional taxonomies', () => {
      for (const optional of optionalTaxonomies) {
        expect(allDefaultTaxonomies).toContain(optional);
      }
    });

    it('all taxonomy names should be unique across core and optional', () => {
      const names = allDefaultTaxonomies.map((t) => t.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });
  });

  describe('hasSpecializedFields', () => {
    it('should return true for Task', () => {
      expect(hasSpecializedFields('Task')).toBe(true);
      expect(hasSpecializedFields('task')).toBe(true);
      expect(hasSpecializedFields('TASK')).toBe(true);
    });

    it('should return true for Goal', () => {
      expect(hasSpecializedFields('Goal')).toBe(true);
      expect(hasSpecializedFields('goal')).toBe(true);
    });

    it('should return true for Milestone', () => {
      expect(hasSpecializedFields('Milestone')).toBe(true);
      expect(hasSpecializedFields('milestone')).toBe(true);
    });

    it('should return true for Event', () => {
      expect(hasSpecializedFields('Event')).toBe(true);
      expect(hasSpecializedFields('event')).toBe(true);
    });

    it('should return true for Meeting', () => {
      expect(hasSpecializedFields('Meeting')).toBe(true);
      expect(hasSpecializedFields('meeting')).toBe(true);
    });

    it('should return true for Symptom', () => {
      expect(hasSpecializedFields('Symptom')).toBe(true);
      expect(hasSpecializedFields('symptom')).toBe(true);
    });

    it('should return true for Food', () => {
      expect(hasSpecializedFields('Food')).toBe(true);
      expect(hasSpecializedFields('food')).toBe(true);
    });

    it('should return true for Medication', () => {
      expect(hasSpecializedFields('Medication')).toBe(true);
      expect(hasSpecializedFields('medication')).toBe(true);
    });

    it('should return true for Exercise', () => {
      expect(hasSpecializedFields('Exercise')).toBe(true);
      expect(hasSpecializedFields('exercise')).toBe(true);
    });

    it('should return false for Idea (no specialized fields)', () => {
      expect(hasSpecializedFields('Idea')).toBe(false);
      expect(hasSpecializedFields('idea')).toBe(false);
    });

    it('should return false for Research (no specialized fields)', () => {
      expect(hasSpecializedFields('Research')).toBe(false);
    });

    it('should return false for Music (no specialized fields)', () => {
      expect(hasSpecializedFields('Music')).toBe(false);
    });

    it('should return false for Books (no specialized fields)', () => {
      expect(hasSpecializedFields('Books')).toBe(false);
    });

    it('should return false for TV/Movies (no specialized fields)', () => {
      expect(hasSpecializedFields('TV/Movies')).toBe(false);
    });

    it('should return false for Quote (no specialized fields)', () => {
      expect(hasSpecializedFields('Quote')).toBe(false);
    });

    it('should return false for Allergy (no specialized fields)', () => {
      expect(hasSpecializedFields('Allergy')).toBe(false);
    });

    it('should return false for unknown taxonomy', () => {
      expect(hasSpecializedFields('Unknown')).toBe(false);
      expect(hasSpecializedFields('random')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(hasSpecializedFields('')).toBe(false);
    });
  });
});
