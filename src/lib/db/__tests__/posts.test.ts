import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  setupTestSchema,
  teardownTestSchema,
} from './setup';
import {
  createPost,
  getPost,
  getAllPosts,
  updatePost,
  deletePost,
  findPostsByMetadata,
  findPostsWithMetadataKey,
} from '../tenantQueries';

describe('Posts CRUD Operations', () => {
  let schemaName: string;

  beforeAll(async () => {
    schemaName = await setupTestSchema();
  });

  afterAll(async () => {
    await teardownTestSchema();
  });

  describe('createPost', () => {
    it('should create a post with just content', async () => {
      const result = await createPost(schemaName, 'Hello World');

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.content).toBe('Hello World');
      expect(result.metadata).toEqual({});
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should create a post with metadata', async () => {
      const metadata = {
        featured: true,
        category: 'tech',
        tags: ['javascript', 'typescript'],
      };

      const result = await createPost(schemaName, 'Post with metadata', metadata);

      expect(result.content).toBe('Post with metadata');
      expect(result.metadata).toEqual(metadata);
    });

    it('should create a post with complex nested metadata', async () => {
      const metadata = {
        author: {
          name: 'John Doe',
          email: 'john@example.com',
        },
        stats: {
          views: 0,
          likes: 0,
        },
        taskIds: [1, 2, 3],
      };

      const result = await createPost(schemaName, 'Complex post', metadata);

      expect(result.metadata).toEqual(metadata);
    });
  });

  describe('getPost', () => {
    it('should retrieve an existing post by ID', async () => {
      const created = await createPost(schemaName, 'Get test post', {
        test: true,
      });

      const result = await getPost(schemaName, created.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(created.id);
      expect(result?.content).toBe('Get test post');
      expect(result?.metadata).toEqual({ test: true });
    });

    it('should return null for non-existent ID', async () => {
      const result = await getPost(schemaName, 99999);

      expect(result).toBeNull();
    });
  });

  describe('getAllPosts', () => {
    it('should retrieve posts ordered by created_at DESC', async () => {
      // Create posts with slight delay to ensure ordering
      const first = await createPost(schemaName, 'First post');
      const second = await createPost(schemaName, 'Second post');

      const results = await getAllPosts(schemaName);

      // Most recent should be first
      const secondIndex = results.findIndex((p) => p.id === second.id);
      const firstIndex = results.findIndex((p) => p.id === first.id);

      expect(secondIndex).toBeLessThan(firstIndex);
    });

    it('should respect limit option', async () => {
      // Create multiple posts
      await createPost(schemaName, 'Limit test 1');
      await createPost(schemaName, 'Limit test 2');
      await createPost(schemaName, 'Limit test 3');

      const results = await getAllPosts(schemaName, { limit: 2 });

      expect(results.length).toBe(2);
    });

    it('should respect offset option', async () => {
      // Create posts
      const posts = [];
      for (let i = 0; i < 5; i++) {
        posts.push(await createPost(schemaName, `Offset test ${i}`));
      }

      // Use a high limit to capture all posts in the schema
      const allResults = await getAllPosts(schemaName, { limit: 100 });
      const offsetResults = await getAllPosts(schemaName, { limit: 100, offset: 2 });

      expect(offsetResults.length).toBe(allResults.length - 2);
    });
  });

  describe('updatePost', () => {
    it('should update post content', async () => {
      const created = await createPost(schemaName, 'Original content');

      const updated = await updatePost(schemaName, created.id, {
        content: 'Updated content',
      });

      expect(updated.id).toBe(created.id);
      expect(updated.content).toBe('Updated content');
    });

    it('should update post metadata', async () => {
      const created = await createPost(schemaName, 'Meta test', {
        version: 1,
      });

      const updated = await updatePost(schemaName, created.id, {
        metadata: { version: 2, edited: true },
      });

      expect(updated.metadata).toEqual({ version: 2, edited: true });
    });

    it('should update both content and metadata', async () => {
      const created = await createPost(schemaName, 'Both test', {
        initial: true,
      });

      const updated = await updatePost(schemaName, created.id, {
        content: 'Both updated',
        metadata: { initial: false, updated: true },
      });

      expect(updated.content).toBe('Both updated');
      expect(updated.metadata).toEqual({ initial: false, updated: true });
    });
  });

  describe('deletePost', () => {
    it('should delete an existing post', async () => {
      const created = await createPost(schemaName, 'To be deleted');

      // Verify it exists
      let result = await getPost(schemaName, created.id);
      expect(result).not.toBeNull();

      // Delete it
      await deletePost(schemaName, created.id);

      // Verify it's gone
      result = await getPost(schemaName, created.id);
      expect(result).toBeNull();
    });

    it('should not throw when deleting non-existent post', async () => {
      await expect(
        deletePost(schemaName, 99999)
      ).resolves.not.toThrow();
    });
  });

  describe('Metadata Search (GIN index)', () => {
    describe('findPostsByMetadata', () => {
      it('should find posts by metadata key-value pair', async () => {
        await createPost(schemaName, 'Featured post', { featured: true });
        await createPost(schemaName, 'Normal post', { featured: false });

        const results = await findPostsByMetadata(schemaName, 'featured', true);

        expect(results.length).toBeGreaterThanOrEqual(1);
        expect(results.every((p) => (p.metadata as any).featured === true)).toBe(true);
      });

      it('should find posts with string metadata values', async () => {
        await createPost(schemaName, 'Tech post', { category: 'technology' });
        await createPost(schemaName, 'Art post', { category: 'art' });

        const results = await findPostsByMetadata(schemaName, 'category', 'technology');

        expect(results.length).toBeGreaterThanOrEqual(1);
        expect(results.every((p) => (p.metadata as any).category === 'technology')).toBe(true);
      });
    });

    describe('findPostsWithMetadataKey', () => {
      it('should find posts that have a specific metadata key', async () => {
        await createPost(schemaName, 'Has priority', { priority: 'high' });
        await createPost(schemaName, 'No priority', { other: 'value' });

        const results = await findPostsWithMetadataKey(schemaName, 'priority');

        expect(results.length).toBeGreaterThanOrEqual(1);
        expect(results.every((p) => 'priority' in (p.metadata as object))).toBe(true);
      });
    });
  });
});
