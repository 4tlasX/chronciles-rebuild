import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestSchema, teardownTestSchema } from './setup';
import {
  createPost,
  getPost,
  updatePost,
  deletePost,
  findPostsByMetadata,
  findPostsWithMetadataKey,
} from '../tenantQueries';
import { createTaxonomy, getAllTaxonomies } from '../tenantQueries';
import {
  defaultTaskMetadata,
  defaultGoalMetadata,
  defaultMilestoneMetadata,
  defaultEventMetadata,
  defaultMeetingMetadata,
  defaultSymptomMetadata,
  defaultFoodMetadata,
  defaultMedicationMetadata,
  defaultExerciseMetadata,
} from '../../taxonomies';

describe('Specialized Metadata Storage', () => {
  let schemaName: string;

  beforeAll(async () => {
    schemaName = await setupTestSchema();
  });

  afterAll(async () => {
    await teardownTestSchema();
  });

  describe('Task Metadata', () => {
    it('should store and retrieve task metadata with default values', async () => {
      const metadata = {
        _taxonomyId: 1,
        ...defaultTaskMetadata,
      };

      const post = await createPost(schemaName, 'Test task', metadata);
      const retrieved = await getPost(schemaName, post.id);

      expect(retrieved?.metadata).toEqual(metadata);
      expect(retrieved?.metadata.isCompleted).toBe(false);
      expect(retrieved?.metadata.isInProgress).toBe(false);
      expect(retrieved?.metadata.isAutoMigrating).toBe(false);
      expect(retrieved?.metadata.milestoneIds).toEqual([]);
    });

    it('should store task with completed status', async () => {
      const metadata = {
        _taxonomyId: 1,
        isCompleted: true,
        isInProgress: false,
        isAutoMigrating: false,
        milestoneIds: ['m1', 'm2'],
      };

      const post = await createPost(schemaName, 'Completed task', metadata);
      const retrieved = await getPost(schemaName, post.id);

      expect(retrieved?.metadata.isCompleted).toBe(true);
      expect(retrieved?.metadata.milestoneIds).toEqual(['m1', 'm2']);
    });

    it('should update task completion status', async () => {
      const post = await createPost(schemaName, 'Task to complete', {
        _taxonomyId: 1,
        isCompleted: false,
        isInProgress: true,
        isAutoMigrating: true,
        milestoneIds: [],
      });

      const updated = await updatePost(schemaName, post.id, {
        metadata: {
          _taxonomyId: 1,
          isCompleted: true,
          isInProgress: false,
          isAutoMigrating: false,
          milestoneIds: [],
        },
      });

      expect(updated.metadata.isCompleted).toBe(true);
      expect(updated.metadata.isInProgress).toBe(false);
      expect(updated.metadata.isAutoMigrating).toBe(false);
    });

    it('should find completed tasks using metadata search', async () => {
      await createPost(schemaName, 'Complete task search', {
        _taxonomyId: 1,
        isCompleted: true,
        isInProgress: false,
        isAutoMigrating: false,
        milestoneIds: [],
      });

      const results = await findPostsByMetadata(schemaName, 'isCompleted', true);
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results.every((p) => p.metadata.isCompleted === true)).toBe(true);
    });
  });

  describe('Goal Metadata', () => {
    it('should store and retrieve goal metadata', async () => {
      const metadata = {
        _taxonomyId: 2,
        type: 'long_term',
        status: 'active',
        targetDate: '2025-12-31',
      };

      const post = await createPost(schemaName, 'Long term goal', metadata);
      const retrieved = await getPost(schemaName, post.id);

      expect(retrieved?.metadata.type).toBe('long_term');
      expect(retrieved?.metadata.status).toBe('active');
      expect(retrieved?.metadata.targetDate).toBe('2025-12-31');
    });

    it('should update goal status to completed', async () => {
      const post = await createPost(schemaName, 'Goal to complete', {
        _taxonomyId: 2,
        ...defaultGoalMetadata,
      });

      const updated = await updatePost(schemaName, post.id, {
        metadata: {
          _taxonomyId: 2,
          type: 'short_term',
          status: 'completed',
          targetDate: null,
        },
      });

      expect(updated.metadata.status).toBe('completed');
    });

    it('should store goal with null target date', async () => {
      const metadata = {
        _taxonomyId: 2,
        type: 'short_term',
        status: 'active',
        targetDate: null,
      };

      const post = await createPost(schemaName, 'Goal no date', metadata);
      const retrieved = await getPost(schemaName, post.id);

      expect(retrieved?.metadata.targetDate).toBeNull();
    });
  });

  describe('Milestone Metadata', () => {
    it('should store and retrieve milestone metadata', async () => {
      const metadata = {
        _taxonomyId: 3,
        goalIds: ['g1', 'g2', 'g3'],
        isCompleted: false,
        completedAt: null,
      };

      const post = await createPost(schemaName, 'Project milestone', metadata);
      const retrieved = await getPost(schemaName, post.id);

      expect(retrieved?.metadata.goalIds).toEqual(['g1', 'g2', 'g3']);
      expect(retrieved?.metadata.isCompleted).toBe(false);
      expect(retrieved?.metadata.completedAt).toBeNull();
    });

    it('should mark milestone as completed with timestamp', async () => {
      const completedAt = new Date().toISOString();
      const post = await createPost(schemaName, 'Milestone to complete', {
        _taxonomyId: 3,
        ...defaultMilestoneMetadata,
      });

      const updated = await updatePost(schemaName, post.id, {
        metadata: {
          _taxonomyId: 3,
          goalIds: [],
          isCompleted: true,
          completedAt,
        },
      });

      expect(updated.metadata.isCompleted).toBe(true);
      expect(updated.metadata.completedAt).toBe(completedAt);
    });
  });

  describe('Event Metadata', () => {
    it('should store and retrieve event metadata', async () => {
      const metadata = {
        _taxonomyId: 4,
        startDate: '2025-03-15',
        startTime: '14:00',
        endDate: '2025-03-15',
        endTime: '16:00',
        location: 'Conference Room A',
        address: '123 Main St',
        phone: '555-0123',
        notes: 'Bring presentation materials',
      };

      const post = await createPost(schemaName, 'Team meeting event', metadata);
      const retrieved = await getPost(schemaName, post.id);

      expect(retrieved?.metadata.startDate).toBe('2025-03-15');
      expect(retrieved?.metadata.startTime).toBe('14:00');
      expect(retrieved?.metadata.location).toBe('Conference Room A');
      expect(retrieved?.metadata.notes).toBe('Bring presentation materials');
    });

    it('should handle event with empty optional fields', async () => {
      const metadata = {
        _taxonomyId: 4,
        startDate: '2025-04-01',
        startTime: '10:00',
        endDate: null,
        endTime: '',
        location: '',
        address: '',
        phone: '',
        notes: '',
      };

      const post = await createPost(schemaName, 'Simple event', metadata);
      const retrieved = await getPost(schemaName, post.id);

      expect(retrieved?.metadata.endDate).toBeNull();
      expect(retrieved?.metadata.location).toBe('');
    });
  });

  describe('Meeting Metadata', () => {
    it('should store and retrieve meeting metadata with topic and attendees', async () => {
      const metadata = {
        _taxonomyId: 5,
        topic: 'Q1 Planning',
        attendees: 'Alice, Bob, Charlie',
        startDate: '2025-01-15',
        startTime: '09:00',
        endDate: '2025-01-15',
        endTime: '10:30',
        location: 'Zoom',
        address: '',
        phone: '',
        notes: 'Quarterly review',
      };

      const post = await createPost(schemaName, 'Planning meeting', metadata);
      const retrieved = await getPost(schemaName, post.id);

      expect(retrieved?.metadata.topic).toBe('Q1 Planning');
      expect(retrieved?.metadata.attendees).toBe('Alice, Bob, Charlie');
    });
  });

  describe('Symptom Metadata', () => {
    it('should store and retrieve symptom metadata', async () => {
      const metadata = {
        _taxonomyId: 6,
        severity: 7,
        occurredAt: '2025-02-20T14:30:00Z',
        duration: 45,
        notes: 'After lunch',
      };

      const post = await createPost(schemaName, 'Headache symptom', metadata);
      const retrieved = await getPost(schemaName, post.id);

      expect(retrieved?.metadata.severity).toBe(7);
      expect(retrieved?.metadata.duration).toBe(45);
    });

    it('should store symptom with minimum severity', async () => {
      const metadata = {
        _taxonomyId: 6,
        severity: 1,
        occurredAt: null,
        duration: null,
        notes: '',
      };

      const post = await createPost(schemaName, 'Mild symptom', metadata);
      const retrieved = await getPost(schemaName, post.id);

      expect(retrieved?.metadata.severity).toBe(1);
    });

    it('should store symptom with maximum severity', async () => {
      const metadata = {
        _taxonomyId: 6,
        severity: 10,
        occurredAt: null,
        duration: 120,
        notes: 'Severe episode',
      };

      const post = await createPost(schemaName, 'Severe symptom', metadata);
      const retrieved = await getPost(schemaName, post.id);

      expect(retrieved?.metadata.severity).toBe(10);
    });
  });

  describe('Food Metadata', () => {
    it('should store and retrieve food metadata', async () => {
      const metadata = {
        _taxonomyId: 7,
        mealType: 'dinner',
        consumedAt: '2025-02-20T19:00:00Z',
        ingredients: 'chicken, rice, vegetables',
        calories: 650,
        notes: 'Home cooked',
      };

      const post = await createPost(schemaName, 'Chicken dinner', metadata);
      const retrieved = await getPost(schemaName, post.id);

      expect(retrieved?.metadata.mealType).toBe('dinner');
      expect(retrieved?.metadata.calories).toBe(650);
      expect(retrieved?.metadata.ingredients).toBe('chicken, rice, vegetables');
    });

    it('should handle all meal types', async () => {
      const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

      for (const mealType of mealTypes) {
        const post = await createPost(schemaName, `${mealType} entry`, {
          _taxonomyId: 7,
          mealType,
          consumedAt: null,
          ingredients: '',
          calories: null,
          notes: '',
        });

        const retrieved = await getPost(schemaName, post.id);
        expect(retrieved?.metadata.mealType).toBe(mealType);
      }
    });
  });

  describe('Medication Metadata', () => {
    it('should store and retrieve medication metadata', async () => {
      const metadata = {
        _taxonomyId: 8,
        dosage: '10mg',
        frequency: 'twice_daily',
        scheduleTimes: ['08:00', '20:00'],
        isActive: true,
        notes: 'Take with food',
        startDate: '2025-01-01',
      };

      const post = await createPost(schemaName, 'Blood pressure med', metadata);
      const retrieved = await getPost(schemaName, post.id);

      expect(retrieved?.metadata.dosage).toBe('10mg');
      expect(retrieved?.metadata.frequency).toBe('twice_daily');
      expect(retrieved?.metadata.scheduleTimes).toEqual(['08:00', '20:00']);
      expect(retrieved?.metadata.isActive).toBe(true);
    });

    it('should handle medication with custom schedule', async () => {
      const metadata = {
        _taxonomyId: 8,
        dosage: '5mg',
        frequency: 'custom',
        scheduleTimes: ['06:00', '12:00', '18:00', '22:00'],
        isActive: true,
        notes: '',
        startDate: null,
      };

      const post = await createPost(schemaName, 'Custom schedule med', metadata);
      const retrieved = await getPost(schemaName, post.id);

      expect(retrieved?.metadata.scheduleTimes).toHaveLength(4);
    });

    it('should update medication active status', async () => {
      const post = await createPost(schemaName, 'Med to deactivate', {
        _taxonomyId: 8,
        ...defaultMedicationMetadata,
        isActive: true,
      });

      const updated = await updatePost(schemaName, post.id, {
        metadata: {
          ...post.metadata,
          isActive: false,
        },
      });

      expect(updated.metadata.isActive).toBe(false);
    });
  });

  describe('Exercise Metadata', () => {
    it('should store and retrieve exercise metadata', async () => {
      const metadata = {
        _taxonomyId: 9,
        type: 'running',
        otherType: '',
        duration: 45,
        intensity: 'high',
        distance: 5.5,
        distanceUnit: 'km',
        calories: 450,
        performedAt: '2025-02-20T07:00:00Z',
        notes: 'Morning run',
      };

      const post = await createPost(schemaName, 'Morning jog', metadata);
      const retrieved = await getPost(schemaName, post.id);

      expect(retrieved?.metadata.type).toBe('running');
      expect(retrieved?.metadata.duration).toBe(45);
      expect(retrieved?.metadata.distance).toBe(5.5);
      expect(retrieved?.metadata.distanceUnit).toBe('km');
    });

    it('should handle all exercise types', async () => {
      const exerciseTypes = [
        'yoga',
        'cardio',
        'strength',
        'swimming',
        'running',
        'cycling',
        'walking',
        'hiking',
        'other',
      ];

      for (const type of exerciseTypes) {
        const post = await createPost(schemaName, `${type} workout`, {
          _taxonomyId: 9,
          type,
          otherType: type === 'other' ? 'Rock climbing' : '',
          duration: 30,
          intensity: 'medium',
          distance: null,
          distanceUnit: 'miles',
          calories: null,
          performedAt: null,
          notes: '',
        });

        const retrieved = await getPost(schemaName, post.id);
        expect(retrieved?.metadata.type).toBe(type);

        if (type === 'other') {
          expect(retrieved?.metadata.otherType).toBe('Rock climbing');
        }
      }
    });

    it('should handle exercise with miles unit', async () => {
      const metadata = {
        _taxonomyId: 9,
        type: 'cycling',
        otherType: '',
        duration: 60,
        intensity: 'medium',
        distance: 15,
        distanceUnit: 'miles',
        calories: 500,
        performedAt: null,
        notes: '',
      };

      const post = await createPost(schemaName, 'Bike ride', metadata);
      const retrieved = await getPost(schemaName, post.id);

      expect(retrieved?.metadata.distanceUnit).toBe('miles');
      expect(retrieved?.metadata.distance).toBe(15);
    });
  });

  describe('Delete Posts with Metadata', () => {
    it('should delete post with task metadata', async () => {
      const post = await createPost(schemaName, 'Task to delete', {
        _taxonomyId: 1,
        ...defaultTaskMetadata,
      });

      await deletePost(schemaName, post.id);
      const retrieved = await getPost(schemaName, post.id);

      expect(retrieved).toBeNull();
    });

    it('should delete post with complex nested metadata', async () => {
      const post = await createPost(schemaName, 'Complex to delete', {
        _taxonomyId: 8,
        dosage: '10mg',
        frequency: 'twice_daily',
        scheduleTimes: ['08:00', '20:00'],
        isActive: true,
        notes: 'Test',
        startDate: '2025-01-01',
      });

      await deletePost(schemaName, post.id);
      const retrieved = await getPost(schemaName, post.id);

      expect(retrieved).toBeNull();
    });
  });

  describe('Taxonomy ID Storage', () => {
    it('should store and retrieve _taxonomyId correctly', async () => {
      const post = await createPost(schemaName, 'Post with taxonomy', {
        _taxonomyId: 42,
        someField: 'value',
      });

      const retrieved = await getPost(schemaName, post.id);
      expect(retrieved?.metadata._taxonomyId).toBe(42);
    });

    it('should find posts by taxonomy ID', async () => {
      const taxonomyId = 999;
      await createPost(schemaName, 'Post 1', { _taxonomyId: taxonomyId });
      await createPost(schemaName, 'Post 2', { _taxonomyId: taxonomyId });
      await createPost(schemaName, 'Post 3', { _taxonomyId: 1000 });

      const results = await findPostsByMetadata(schemaName, '_taxonomyId', taxonomyId);

      expect(results.length).toBe(2);
      expect(results.every((p) => p.metadata._taxonomyId === taxonomyId)).toBe(true);
    });

    it('should update taxonomy ID on post', async () => {
      const post = await createPost(schemaName, 'Change taxonomy', {
        _taxonomyId: 1,
        isCompleted: false,
      });

      const updated = await updatePost(schemaName, post.id, {
        metadata: {
          _taxonomyId: 2,
          type: 'short_term',
          status: 'active',
          targetDate: null,
        },
      });

      expect(updated.metadata._taxonomyId).toBe(2);
      expect(updated.metadata.type).toBe('short_term');
    });

    it('should clear taxonomy by not including _taxonomyId', async () => {
      const post = await createPost(schemaName, 'Remove taxonomy', {
        _taxonomyId: 1,
        isCompleted: true,
      });

      const updated = await updatePost(schemaName, post.id, {
        metadata: {
          customField: 'value',
        },
      });

      expect(updated.metadata._taxonomyId).toBeUndefined();
      expect(updated.metadata.customField).toBe('value');
    });
  });

  describe('Mixed Metadata', () => {
    it('should store specialized metadata alongside custom fields', async () => {
      const metadata = {
        _taxonomyId: 1,
        isCompleted: true,
        isInProgress: false,
        isAutoMigrating: false,
        milestoneIds: [],
        customTag: 'important',
        priority: 'high',
      };

      const post = await createPost(schemaName, 'Mixed metadata post', metadata);
      const retrieved = await getPost(schemaName, post.id);

      expect(retrieved?.metadata.isCompleted).toBe(true);
      expect(retrieved?.metadata.customTag).toBe('important');
      expect(retrieved?.metadata.priority).toBe('high');
    });
  });
});
