// TypeScript interfaces for specialized metadata fields by taxonomy type

// Task metadata fields
export interface TaskMetadata {
  isCompleted: boolean;
  isInProgress: boolean;
  isAutoMigrating: boolean;
  milestoneIds: string[];
}

// Goal metadata fields
export interface GoalMetadata {
  type: 'short_term' | 'long_term';
  status: 'active' | 'completed' | 'archived';
  targetDate: string | null;
}

// Milestone metadata fields
export interface MilestoneMetadata {
  goalIds: string[];
  isCompleted: boolean;
  completedAt: string | null;
}

// Event metadata fields
export interface EventMetadata {
  startDate: string | null;
  startTime: string;
  endDate: string | null;
  endTime: string;
  location: string;
  address: string;
  phone: string;
  notes: string;
}

// Meeting metadata fields (extends Event)
export interface MeetingMetadata extends EventMetadata {
  topic: string;
  attendees: string;
}

// Symptom metadata fields
export interface SymptomMetadata {
  severity: number; // 1-10
  occurredAt: string | null;
  duration: number | null; // minutes
  notes: string;
}

// Food metadata fields
export interface FoodMetadata {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  consumedAt: string | null;
  ingredients: string;
  calories: number | null;
  notes: string;
}

// Medication metadata fields
export interface MedicationMetadata {
  dosage: string;
  frequency: 'once_daily' | 'twice_daily' | 'three_times_daily' | 'as_needed' | 'custom';
  scheduleTimes: string[];
  isActive: boolean;
  notes: string;
  startDate: string | null;
}

// Exercise metadata fields
export interface ExerciseMetadata {
  type: 'yoga' | 'cardio' | 'strength' | 'swimming' | 'running' | 'cycling' | 'walking' | 'hiking' | 'other';
  otherType: string;
  duration: number | null; // minutes
  intensity: 'low' | 'medium' | 'high';
  distance: number | null;
  distanceUnit: 'miles' | 'km';
  calories: number | null;
  performedAt: string | null;
  notes: string;
}

// Union type for all specialized metadata
export type SpecializedMetadata =
  | TaskMetadata
  | GoalMetadata
  | MilestoneMetadata
  | EventMetadata
  | MeetingMetadata
  | SymptomMetadata
  | FoodMetadata
  | MedicationMetadata
  | ExerciseMetadata;

// Post metadata with taxonomy info
export interface PostMetadata {
  _taxonomyId?: number;
  _taxonomyName?: string;
  [key: string]: unknown;
}

// Default values for each metadata type
export const defaultTaskMetadata: TaskMetadata = {
  isCompleted: false,
  isInProgress: false,
  isAutoMigrating: false,
  milestoneIds: [],
};

export const defaultGoalMetadata: GoalMetadata = {
  type: 'short_term',
  status: 'active',
  targetDate: null,
};

export const defaultMilestoneMetadata: MilestoneMetadata = {
  goalIds: [],
  isCompleted: false,
  completedAt: null,
};

export const defaultEventMetadata: EventMetadata = {
  startDate: null,
  startTime: '09:00',
  endDate: null,
  endTime: '10:00',
  location: '',
  address: '',
  phone: '',
  notes: '',
};

export const defaultMeetingMetadata: MeetingMetadata = {
  ...defaultEventMetadata,
  topic: '',
  attendees: '',
};

export const defaultSymptomMetadata: SymptomMetadata = {
  severity: 5,
  occurredAt: null,
  duration: null,
  notes: '',
};

export const defaultFoodMetadata: FoodMetadata = {
  mealType: 'lunch',
  consumedAt: null,
  ingredients: '',
  calories: null,
  notes: '',
};

export const defaultMedicationMetadata: MedicationMetadata = {
  dosage: '',
  frequency: 'once_daily',
  scheduleTimes: ['09:00'],
  isActive: true,
  notes: '',
  startDate: null,
};

export const defaultExerciseMetadata: ExerciseMetadata = {
  type: 'cardio',
  otherType: '',
  duration: null,
  intensity: 'medium',
  distance: null,
  distanceUnit: 'miles',
  calories: null,
  performedAt: null,
  notes: '',
};

// All specialized metadata keys (used to filter them out for generic taxonomies)
const allSpecializedKeys = new Set([
  // Task
  'isCompleted', 'isInProgress', 'isAutoMigrating', 'milestoneIds',
  // Goal
  'type', 'status', 'targetDate',
  // Milestone
  'goalIds', 'completedAt',
  // Event & Meeting
  'startDate', 'startTime', 'endDate', 'endTime', 'location', 'address', 'phone', 'notes',
  'topic', 'attendees',
  // Symptom
  'severity', 'occurredAt', 'duration',
  // Food
  'mealType', 'consumedAt', 'ingredients', 'calories',
  // Medication
  'dosage', 'frequency', 'scheduleTimes', 'isActive',
  // Exercise
  'otherType', 'intensity', 'distance', 'distanceUnit', 'performedAt',
]);

// Check if a key is a specialized metadata key
export function isSpecializedMetadataKey(key: string): boolean {
  return allSpecializedKeys.has(key);
}

// Get default metadata for a taxonomy type
export function getDefaultMetadata(taxonomyName: string): Record<string, unknown> {
  const name = taxonomyName.toLowerCase();

  switch (name) {
    case 'task':
      return { ...defaultTaskMetadata };
    case 'goal':
      return { ...defaultGoalMetadata };
    case 'milestone':
      return { ...defaultMilestoneMetadata };
    case 'event':
      return { ...defaultEventMetadata };
    case 'meeting':
      return { ...defaultMeetingMetadata };
    case 'symptom':
      return { ...defaultSymptomMetadata };
    case 'food':
      return { ...defaultFoodMetadata };
    case 'medication':
      return { ...defaultMedicationMetadata };
    case 'exercise':
      return { ...defaultExerciseMetadata };
    default:
      return {};
  }
}
