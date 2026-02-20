# Chronicles

A multi-tenant blogging system built with Next.js 14, React 18, TypeScript, and PostgreSQL via Prisma.

## Database Architecture

### Phase 1: Global Registry (schema.prisma)

The public schema contains tables that map users to their isolated tenant schemas.

**`Account` model** - Maps users to their private schemas:
- `userId` (UUID) - Fixed identifier for application logic
- `email` - Unique user email
- `tenantSchemaName` - Links to user's private schema (e.g., `usr_742_a9f2j`)

**`SchemaCounter` model** - Atomic counter for generating unique schema names

### Phase 2: Tenant Schema (Dynamic)

When a user signs up, an isolated PostgreSQL schema is created containing:

| Object | Type | Purpose |
|--------|------|---------|
| `settings` | TABLE | Key-value store with JSONB values |
| `taxonomies` | TABLE | Categories/tags with icon and color columns |
| `posts` | TABLE | Main content with JSONB metadata |
| `post_taxonomies` | TABLE | Many-to-many post-taxonomy relationships |
| `idx_*_posts_meta` | INDEX | GIN index for fast metadata queries |

## Key Files

```
src/lib/
├── prisma.ts              # Prisma client singleton
└── db/
    ├── index.ts           # Module exports
    ├── schemaManager.ts   # Tenant schema creation/deletion
    └── tenantQueries.ts   # CRUD operations for tenant tables
```

## API Reference

### Schema Management (schemaManager.ts)

| Function | Description |
|----------|-------------|
| `registerTenant(email)` | Creates account + isolated schema, returns `{ account, schemaName }` |
| `deleteTenant(userId)` | Removes account + drops schema |
| `getTenantSchema(userId)` | Returns schema name for a user |
| `getTenantSchemaByEmail(email)` | Returns schema name by email |
| `tenantSchemaExists(schemaName)` | Checks if schema exists |

### Tenant Queries (tenantQueries.ts)

All functions take `schemaName` as first parameter.

**Settings:**
- `upsertSetting(schema, key, value)` - Create/update setting
- `getSetting(schema, key)` - Get single setting
- `getAllSettings(schema)` - Get all settings
- `deleteSetting(schema, key)` - Delete setting

**Taxonomies:**
- `createTaxonomy(schema, name, options?)` - Create taxonomy (options: `{ icon?, color? }`)
- `getTaxonomy(schema, id)` - Get single taxonomy
- `getAllTaxonomies(schema)` - Get all taxonomies
- `updateTaxonomy(schema, id, updates)` - Update taxonomy (updates: `{ name?, icon?, color? }`)
- `deleteTaxonomy(schema, id)` - Delete taxonomy

**Posts:**
- `createPost(schema, content, metadata?)` - Create post
- `getPost(schema, id)` - Get single post
- `getAllPosts(schema, options?)` - Get paginated posts
- `updatePost(schema, id, updates)` - Update post
- `deletePost(schema, id)` - Delete post

**Relationships:**
- `addTaxonomyToPost(schema, postId, taxId)` - Link taxonomy to post
- `removeTaxonomyFromPost(schema, postId, taxId)` - Unlink taxonomy
- `getPostTaxonomies(schema, postId)` - Get taxonomies for a post
- `getPostsByTaxonomy(schema, taxId)` - Get posts with taxonomy
- `getPostWithTaxonomies(schema, postId)` - Get post with joined taxonomies

**Metadata Search (uses GIN index):**
- `findPostsByMetadata(schema, key, value)` - Find posts by metadata key-value
- `findPostsWithMetadataKey(schema, key)` - Find posts containing metadata key

## Usage Example

```typescript
import { registerTenant, createPost, createTaxonomy, addTaxonomyToPost } from '@/lib/db';

// Sign up a new user
const { account, schemaName } = await registerTenant('user@example.com');

// Create content in their isolated schema
const post = await createPost(schemaName, 'My first blog post', { featured: true });
const tag = await createTaxonomy(schemaName, 'Technology', { icon: '💻', color: '#3B82F6' });
await addTaxonomyToPost(schemaName, post.id, tag.id);
```

## Database Commands

```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
```

## Project Structure

```
chronicles/
├── schema.prisma          # Prisma schema (global tables)
├── prisma.config.ts       # Prisma configuration
├── next.config.js         # Next.js configuration
├── package.json
├── tsconfig.json
├── .env                   # Environment variables
│
└── src/
    ├── app/
    │   ├── layout.tsx     # Root layout
    │   ├── page.tsx       # Home page
    │   └── globals.css    # Global styles
    ├── components/        # React components
    └── lib/
        ├── prisma.ts      # Prisma client
        └── db/            # Database utilities
```
