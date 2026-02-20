import { prisma } from '../prisma';
import crypto from 'crypto';

// =============================================================================
// Tenant Schema Manager
// =============================================================================
// Handles creation and management of tenant-specific database schemas
// Each tenant gets their own isolated PostgreSQL schema with tables for:
// - settings, taxonomies, posts, and post_taxonomies

/**
 * Generates a unique schema name using a random prefix and atomic counter
 * Format: usr_{counter}_{randomHex}
 */
async function generateSchemaName(): Promise<string> {
  const randomSuffix = crypto.randomBytes(3).toString('hex'); // 6 chars

  // Ensure schema_counter has an entry and atomically increment
  const result = await prisma.$executeRaw`
    INSERT INTO schema_counter (id, current_number, updated_at)
    VALUES (1, 1, NOW())
    ON CONFLICT (id) DO UPDATE
    SET current_number = schema_counter.current_number + 1, updated_at = NOW()
    RETURNING current_number
  `;

  // Fetch the current number after increment
  const counter = await prisma.schemaCounter.findUnique({
    where: { id: 1 },
  });

  const currentNumber = counter?.currentNumber || 1;
  return `usr_${currentNumber}_${randomSuffix}`;
}

/**
 * Generates the SQL for creating a tenant's schema and all associated tables
 */
function generateTenantSchemaSQL(schemaName: string): string {
  // Escape schema name to prevent SQL injection
  const escapedSchema = schemaName.replace(/[^a-z0-9_]/gi, '');

  return `
-- =============================================================================
-- Tenant Schema: ${escapedSchema}
-- =============================================================================

-- Create the isolated schema
CREATE SCHEMA ${escapedSchema};

-- 1. Tenant Settings (key-value store with JSONB)
CREATE TABLE ${escapedSchema}.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Taxonomies (Categories/Tags with icon and color)
CREATE TABLE ${escapedSchema}.taxonomies (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    icon TEXT,
    color VARCHAR(7)
);

-- 3. Posts Table (main content storage)
-- Task IDs and other metadata stored in the 'metadata' JSONB column
CREATE TABLE ${escapedSchema}.posts (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Post-Taxonomy Relationships (many-to-many)
CREATE TABLE ${escapedSchema}.post_taxonomies (
    post_id INTEGER REFERENCES ${escapedSchema}.posts(id) ON DELETE CASCADE,
    tax_id INTEGER REFERENCES ${escapedSchema}.taxonomies(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tax_id)
);

-- 5. Performance Index for metadata queries
-- Makes Task-to-Goal link (via ID array) instant
CREATE INDEX idx_${escapedSchema}_posts_meta ON ${escapedSchema}.posts USING GIN (metadata);
  `.trim();
}

/**
 * Creates a new tenant schema in the database
 * Executes the generated SQL to create schema and all tables
 */
async function createTenantSchema(schemaName: string): Promise<void> {
  const sql = generateTenantSchemaSQL(schemaName);

  // Execute the schema creation SQL
  await prisma.$executeRawUnsafe(sql);
}

/**
 * Drops a tenant schema and all its contents
 * USE WITH CAUTION - this permanently deletes all tenant data
 */
async function dropTenantSchema(schemaName: string): Promise<void> {
  // Escape schema name to prevent SQL injection
  const escapedSchema = schemaName.replace(/[^a-z0-9_]/gi, '');

  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS ${escapedSchema} CASCADE`);
}

/**
 * Checks if a tenant schema exists
 */
async function tenantSchemaExists(schemaName: string): Promise<boolean> {
  const escapedSchema = schemaName.replace(/[^a-z0-9_]/gi, '');

  const result = await prisma.$queryRaw<{ exists: boolean }[]>`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.schemata
      WHERE schema_name = ${escapedSchema}
    ) as exists
  `;

  return result[0]?.exists || false;
}

/**
 * Registers a new account and creates their tenant schema
 * This is the main entry point for user signup
 */
export async function registerTenant(email: string): Promise<{
  account: {
    id: number;
    userId: string;
    email: string;
    tenantSchemaName: string;
    createdAt: Date;
  };
  schemaName: string;
}> {
  // Generate unique schema name
  const schemaName = await generateSchemaName();

  // Create the account record
  const account = await prisma.account.create({
    data: {
      email,
      tenantSchemaName: schemaName,
    },
  });

  // Create the tenant's isolated schema with all tables
  await createTenantSchema(schemaName);

  return {
    account,
    schemaName,
  };
}

/**
 * Deletes a tenant account and their schema
 * USE WITH CAUTION - this permanently deletes all user data
 */
export async function deleteTenant(userId: string): Promise<void> {
  // Find the account
  const account = await prisma.account.findUnique({
    where: { userId },
  });

  if (!account) {
    throw new Error(`Account not found for userId: ${userId}`);
  }

  // Drop the tenant schema first
  await dropTenantSchema(account.tenantSchemaName);

  // Delete the account record
  await prisma.account.delete({
    where: { userId },
  });
}

/**
 * Gets the schema name for a user
 */
export async function getTenantSchema(userId: string): Promise<string | null> {
  const account = await prisma.account.findUnique({
    where: { userId },
    select: { tenantSchemaName: true },
  });

  return account?.tenantSchemaName || null;
}

/**
 * Gets the schema name by email
 */
export async function getTenantSchemaByEmail(email: string): Promise<string | null> {
  const account = await prisma.account.findUnique({
    where: { email },
    select: { tenantSchemaName: true },
  });

  return account?.tenantSchemaName || null;
}

export {
  generateSchemaName,
  generateTenantSchemaSQL,
  createTenantSchema,
  dropTenantSchema,
  tenantSchemaExists,
};
