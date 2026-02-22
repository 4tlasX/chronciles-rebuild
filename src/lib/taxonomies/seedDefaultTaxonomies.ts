import { prisma } from '../prisma';
import { coreTaxonomies } from './defaultTaxonomies';

/**
 * Seeds default taxonomies into a tenant's schema
 * Called during tenant registration after schema creation
 */
export async function seedDefaultTaxonomies(schemaName: string): Promise<void> {
  // Escape schema name to prevent SQL injection
  const schema = schemaName.replace(/[^a-z0-9_]/gi, '');

  // Insert each core taxonomy
  for (const taxonomy of coreTaxonomies) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO ${schema}.taxonomies (name, icon, color)
       VALUES ($1, $2, $3)
       ON CONFLICT (name) DO NOTHING`,
      taxonomy.name,
      taxonomy.icon,
      taxonomy.color
    );
  }
}

/**
 * Seeds optional taxonomies that can be enabled by users
 * Can be called later to add additional taxonomies
 */
export async function seedOptionalTaxonomy(
  schemaName: string,
  taxonomyName: string
): Promise<void> {
  const { optionalTaxonomies } = await import('./defaultTaxonomies');
  const taxonomy = optionalTaxonomies.find(
    (t) => t.name.toLowerCase() === taxonomyName.toLowerCase()
  );

  if (!taxonomy) {
    throw new Error(`Unknown optional taxonomy: ${taxonomyName}`);
  }

  const schema = schemaName.replace(/[^a-z0-9_]/gi, '');

  await prisma.$executeRawUnsafe(
    `INSERT INTO ${schema}.taxonomies (name, icon, color)
     VALUES ($1, $2, $3)
     ON CONFLICT (name) DO NOTHING`,
    taxonomy.name,
    taxonomy.icon,
    taxonomy.color
  );
}
