import type { IconName } from '@/lib/icons';

// Taxonomy definition with optional specialized fields indicator
export interface DefaultTaxonomy {
  name: string;
  color: string;
  icon: IconName;
  hasSpecializedFields: boolean;
}

// Core taxonomies - always seeded for new users
export const coreTaxonomies: DefaultTaxonomy[] = [
  {
    name: 'Task',
    color: '#3B82F6',
    icon: 'circle-check',
    hasSpecializedFields: true,
  },
  {
    name: 'Idea',
    color: '#8B5CF6',
    icon: 'lightbulb',
    hasSpecializedFields: false,
  },
  {
    name: 'Research',
    color: '#10B981',
    icon: 'magnifying-glass',
    hasSpecializedFields: false,
  },
  {
    name: 'Event',
    color: '#F59E0B',
    icon: 'calendar',
    hasSpecializedFields: true,
  },
  {
    name: 'Meeting',
    color: '#EC4899',
    icon: 'users',
    hasSpecializedFields: true,
  },
  {
    name: 'Symptom',
    color: '#EF4444',
    icon: 'flask',
    hasSpecializedFields: true,
  },
  {
    name: 'Music',
    color: '#EC4899',
    icon: 'music',
    hasSpecializedFields: false,
  },
  {
    name: 'Books',
    color: '#8B5CF6',
    icon: 'book',
    hasSpecializedFields: false,
  },
  {
    name: 'TV/Movies',
    color: '#F59E0B',
    icon: 'film',
    hasSpecializedFields: false,
  },
  {
    name: 'Quote',
    color: '#6366F1',
    icon: 'quote-left',
    hasSpecializedFields: false,
  },
];

// Optional feature taxonomies - can be enabled by users
export const optionalTaxonomies: DefaultTaxonomy[] = [
  {
    name: 'Food',
    color: '#EF4444',
    icon: 'utensils',
    hasSpecializedFields: true,
  },
  {
    name: 'Medication',
    color: '#14B8A6',
    icon: 'pills',
    hasSpecializedFields: true,
  },
  {
    name: 'Goal',
    color: '#F97316',
    icon: 'bullseye',
    hasSpecializedFields: true,
  },
  {
    name: 'Milestone',
    color: '#A855F7',
    icon: 'flag',
    hasSpecializedFields: true,
  },
  {
    name: 'Exercise',
    color: '#22C55E',
    icon: 'dumbbell',
    hasSpecializedFields: true,
  },
  {
    name: 'Allergy',
    color: '#F59E0B',
    icon: 'triangle-exclamation',
    hasSpecializedFields: false,
  },
];

// All default taxonomies combined
export const allDefaultTaxonomies: DefaultTaxonomy[] = [
  ...coreTaxonomies,
  ...optionalTaxonomies,
];

// Taxonomies that have specialized metadata input fields
export const taxonomiesWithSpecializedFields = allDefaultTaxonomies
  .filter((t) => t.hasSpecializedFields)
  .map((t) => t.name.toLowerCase());

// Check if a taxonomy name has specialized fields
export function hasSpecializedFields(taxonomyName: string): boolean {
  return taxonomiesWithSpecializedFields.includes(taxonomyName.toLowerCase());
}
