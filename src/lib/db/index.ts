// =============================================================================
// Database Module Exports
// =============================================================================

// Schema Management
export {
  registerTenant,
  deleteTenant,
  getTenantSchema,
  getTenantSchemaByEmail,
  generateSchemaName,
  generateTenantSchemaSQL,
  createTenantSchema,
  dropTenantSchema,
  tenantSchemaExists,
} from './schemaManager';

// Tenant Queries - Types
export type {
  Setting,
  Taxonomy,
  Post,
  PostWithTaxonomies,
} from './tenantQueries';

// Tenant Queries - Settings
export {
  getSetting,
  getAllSettings,
  upsertSetting,
  deleteSetting,
} from './tenantQueries';

// Tenant Queries - Taxonomies
export {
  createTaxonomy,
  getTaxonomy,
  getAllTaxonomies,
  updateTaxonomy,
  deleteTaxonomy,
} from './tenantQueries';

// Tenant Queries - Posts
export {
  createPost,
  getPost,
  getAllPosts,
  updatePost,
  deletePost,
} from './tenantQueries';

// Tenant Queries - Relationships
export {
  addTaxonomyToPost,
  removeTaxonomyFromPost,
  getPostTaxonomies,
  getPostsByTaxonomy,
  getPostWithTaxonomies,
} from './tenantQueries';

// Tenant Queries - Metadata Search
export {
  findPostsByMetadata,
  findPostsWithMetadataKey,
} from './tenantQueries';
