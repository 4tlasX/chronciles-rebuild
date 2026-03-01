import { describe, it, expect, afterEach } from 'vitest';
import { prisma } from '../../prisma';
import {
  escapeSchemaName,
  generateTenantSchemaSQL,
  generateTenantSchemaStatements,
  createTenantSchema,
  dropTenantSchema,
  tenantSchemaExists,
} from '../schemaManager';

describe('Schema Management Operations', () => {
  const testSchemas: string[] = [];

  // Clean up any test schemas created during tests
  afterEach(async () => {
    for (const schema of testSchemas) {
      try {
        await dropTenantSchema(schema);
      } catch {
        // Ignore errors during cleanup
      }
    }
    testSchemas.length = 0;
  });

  describe('generateTenantSchemaSQL', () => {
    it('should generate valid SQL for schema creation', () => {
      const sql = generateTenantSchemaSQL('test_schema');

      expect(sql).toContain('CREATE SCHEMA test_schema');
      expect(sql).toContain('CREATE TABLE test_schema.settings');
      expect(sql).toContain('CREATE TABLE test_schema.taxonomies');
      expect(sql).toContain('CREATE TABLE test_schema.posts');
      expect(sql).toContain('CREATE TABLE test_schema.post_taxonomies');
      expect(sql).toContain('CREATE INDEX idx_test_schema_posts_meta');
    });

    it('should include correct column definitions for settings', () => {
      const sql = generateTenantSchemaSQL('test_schema');

      expect(sql).toContain('key TEXT PRIMARY KEY');
      expect(sql).toContain('value JSONB NOT NULL');
      expect(sql).toContain('updated_at TIMESTAMPTZ');
    });

    it('should include correct column definitions for taxonomies', () => {
      const sql = generateTenantSchemaSQL('test_schema');

      expect(sql).toContain('id SERIAL PRIMARY KEY');
      expect(sql).toContain('name TEXT UNIQUE NOT NULL');
      expect(sql).toContain('icon TEXT');
      expect(sql).toContain('color VARCHAR(7)');
    });

    it('should include correct column definitions for posts', () => {
      const sql = generateTenantSchemaSQL('test_schema');

      // content is nullable to support encrypted posts
      expect(sql).toContain('content TEXT');
      expect(sql).toContain("metadata JSONB DEFAULT '{}'");
      expect(sql).toContain('created_at TIMESTAMPTZ');
    });

    it('should include encryption columns for posts', () => {
      const sql = generateTenantSchemaSQL('test_schema');

      expect(sql).toContain('content_encrypted BYTEA');
      expect(sql).toContain('content_iv BYTEA');
      expect(sql).toContain('metadata_encrypted BYTEA');
      expect(sql).toContain('metadata_iv BYTEA');
      expect(sql).toContain('is_encrypted BOOLEAN DEFAULT FALSE');
    });

    it('should include foreign key constraints in post_taxonomies', () => {
      const sql = generateTenantSchemaSQL('test_schema');

      expect(sql).toContain('REFERENCES test_schema.posts(id) ON DELETE CASCADE');
      expect(sql).toContain('REFERENCES test_schema.taxonomies(id) ON DELETE CASCADE');
      expect(sql).toContain('PRIMARY KEY (post_id, tax_id)');
    });

    it('should include GIN index for metadata', () => {
      const sql = generateTenantSchemaSQL('test_schema');

      expect(sql).toContain('USING GIN (metadata)');
    });

    it('should escape potentially dangerous characters from schema name', () => {
      // Test the escapeSchemaName function directly
      const escaped = escapeSchemaName('test_schema; DROP TABLE users;--');

      // Should only contain alphanumeric and underscore
      expect(escaped).not.toContain(';');
      expect(escaped).not.toContain(' ');
      expect(escaped).not.toContain('-');
      expect(escaped).toBe('test_schemaDROPTABLEusers');

      // Verify the escaped name is used in generated SQL
      const statements = generateTenantSchemaStatements('malicious; DROP TABLE --');
      expect(statements[0]).toBe('CREATE SCHEMA maliciousDROPTABLE');
    });
  });

  describe('createTenantSchema', () => {
    it('should create a new schema with all tables', async () => {
      const schemaName = `test_create_${Date.now()}`;
      testSchemas.push(schemaName);

      await createTenantSchema(schemaName);

      // Verify schema exists
      const exists = await tenantSchemaExists(schemaName);
      expect(exists).toBe(true);

      // Verify tables exist
      const tables = await prisma.$queryRawUnsafe<{ table_name: string }[]>(`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = '${schemaName}'
        ORDER BY table_name
      `);

      const tableNames = tables.map((t) => t.table_name);
      expect(tableNames).toContain('settings');
      expect(tableNames).toContain('taxonomies');
      expect(tableNames).toContain('posts');
      expect(tableNames).toContain('post_taxonomies');
    });

    it('should create tables that can store data', async () => {
      const schemaName = `test_data_${Date.now()}`;
      testSchemas.push(schemaName);

      await createTenantSchema(schemaName);

      // Insert data into each table
      await prisma.$executeRawUnsafe(`
        INSERT INTO ${schemaName}.settings (key, value) VALUES ('test', '"value"')
      `);

      await prisma.$executeRawUnsafe(`
        INSERT INTO ${schemaName}.taxonomies (name, icon, color) VALUES ('Tag', '🏷️', '#FF0000')
      `);

      await prisma.$executeRawUnsafe(`
        INSERT INTO ${schemaName}.posts (content, metadata) VALUES ('Post', '{}')
      `);

      // Verify data was inserted
      const settings = await prisma.$queryRawUnsafe<{ key: string }[]>(`
        SELECT key FROM ${schemaName}.settings
      `);
      expect(settings.length).toBe(1);

      const taxonomies = await prisma.$queryRawUnsafe<{ name: string }[]>(`
        SELECT name FROM ${schemaName}.taxonomies
      `);
      expect(taxonomies.length).toBe(1);

      const posts = await prisma.$queryRawUnsafe<{ content: string }[]>(`
        SELECT content FROM ${schemaName}.posts
      `);
      expect(posts.length).toBe(1);
    });
  });

  describe('dropTenantSchema', () => {
    it('should drop an existing schema', async () => {
      const schemaName = `test_drop_${Date.now()}`;

      await createTenantSchema(schemaName);

      // Verify it exists
      let exists = await tenantSchemaExists(schemaName);
      expect(exists).toBe(true);

      // Drop it
      await dropTenantSchema(schemaName);

      // Verify it's gone
      exists = await tenantSchemaExists(schemaName);
      expect(exists).toBe(false);
    });

    it('should not throw when dropping non-existent schema', async () => {
      await expect(
        dropTenantSchema('nonexistent_schema_12345')
      ).resolves.not.toThrow();
    });

    it('should cascade delete all tables and data', async () => {
      const schemaName = `test_cascade_${Date.now()}`;

      await createTenantSchema(schemaName);

      // Add some data
      await prisma.$executeRawUnsafe(`
        INSERT INTO ${schemaName}.posts (content) VALUES ('Test post')
      `);

      // Drop schema
      await dropTenantSchema(schemaName);

      // Verify schema and all tables are gone
      const exists = await tenantSchemaExists(schemaName);
      expect(exists).toBe(false);
    });
  });

  describe('tenantSchemaExists', () => {
    it('should return true for existing schema', async () => {
      const schemaName = `test_exists_${Date.now()}`;
      testSchemas.push(schemaName);

      await createTenantSchema(schemaName);

      const exists = await tenantSchemaExists(schemaName);
      expect(exists).toBe(true);
    });

    it('should return false for non-existent schema', async () => {
      const exists = await tenantSchemaExists('definitely_not_real_schema');
      expect(exists).toBe(false);
    });

    it('should return true for public schema', async () => {
      const exists = await tenantSchemaExists('public');
      expect(exists).toBe(true);
    });
  });

  describe('Schema Isolation', () => {
    it('should isolate data between different tenant schemas', async () => {
      const schema1 = `test_isolation_1_${Date.now()}`;
      const schema2 = `test_isolation_2_${Date.now()}`;
      testSchemas.push(schema1, schema2);

      await createTenantSchema(schema1);
      await createTenantSchema(schema2);

      // Add data to schema1
      await prisma.$executeRawUnsafe(`
        INSERT INTO ${schema1}.posts (content) VALUES ('Schema 1 post')
      `);

      // Add data to schema2
      await prisma.$executeRawUnsafe(`
        INSERT INTO ${schema2}.posts (content) VALUES ('Schema 2 post')
      `);

      // Query schema1 - should only see its own data
      const posts1 = await prisma.$queryRawUnsafe<{ content: string }[]>(`
        SELECT content FROM ${schema1}.posts
      `);
      expect(posts1.length).toBe(1);
      expect(posts1[0].content).toBe('Schema 1 post');

      // Query schema2 - should only see its own data
      const posts2 = await prisma.$queryRawUnsafe<{ content: string }[]>(`
        SELECT content FROM ${schema2}.posts
      `);
      expect(posts2.length).toBe(1);
      expect(posts2[0].content).toBe('Schema 2 post');
    });
  });
});
