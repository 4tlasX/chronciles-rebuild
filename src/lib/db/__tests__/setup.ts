import { prisma } from '../../prisma';
import { createTenantSchema, dropTenantSchema } from '../schemaManager';

// Test schema name - unique per test run
let testSchemaName: string;

export function getTestSchemaName(): string {
  return testSchemaName;
}

export async function setupTestSchema(): Promise<string> {
  // Generate a unique test schema name
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  testSchemaName = `test_${timestamp}_${random}`;

  // Create the test schema
  await createTenantSchema(testSchemaName);

  return testSchemaName;
}

export async function teardownTestSchema(): Promise<void> {
  if (testSchemaName) {
    await dropTenantSchema(testSchemaName);
  }
}

export async function cleanupAllTestSchemas(): Promise<void> {
  // Clean up any leftover test schemas from previous failed runs
  const result = await prisma.$queryRaw<{ schema_name: string }[]>`
    SELECT schema_name FROM information_schema.schemata
    WHERE schema_name LIKE 'test_%'
  `;

  for (const row of result) {
    await dropTenantSchema(row.schema_name);
  }
}

export { prisma };
