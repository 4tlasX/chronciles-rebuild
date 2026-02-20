import { getTenantSchemaByEmail, registerTenant } from './db';

const DEMO_EMAIL = 'demo@chronicles.local';

export async function getSchemaFromRequest(
  searchParams: { email?: string }
): Promise<{ schemaName: string; email: string } | null> {
  const email = searchParams.email || DEMO_EMAIL;

  let schemaName = await getTenantSchemaByEmail(email);

  // Auto-register demo user if not exists
  if (!schemaName && email === DEMO_EMAIL) {
    const result = await registerTenant(DEMO_EMAIL);
    schemaName = result.schemaName;
  }

  if (!schemaName) {
    return null;
  }

  return { schemaName, email };
}
