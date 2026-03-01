import { prisma } from '../prisma';
import crypto from 'crypto';
import { seedDefaultTaxonomies } from '../taxonomies';
import { seedDefaultSettings } from '../settings';

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
 * Escapes a schema name to prevent SQL injection
 * Only allows alphanumeric characters and underscores
 */
function escapeSchemaName(schemaName: string): string {
  return schemaName.replace(/[^a-z0-9_]/gi, '');
}

/**
 * Generates an array of SQL statements for creating a tenant's schema and all tables
 */
function generateTenantSchemaStatements(schemaName: string): string[] {
  const s = escapeSchemaName(schemaName);

  return [
    // Create the isolated schema
    `CREATE SCHEMA ${s}`,

    // Settings table (key-value store with JSONB)
    `CREATE TABLE ${s}.settings (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    // Taxonomies table (categories/tags with icon and color)
    `CREATE TABLE ${s}.taxonomies (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      icon TEXT,
      color VARCHAR(7)
    )`,

    // Posts table (main content storage)
    // Supports both plaintext (content, metadata) and encrypted (content_encrypted, etc.) posts
    `CREATE TABLE ${s}.posts (
      id SERIAL PRIMARY KEY,
      content TEXT,
      metadata JSONB DEFAULT '{}',
      content_encrypted BYTEA,
      content_iv BYTEA,
      metadata_encrypted BYTEA,
      metadata_iv BYTEA,
      is_encrypted BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    // Post-Taxonomy relationships (many-to-many)
    `CREATE TABLE ${s}.post_taxonomies (
      post_id INTEGER REFERENCES ${s}.posts(id) ON DELETE CASCADE,
      tax_id INTEGER REFERENCES ${s}.taxonomies(id) ON DELETE CASCADE,
      PRIMARY KEY (post_id, tax_id)
    )`,

    // GIN index for fast metadata queries
    `CREATE INDEX idx_${s}_posts_meta ON ${s}.posts USING GIN (metadata)`,
  ];
}

/**
 * Generates the SQL for creating a tenant's schema and all associated tables
 * Returns a single string with all statements (for documentation/debugging)
 */
function generateTenantSchemaSQL(schemaName: string): string {
  const statements = generateTenantSchemaStatements(schemaName);
  return statements.join(';\n\n') + ';';
}

/**
 * Creates a new tenant schema in the database
 * Executes each SQL statement separately (Prisma limitation)
 */
async function createTenantSchema(schemaName: string): Promise<void> {
  const statements = generateTenantSchemaStatements(schemaName);

  // Execute each statement separately
  for (const sql of statements) {
    await prisma.$executeRawUnsafe(sql);
  }
}

/**
 * Drops a tenant schema and all its contents
 * USE WITH CAUTION - this permanently deletes all tenant data
 */
async function dropTenantSchema(schemaName: string): Promise<void> {
  const escapedSchema = escapeSchemaName(schemaName);
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS ${escapedSchema} CASCADE`);
}

/**
 * Checks if a tenant schema exists
 */
async function tenantSchemaExists(schemaName: string): Promise<boolean> {
  const escapedSchema = escapeSchemaName(schemaName);

  const result = await prisma.$queryRaw<{ exists: boolean }[]>`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.schemata
      WHERE schema_name = ${escapedSchema}
    ) as exists
  `;

  return result[0]?.exists || false;
}

/**
 * Encryption parameters for account creation
 */
export interface EncryptionSetupParams {
  kekSalt: Buffer;
  encryptedMasterKey: Buffer;
  kekWrapIv: Buffer;
  recoveryWrappedMK: Buffer;
  recoveryWrapIv: Buffer;
}

/**
 * Registers a new account and creates their tenant schema
 * This is a lower-level function - prefer registerUserAction for user signup
 */
export async function registerTenant(
  email: string,
  username: string,
  passwordHash: string,
  encryptionParams?: EncryptionSetupParams
): Promise<{
  account: {
    id: number;
    userId: string;
    email: string;
    username: string;
    tenantSchemaName: string;
    createdAt: Date;
    encryptionEnabled: boolean;
  };
  schemaName: string;
}> {
  // Generate unique schema name
  const schemaName = await generateSchemaName();

  // Create the account record with optional encryption fields
  const account = await prisma.account.create({
    data: {
      email,
      username,
      passwordHash,
      tenantSchemaName: schemaName,
      // Encryption fields (optional)
      ...(encryptionParams && {
        kekSalt: encryptionParams.kekSalt,
        encryptedMasterKey: encryptionParams.encryptedMasterKey,
        kekWrapIv: encryptionParams.kekWrapIv,
        recoveryWrappedMK: encryptionParams.recoveryWrappedMK,
        recoveryWrapIv: encryptionParams.recoveryWrapIv,
        encryptionEnabled: true,
      }),
    },
  });

  // Create the tenant's isolated schema with all tables
  await createTenantSchema(schemaName);

  // Seed default taxonomies (topics) for the new tenant
  await seedDefaultTaxonomies(schemaName);

  // Seed default settings for the new tenant
  await seedDefaultSettings(schemaName);

  return {
    account: {
      id: account.id,
      userId: account.userId,
      email: account.email,
      username: account.username,
      tenantSchemaName: account.tenantSchemaName,
      createdAt: account.createdAt,
      encryptionEnabled: account.encryptionEnabled,
    },
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
  escapeSchemaName,
  generateSchemaName,
  generateTenantSchemaSQL,
  generateTenantSchemaStatements,
  createTenantSchema,
  dropTenantSchema,
  tenantSchemaExists,
};
