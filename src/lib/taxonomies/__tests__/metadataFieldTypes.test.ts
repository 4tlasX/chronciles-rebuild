import { describe, it, expect } from 'vitest';
import {
  getDefaultMetadata,
  defaultTaskMetadata,
  defaultGoalMetadata,
  defaultMilestoneMetadata,
  defaultEventMetadata,
  defaultMeetingMetadata,
  defaultSymptomMetadata,
  defaultFoodMetadata,
  defaultMedicationMetadata,
  defaultExerciseMetadata,
} from '../metadataFieldTypes';

describe('metadataFieldTypes', () => {
  describe('defaultTaskMetadata', () => {
    it('should have correct default values', () => {
      expect(defaultTaskMetadata).toEqual({
        isCompleted: false,
        isInProgress: false,
        isAutoMigrating: false,
        milestoneIds: [],
      });
    });

    it('should have boolean fields as false by default', () => {
      expect(defaultTaskMetadata.isCompleted).toBe(false);
      expect(defaultTaskMetadata.isInProgress).toBe(false);
      expect(defaultTaskMetadata.isAutoMigrating).toBe(false);
    });

    it('should have empty milestoneIds array', () => {
      expect(Array.isArray(defaultTaskMetadata.milestoneIds)).toBe(true);
      expect(defaultTaskMetadata.milestoneIds).toHaveLength(0);
    });
  });

  describe('defaultGoalMetadata', () => {
    it('should have correct default values', () => {
      expect(defaultGoalMetadata).toEqual({
        type: 'short_term',
        status: 'active',
        targetDate: null,
      });
    });

    it('should default to short_term type', () => {
      expect(defaultGoalMetadata.type).toBe('short_term');
    });

    it('should default to active status', () => {
      expect(defaultGoalMetadata.status).toBe('active');
    });

    it('should have null targetDate', () => {
      expect(defaultGoalMetadata.targetDate).toBeNull();
    });
  });

  describe('defaultMilestoneMetadata', () => {
    it('should have correct default values', () => {
      expect(defaultMilestoneMetadata).toEqual({
        goalIds: [],
        isCompleted: false,
        completedAt: null,
      });
    });

    it('should have empty goalIds array', () => {
      expect(defaultMilestoneMetadata.goalIds).toEqual([]);
    });

    it('should not be completed by default', () => {
      expect(defaultMilestoneMetadata.isCompleted).toBe(false);
      expect(defaultMilestoneMetadata.completedAt).toBeNull();
    });
  });

  describe('defaultEventMetadata', () => {
    it('should have correct default values', () => {
      expect(defaultEventMetadata).toEqual({
        startDate: null,
        startTime: '09:00',
        endDate: null,
        endTime: '10:00',
        location: '',
        address: '',
        phone: '',
        notes: '',
      });
    });

    it('should have default times', () => {
      expect(defaultEventMetadata.startTime).toBe('09:00');
      expect(defaultEventMetadata.endTime).toBe('10:00');
    });

    it('should have null dates', () => {
      expect(defaultEventMetadata.startDate).toBeNull();
      expect(defaultEventMetadata.endDate).toBeNull();
    });

    it('should have empty string fields', () => {
      expect(defaultEventMetadata.location).toBe('');
      expect(defaultEventMetadata.address).toBe('');
      expect(defaultEventMetadata.phone).toBe('');
      expect(defaultEventMetadata.notes).toBe('');
    });
  });

  describe('defaultMeetingMetadata', () => {
    it('should extend event metadata with topic and attendees', () => {
      expect(defaultMeetingMetadata).toEqual({
        startDate: null,
        startTime: '09:00',
        endDate: null,
        endTime: '10:00',
        location: '',
        address: '',
        phone: '',
        notes: '',
        topic: '',
        attendees: '',
      });
    });

    it('should have empty topic and attendees', () => {
      expect(defaultMeetingMetadata.topic).toBe('');
      expect(defaultMeetingMetadata.attendees).toBe('');
    });

    it('should inherit event defaults', () => {
      expect(defaultMeetingMetadata.startTime).toBe(defaultEventMetadata.startTime);
      expect(defaultMeetingMetadata.endTime).toBe(defaultEventMetadata.endTime);
    });
  });

  describe('defaultSymptomMetadata', () => {
    it('should have correct default values', () => {
      expect(defaultSymptomMetadata).toEqual({
        severity: 5,
        occurredAt: null,
        duration: null,
        notes: '',
      });
    });

    it('should have medium severity by default', () => {
      expect(defaultSymptomMetadata.severity).toBe(5);
    });

    it('should have null optional fields', () => {
      expect(defaultSymptomMetadata.occurredAt).toBeNull();
      expect(defaultSymptomMetadata.duration).toBeNull();
    });
  });

  describe('defaultFoodMetadata', () => {
    it('should have correct default values', () => {
      expect(defaultFoodMetadata).toEqual({
        mealType: 'lunch',
        consumedAt: null,
        ingredients: '',
        calories: null,
        notes: '',
      });
    });

    it('should default to lunch meal type', () => {
      expect(defaultFoodMetadata.mealType).toBe('lunch');
    });

    it('should have null calories', () => {
      expect(defaultFoodMetadata.calories).toBeNull();
    });
  });

  describe('defaultMedicationMetadata', () => {
    it('should have correct default values', () => {
      expect(defaultMedicationMetadata).toEqual({
        dosage: '',
        frequency: 'once_daily',
        scheduleTimes: ['09:00'],
        isActive: true,
        notes: '',
        startDate: null,
      });
    });

    it('should default to once_daily frequency', () => {
      expect(defaultMedicationMetadata.frequency).toBe('once_daily');
    });

    it('should have one default schedule time', () => {
      expect(defaultMedicationMetadata.scheduleTimes).toEqual(['09:00']);
    });

    it('should be active by default', () => {
      expect(defaultMedicationMetadata.isActive).toBe(true);
    });
  });

  describe('defaultExerciseMetadata', () => {
    it('should have correct default values', () => {
      expect(defaultExerciseMetadata).toEqual({
        type: 'cardio',
        otherType: '',
        duration: null,
        intensity: 'medium',
        distance: null,
        distanceUnit: 'miles',
        calories: null,
        performedAt: null,
        notes: '',
      });
    });

    it('should default to cardio type', () => {
      expect(defaultExerciseMetadata.type).toBe('cardio');
    });

    it('should default to medium intensity', () => {
      expect(defaultExerciseMetadata.intensity).toBe('medium');
    });

    it('should default to miles unit', () => {
      expect(defaultExerciseMetadata.distanceUnit).toBe('miles');
    });

    it('should have null numeric fields', () => {
      expect(defaultExerciseMetadata.duration).toBeNull();
      expect(defaultExerciseMetadata.distance).toBeNull();
      expect(defaultExerciseMetadata.calories).toBeNull();
    });
  });

  describe('getDefaultMetadata', () => {
    it('should return task defaults for "task"', () => {
      expect(getDefaultMetadata('task')).toEqual(defaultTaskMetadata);
    });

    it('should return task defaults for "Task" (case insensitive)', () => {
      expect(getDefaultMetadata('Task')).toEqual(defaultTaskMetadata);
    });

    it('should return task defaults for "TASK" (case insensitive)', () => {
      expect(getDefaultMetadata('TASK')).toEqual(defaultTaskMetadata);
    });

    it('should return goal defaults for "goal"', () => {
      expect(getDefaultMetadata('goal')).toEqual(defaultGoalMetadata);
    });

    it('should return milestone defaults for "milestone"', () => {
      expect(getDefaultMetadata('milestone')).toEqual(defaultMilestoneMetadata);
    });

    it('should return event defaults for "event"', () => {
      expect(getDefaultMetadata('event')).toEqual(defaultEventMetadata);
    });

    it('should return meeting defaults for "meeting"', () => {
      expect(getDefaultMetadata('meeting')).toEqual(defaultMeetingMetadata);
    });

    it('should return symptom defaults for "symptom"', () => {
      expect(getDefaultMetadata('symptom')).toEqual(defaultSymptomMetadata);
    });

    it('should return food defaults for "food"', () => {
      expect(getDefaultMetadata('food')).toEqual(defaultFoodMetadata);
    });

    it('should return medication defaults for "medication"', () => {
      expect(getDefaultMetadata('medication')).toEqual(defaultMedicationMetadata);
    });

    it('should return exercise defaults for "exercise"', () => {
      expect(getDefaultMetadata('exercise')).toEqual(defaultExerciseMetadata);
    });

    it('should return empty object for unknown taxonomy', () => {
      expect(getDefaultMetadata('unknown')).toEqual({});
    });

    it('should return empty object for empty string', () => {
      expect(getDefaultMetadata('')).toEqual({});
    });

    it('should return new object (not reference to original)', () => {
      const result1 = getDefaultMetadata('task');
      const result2 = getDefaultMetadata('task');

      expect(result1).not.toBe(result2);
      expect(result1).toEqual(result2);

      // Modify one shouldn't affect the other
      (result1 as Record<string, unknown>).isCompleted = true;
      expect((result2 as Record<string, unknown>).isCompleted).toBe(false);
    });
  });
});
