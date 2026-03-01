import { prisma } from '../prisma';

// =============================================================================
// Tenant Query Helpers
// =============================================================================
// Provides type-safe query functions for tenant-specific tables
// All queries are scoped to a specific tenant's schema

// -----------------------------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------------------------

export interface Setting {
  key: string;
  value: unknown;
  updatedAt: Date;
}

export interface Taxonomy {
  id: number;
  name: string;
  icon: string | null;
  color: string | null;
}

export interface Post {
  id: number;
  content: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

// Post with encrypted fields (from database)
export interface PostWithEncryption {
  id: number;
  content: string | null;
  metadata: Record<string, unknown> | null;
  contentEncrypted: Buffer | null;
  contentIv: Buffer | null;
  metadataEncrypted: Buffer | null;
  metadataIv: Buffer | null;
  isEncrypted: boolean;
  createdAt: Date;
}

// Serialized version for client components (Buffer -> base64 string)
export interface SerializedPostWithEncryption {
  id: number;
  content: string | null;
  metadata: Record<string, unknown> | null;
  contentEncrypted: string | null;
  contentIv: string | null;
  metadataEncrypted: string | null;
  metadataIv: string | null;
  isEncrypted: boolean;
  createdAt: Date;
}

// Display-ready post type for components (works with both Post and SerializedPostWithEncryption)
export interface DisplayPost {
  id: number;
  content: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

export interface PostWithTaxonomies extends Post {
  taxonomies: Taxonomy[];
}

// -----------------------------------------------------------------------------
// Helper: Escape schema name
// -----------------------------------------------------------------------------

function escapeSchema(schemaName: string): string {
  return schemaName.replace(/[^a-z0-9_]/gi, '');
}

// =============================================================================
// Settings Operations
// =============================================================================

export async function getSetting(
  schemaName: string,
  key: string
): Promise<Setting | null> {
  const schema = escapeSchema(schemaName);
  const result = await prisma.$queryRawUnsafe<Setting[]>(
    `SELECT key, value, updated_at as "updatedAt" FROM ${schema}.settings WHERE key = $1`,
    key
  );
  return result[0] || null;
}

export async function getAllSettings(schemaName: string): Promise<Setting[]> {
  const schema = escapeSchema(schemaName);
  return prisma.$queryRawUnsafe<Setting[]>(
    `SELECT key, value, updated_at as "updatedAt" FROM ${schema}.settings ORDER BY key`
  );
}

export async function upsertSetting(
  schemaName: string,
  key: string,
  value: unknown
): Promise<Setting> {
  const schema = escapeSchema(schemaName);
  const result = await prisma.$queryRawUnsafe<Setting[]>(
    `INSERT INTO ${schema}.settings (key, value, updated_at)
     VALUES ($1, $2::jsonb, NOW())
     ON CONFLICT (key) DO UPDATE SET value = $2::jsonb, updated_at = NOW()
     RETURNING key, value, updated_at as "updatedAt"`,
    key,
    JSON.stringify(value)
  );
  return result[0];
}

export async function deleteSetting(
  schemaName: string,
  key: string
): Promise<void> {
  const schema = escapeSchema(schemaName);
  await prisma.$executeRawUnsafe(
    `DELETE FROM ${schema}.settings WHERE key = $1`,
    key
  );
}

// =============================================================================
// Taxonomy Operations
// =============================================================================

export async function createTaxonomy(
  schemaName: string,
  name: string,
  options?: { icon?: string; color?: string }
): Promise<Taxonomy> {
  const schema = escapeSchema(schemaName);

  const result = await prisma.$queryRawUnsafe<Taxonomy[]>(
    `INSERT INTO ${schema}.taxonomies (name, icon, color)
     VALUES ($1, $2, $3)
     RETURNING id, name, icon, color`,
    name,
    options?.icon ?? null,
    options?.color ?? null
  );
  return result[0];
}

export async function getTaxonomy(
  schemaName: string,
  id: number
): Promise<Taxonomy | null> {
  const schema = escapeSchema(schemaName);
  const result = await prisma.$queryRawUnsafe<Taxonomy[]>(
    `SELECT id, name, icon, color FROM ${schema}.taxonomies WHERE id = $1`,
    id
  );
  return result[0] || null;
}

export async function getAllTaxonomies(schemaName: string): Promise<Taxonomy[]> {
  const schema = escapeSchema(schemaName);
  return prisma.$queryRawUnsafe<Taxonomy[]>(
    `SELECT id, name, icon, color FROM ${schema}.taxonomies ORDER BY name`
  );
}

export async function updateTaxonomy(
  schemaName: string,
  id: number,
  updates: { name?: string; icon?: string; color?: string }
): Promise<Taxonomy> {
  const schema = escapeSchema(schemaName);

  const setClauses: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (updates.name !== undefined) {
    setClauses.push(`name = $${paramIndex++}`);
    values.push(updates.name);
  }

  if (updates.icon !== undefined) {
    setClauses.push(`icon = $${paramIndex++}`);
    values.push(updates.icon);
  }

  if (updates.color !== undefined) {
    setClauses.push(`color = $${paramIndex++}`);
    values.push(updates.color);
  }

  values.push(id);

  const result = await prisma.$queryRawUnsafe<Taxonomy[]>(
    `UPDATE ${schema}.taxonomies SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING id, name, icon, color`,
    ...values
  );
  return result[0];
}

export async function deleteTaxonomy(
  schemaName: string,
  id: number
): Promise<void> {
  const schema = escapeSchema(schemaName);
  await prisma.$executeRawUnsafe(
    `DELETE FROM ${schema}.taxonomies WHERE id = $1`,
    id
  );
}

// =============================================================================
// Post Operations
// =============================================================================

export async function createPost(
  schemaName: string,
  content: string,
  metadata: Record<string, unknown> = {}
): Promise<Post> {
  const schema = escapeSchema(schemaName);
  const result = await prisma.$queryRawUnsafe<Post[]>(
    `INSERT INTO ${schema}.posts (content, metadata, is_encrypted)
     VALUES ($1, $2::jsonb, FALSE)
     RETURNING id, content, metadata, created_at as "createdAt"`,
    content,
    JSON.stringify(metadata)
  );
  return result[0];
}

/**
 * Create an encrypted post
 * Content and metadata are stored as encrypted BYTEA
 */
export interface EncryptedPostInput {
  contentEncrypted: Buffer;
  contentIv: Buffer;
  metadataEncrypted: Buffer;
  metadataIv: Buffer;
}

export async function createEncryptedPost(
  schemaName: string,
  encryptedData: EncryptedPostInput
): Promise<PostWithEncryption> {
  const schema = escapeSchema(schemaName);
  const result = await prisma.$queryRawUnsafe<PostWithEncryption[]>(
    `INSERT INTO ${schema}.posts (content_encrypted, content_iv, metadata_encrypted, metadata_iv, is_encrypted)
     VALUES ($1, $2, $3, $4, TRUE)
     RETURNING id, content, metadata, content_encrypted as "contentEncrypted", content_iv as "contentIv", metadata_encrypted as "metadataEncrypted", metadata_iv as "metadataIv", is_encrypted as "isEncrypted", created_at as "createdAt"`,
    encryptedData.contentEncrypted,
    encryptedData.contentIv,
    encryptedData.metadataEncrypted,
    encryptedData.metadataIv
  );
  return result[0];
}

export async function getPost(
  schemaName: string,
  id: number
): Promise<Post | null> {
  const schema = escapeSchema(schemaName);
  const result = await prisma.$queryRawUnsafe<Post[]>(
    `SELECT id, content, metadata, created_at as "createdAt" FROM ${schema}.posts WHERE id = $1`,
    id
  );
  return result[0] || null;
}

export async function getAllPosts(
  schemaName: string,
  options?: { limit?: number; offset?: number }
): Promise<Post[]> {
  const schema = escapeSchema(schemaName);
  const limit = options?.limit || 50;
  const offset = options?.offset || 0;

  return prisma.$queryRawUnsafe<Post[]>(
    `SELECT id, content, metadata, created_at as "createdAt"
     FROM ${schema}.posts
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    limit,
    offset
  );
}

/**
 * Get all posts including encrypted fields
 * Returns both plaintext and encrypted posts
 */
export async function getAllPostsWithEncryption(
  schemaName: string,
  options?: { limit?: number; offset?: number }
): Promise<PostWithEncryption[]> {
  const schema = escapeSchema(schemaName);
  const limit = options?.limit || 50;
  const offset = options?.offset || 0;

  return prisma.$queryRawUnsafe<PostWithEncryption[]>(
    `SELECT id, content, metadata,
            content_encrypted as "contentEncrypted", content_iv as "contentIv",
            metadata_encrypted as "metadataEncrypted", metadata_iv as "metadataIv",
            is_encrypted as "isEncrypted", created_at as "createdAt"
     FROM ${schema}.posts
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    limit,
    offset
  );
}

export async function updatePost(
  schemaName: string,
  id: number,
  updates: { content?: string; metadata?: Record<string, unknown> }
): Promise<Post> {
  const schema = escapeSchema(schemaName);

  const setClauses: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (updates.content !== undefined) {
    setClauses.push(`content = $${paramIndex++}`);
    values.push(updates.content);
  }

  if (updates.metadata !== undefined) {
    setClauses.push(`metadata = $${paramIndex}::jsonb`);
    paramIndex++;
    values.push(JSON.stringify(updates.metadata));
  }

  values.push(id);

  const result = await prisma.$queryRawUnsafe<Post[]>(
    `UPDATE ${schema}.posts SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING id, content, metadata, created_at as "createdAt"`,
    ...values
  );
  return result[0];
}

export async function deletePost(
  schemaName: string,
  id: number
): Promise<void> {
  const schema = escapeSchema(schemaName);
  await prisma.$executeRawUnsafe(
    `DELETE FROM ${schema}.posts WHERE id = $1`,
    id
  );
}

// =============================================================================
// Post-Taxonomy Relationship Operations
// =============================================================================

export async function addTaxonomyToPost(
  schemaName: string,
  postId: number,
  taxonomyId: number
): Promise<void> {
  const schema = escapeSchema(schemaName);
  await prisma.$executeRawUnsafe(
    `INSERT INTO ${schema}.post_taxonomies (post_id, tax_id)
     VALUES ($1, $2)
     ON CONFLICT (post_id, tax_id) DO NOTHING`,
    postId,
    taxonomyId
  );
}

export async function removeTaxonomyFromPost(
  schemaName: string,
  postId: number,
  taxonomyId: number
): Promise<void> {
  const schema = escapeSchema(schemaName);
  await prisma.$executeRawUnsafe(
    `DELETE FROM ${schema}.post_taxonomies WHERE post_id = $1 AND tax_id = $2`,
    postId,
    taxonomyId
  );
}

export async function getPostTaxonomies(
  schemaName: string,
  postId: number
): Promise<Taxonomy[]> {
  const schema = escapeSchema(schemaName);
  return prisma.$queryRawUnsafe<Taxonomy[]>(
    `SELECT t.id, t.name, t.icon, t.color
     FROM ${schema}.taxonomies t
     JOIN ${schema}.post_taxonomies pt ON t.id = pt.tax_id
     WHERE pt.post_id = $1
     ORDER BY t.name`,
    postId
  );
}

export async function getPostsByTaxonomy(
  schemaName: string,
  taxonomyId: number
): Promise<Post[]> {
  const schema = escapeSchema(schemaName);
  return prisma.$queryRawUnsafe<Post[]>(
    `SELECT p.id, p.content, p.metadata, p.created_at as "createdAt"
     FROM ${schema}.posts p
     JOIN ${schema}.post_taxonomies pt ON p.id = pt.post_id
     WHERE pt.tax_id = $1
     ORDER BY p.created_at DESC`,
    taxonomyId
  );
}

export async function getPostWithTaxonomies(
  schemaName: string,
  postId: number
): Promise<PostWithTaxonomies | null> {
  const post = await getPost(schemaName, postId);
  if (!post) return null;

  const taxonomies = await getPostTaxonomies(schemaName, postId);
  return { ...post, taxonomies };
}

// =============================================================================
// Metadata Query Helpers (using GIN index)
// =============================================================================

export async function findPostsByMetadata(
  schemaName: string,
  key: string,
  value: unknown
): Promise<Post[]> {
  const schema = escapeSchema(schemaName);
  return prisma.$queryRawUnsafe<Post[]>(
    `SELECT id, content, metadata, created_at as "createdAt"
     FROM ${schema}.posts
     WHERE metadata @> $1::jsonb
     ORDER BY created_at DESC`,
    JSON.stringify({ [key]: value })
  );
}

export async function findPostsWithMetadataKey(
  schemaName: string,
  key: string
): Promise<Post[]> {
  const schema = escapeSchema(schemaName);
  return prisma.$queryRawUnsafe<Post[]>(
    `SELECT id, content, metadata, created_at as "createdAt"
     FROM ${schema}.posts
     WHERE metadata ? $1
     ORDER BY created_at DESC`,
    key
  );
}
