import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  setupTestSchema,
  teardownTestSchema,
} from './setup';
import {
  createPost,
  createTaxonomy,
  addTaxonomyToPost,
  removeTaxonomyFromPost,
  getPostTaxonomies,
  getPostsByTaxonomy,
  getPostWithTaxonomies,
  deletePost,
  deleteTaxonomy,
} from '../tenantQueries';

describe('Post-Taxonomy Relationship Operations', () => {
  let schemaName: string;

  beforeAll(async () => {
    schemaName = await setupTestSchema();
  });

  afterAll(async () => {
    await teardownTestSchema();
  });

  describe('addTaxonomyToPost', () => {
    it('should link a taxonomy to a post', async () => {
      const post = await createPost(schemaName, 'Linked post');
      const taxonomy = await createTaxonomy(schemaName, 'LinkedTag');

      await addTaxonomyToPost(schemaName, post.id, taxonomy.id);

      const taxonomies = await getPostTaxonomies(schemaName, post.id);
      expect(taxonomies.length).toBe(1);
      expect(taxonomies[0].id).toBe(taxonomy.id);
    });

    it('should allow multiple taxonomies on one post', async () => {
      const post = await createPost(schemaName, 'Multi-tag post');
      const tax1 = await createTaxonomy(schemaName, 'Tag1');
      const tax2 = await createTaxonomy(schemaName, 'Tag2');
      const tax3 = await createTaxonomy(schemaName, 'Tag3');

      await addTaxonomyToPost(schemaName, post.id, tax1.id);
      await addTaxonomyToPost(schemaName, post.id, tax2.id);
      await addTaxonomyToPost(schemaName, post.id, tax3.id);

      const taxonomies = await getPostTaxonomies(schemaName, post.id);
      expect(taxonomies.length).toBe(3);
    });

    it('should not duplicate taxonomy links (idempotent)', async () => {
      const post = await createPost(schemaName, 'Idempotent test');
      const taxonomy = await createTaxonomy(schemaName, 'IdempotentTag');

      await addTaxonomyToPost(schemaName, post.id, taxonomy.id);
      await addTaxonomyToPost(schemaName, post.id, taxonomy.id); // Add again

      const taxonomies = await getPostTaxonomies(schemaName, post.id);
      expect(taxonomies.length).toBe(1);
    });
  });

  describe('removeTaxonomyFromPost', () => {
    it('should unlink a taxonomy from a post', async () => {
      const post = await createPost(schemaName, 'Unlink test');
      const taxonomy = await createTaxonomy(schemaName, 'UnlinkTag');

      await addTaxonomyToPost(schemaName, post.id, taxonomy.id);

      // Verify link exists
      let taxonomies = await getPostTaxonomies(schemaName, post.id);
      expect(taxonomies.length).toBe(1);

      // Remove the link
      await removeTaxonomyFromPost(schemaName, post.id, taxonomy.id);

      // Verify link is gone
      taxonomies = await getPostTaxonomies(schemaName, post.id);
      expect(taxonomies.length).toBe(0);
    });

    it('should not throw when removing non-existent link', async () => {
      const post = await createPost(schemaName, 'No link test');
      const taxonomy = await createTaxonomy(schemaName, 'NoLinkTag');

      await expect(
        removeTaxonomyFromPost(schemaName, post.id, taxonomy.id)
      ).resolves.not.toThrow();
    });
  });

  describe('getPostTaxonomies', () => {
    it('should return taxonomies ordered by name', async () => {
      const post = await createPost(schemaName, 'Ordered tags test');
      const taxZ = await createTaxonomy(schemaName, 'ZTag');
      const taxA = await createTaxonomy(schemaName, 'ATag');
      const taxM = await createTaxonomy(schemaName, 'MTag');

      await addTaxonomyToPost(schemaName, post.id, taxZ.id);
      await addTaxonomyToPost(schemaName, post.id, taxA.id);
      await addTaxonomyToPost(schemaName, post.id, taxM.id);

      const taxonomies = await getPostTaxonomies(schemaName, post.id);

      expect(taxonomies[0].name).toBe('ATag');
      expect(taxonomies[1].name).toBe('MTag');
      expect(taxonomies[2].name).toBe('ZTag');
    });

    it('should return empty array for post with no taxonomies', async () => {
      const post = await createPost(schemaName, 'No tags');

      const taxonomies = await getPostTaxonomies(schemaName, post.id);

      expect(taxonomies).toEqual([]);
    });

    it('should include taxonomy icon and color', async () => {
      const post = await createPost(schemaName, 'Styled tags');
      const taxonomy = await createTaxonomy(schemaName, 'StyledTag', {
        icon: '🏷️',
        color: '#FF0000',
      });

      await addTaxonomyToPost(schemaName, post.id, taxonomy.id);

      const taxonomies = await getPostTaxonomies(schemaName, post.id);

      expect(taxonomies[0].icon).toBe('🏷️');
      expect(taxonomies[0].color).toBe('#FF0000');
    });
  });

  describe('getPostsByTaxonomy', () => {
    it('should return all posts with a specific taxonomy', async () => {
      const sharedTax = await createTaxonomy(schemaName, 'SharedCategory');

      const post1 = await createPost(schemaName, 'Category post 1');
      const post2 = await createPost(schemaName, 'Category post 2');
      await createPost(schemaName, 'Untagged post'); // Not linked

      await addTaxonomyToPost(schemaName, post1.id, sharedTax.id);
      await addTaxonomyToPost(schemaName, post2.id, sharedTax.id);

      const posts = await getPostsByTaxonomy(schemaName, sharedTax.id);

      expect(posts.length).toBe(2);
      expect(posts.some((p) => p.id === post1.id)).toBe(true);
      expect(posts.some((p) => p.id === post2.id)).toBe(true);
    });

    it('should return posts ordered by created_at DESC', async () => {
      const taxonomy = await createTaxonomy(schemaName, 'OrderedCategory');

      const first = await createPost(schemaName, 'First created');
      const second = await createPost(schemaName, 'Second created');

      await addTaxonomyToPost(schemaName, first.id, taxonomy.id);
      await addTaxonomyToPost(schemaName, second.id, taxonomy.id);

      const posts = await getPostsByTaxonomy(schemaName, taxonomy.id);

      // Most recent should be first
      expect(posts[0].id).toBe(second.id);
      expect(posts[1].id).toBe(first.id);
    });

    it('should return empty array for taxonomy with no posts', async () => {
      const taxonomy = await createTaxonomy(schemaName, 'EmptyCategory');

      const posts = await getPostsByTaxonomy(schemaName, taxonomy.id);

      expect(posts).toEqual([]);
    });
  });

  describe('getPostWithTaxonomies', () => {
    it('should return post with all its taxonomies', async () => {
      const post = await createPost(schemaName, 'Full post test', {
        key: 'value',
      });
      const tax1 = await createTaxonomy(schemaName, 'FullTag1');
      const tax2 = await createTaxonomy(schemaName, 'FullTag2');

      await addTaxonomyToPost(schemaName, post.id, tax1.id);
      await addTaxonomyToPost(schemaName, post.id, tax2.id);

      const result = await getPostWithTaxonomies(schemaName, post.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(post.id);
      expect(result?.content).toBe('Full post test');
      expect(result?.metadata).toEqual({ key: 'value' });
      expect(result?.taxonomies.length).toBe(2);
    });

    it('should return null for non-existent post', async () => {
      const result = await getPostWithTaxonomies(schemaName, 99999);

      expect(result).toBeNull();
    });
  });

  describe('Cascade Delete', () => {
    it('should remove relationships when post is deleted', async () => {
      const post = await createPost(schemaName, 'Cascade delete post');
      const taxonomy = await createTaxonomy(schemaName, 'CascadeTag');

      await addTaxonomyToPost(schemaName, post.id, taxonomy.id);

      // Verify relationship exists
      let posts = await getPostsByTaxonomy(schemaName, taxonomy.id);
      expect(posts.length).toBe(1);

      // Delete the post
      await deletePost(schemaName, post.id);

      // Relationship should be gone
      posts = await getPostsByTaxonomy(schemaName, taxonomy.id);
      expect(posts.length).toBe(0);
    });

    it('should remove relationships when taxonomy is deleted', async () => {
      const post = await createPost(schemaName, 'Cascade delete tax');
      const taxonomy = await createTaxonomy(schemaName, 'DeletedTag');

      await addTaxonomyToPost(schemaName, post.id, taxonomy.id);

      // Verify relationship exists
      let taxonomies = await getPostTaxonomies(schemaName, post.id);
      expect(taxonomies.length).toBe(1);

      // Delete the taxonomy
      await deleteTaxonomy(schemaName, taxonomy.id);

      // Relationship should be gone
      taxonomies = await getPostTaxonomies(schemaName, post.id);
      expect(taxonomies.length).toBe(0);
    });
  });
});
