# Chronicles

A multi-tenant blogging system built with Next.js 16, React 18, TypeScript, and PostgreSQL via Prisma.

## Authentication System

### Overview

Authentication uses HTTP-only cookies with server-side session validation. The tenant schema name (e.g., `usr_742_a9f2j`) is **never exposed to the client**.

### Key Files

```
src/
├── app/
│   ├── layout.tsx                 # Wraps app with AuthProvider
│   └── auth/
│       ├── actions.ts             # Server actions (login, register, validate)
│       ├── login/page.tsx         # Login page
│       └── signup/page.tsx        # Sign up page
├── components/auth/
│   ├── AuthProvider.tsx           # Session validation on every navigation
│   ├── LoginForm.tsx              # Login form component
│   └── SignUpForm.tsx             # Registration form component
├── stores/
│   └── authStore.ts               # Zustand store (display data only)
└── lib/auth/
    ├── password.ts                # Bcrypt hash/verify
    └── validation.ts              # Input validation
```

### Authentication Flow

```
User visits /settings (protected page)
        │
        ▼
┌─────────────────┐
│   RootLayout    │  src/app/layout.tsx
│   <AuthProvider>│
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│         AuthProvider                │  src/components/auth/AuthProvider.tsx
│  isChecking = true (show loading)   │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   Is PUBLIC_PATHS? (/auth/login,    │
│   /auth/signup)                     │
└────────┬────────────────────────────┘
         │ No (protected route)
         ▼
┌─────────────────────────────────────┐
│   validateSessionAction()           │  src/app/auth/actions.ts
│   - Read HTTP-only cookie           │
│   - Find Session in database        │
│   - Check expiration                │
└────────┬────────────────────────────┘
         │
         ▼
    ┌────────────┐
    │   Valid?   │
    └─────┬──────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
  Yes          No
    │           │
    ▼           ▼
┌─────────┐  ┌──────────────────────┐
│ Extend  │  │ clearAuth()          │
│ session │  │ redirect('/auth/login')│
│ (sliding│  └──────────────────────┘
│ window) │
└────┬────┘
     │
     ▼
┌─────────────────────────────────────┐
│   setAuth({ userName, userEmail })  │  Zustand store (client state)
│   isChecking = false                │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   Render <SettingsPage />           │  src/app/settings/page.tsx
│   - getServerSession() → schemaName │
│   - getAllSettings(schemaName)      │
└─────────────────────────────────────┘
```

### Server Actions (src/app/auth/actions.ts)

| Function | Description |
|----------|-------------|
| `registerUserAction(formData)` | Create account + tenant schema, set session cookie |
| `loginUserAction(formData)` | Verify credentials, create session, set cookie |
| `logoutAction()` | Delete session, clear cookie |
| `validateSessionAction()` | Check session validity, return `{ valid, data }` for client |
| `getServerSession()` | **Server-only**: Returns `{ schemaName, userName, userEmail }` |
| `cleanupExpiredSessions()` | Delete expired sessions from database |

### Session Security

- **HTTP-only cookies**: Session token not accessible to JavaScript
- **Sliding window expiration**: 1-hour sessions, extended on each validation
- **Single session policy**: Login invalidates previous sessions
- **Failed login protection**: Wrong password clears any existing session
- **Double-blind validation**: Client never sees tenant schema name

### Zustand Store (src/stores/authStore.ts)

Client-side state for display purposes only:

```typescript
{
  isAuthenticated: boolean;
  userName: string | null;
  userEmail: string | null;
  userSettings: Record<string, unknown>;
}
```

**Note**: No `persist` middleware. The HTTP-only cookie is the source of truth.

### Protected Pages Pattern

Server components use `getServerSession()`:

```typescript
export default async function SettingsPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/auth/login');
  }

  const settings = await getAllSettings(session.schemaName);
  // ... render
}
```

### CRUD Actions Pattern

Server actions get schema from session, not from client:

```typescript
export async function createPostAction(formData: FormData) {
  const session = await getServerSession();
  if (!session) {
    return { error: 'Not authenticated' };
  }

  await createPost(session.schemaName, content);
}
```

---

## Database Architecture

### Global Registry (schema.prisma)

The public schema contains tables that map users to their isolated tenant schemas.

**`Account` model**:
- `userId` (UUID) - Fixed identifier
- `email` - Unique user email
- `username` - Unique username
- `passwordHash` - Bcrypt hashed password
- `tenantSchemaName` - Links to user's private schema (e.g., `usr_742_a9f2j`)

**`Session` model**:
- `token` (UUID) - Session identifier (stored in HTTP-only cookie)
- `accountId` - Foreign key to Account
- `expiresAt` - Session expiration timestamp

**`SchemaCounter` model** - Atomic counter for generating unique schema names

### Tenant Schema (Dynamic)

When a user signs up, an isolated PostgreSQL schema is created containing:

| Object | Type | Purpose |
|--------|------|---------|
| `settings` | TABLE | Key-value store with JSONB values |
| `taxonomies` | TABLE | Categories/tags with icon and color columns |
| `posts` | TABLE | Main content with JSONB metadata |
| `post_taxonomies` | TABLE | Many-to-many post-taxonomy relationships |
| `idx_*_posts_meta` | INDEX | GIN index for fast metadata queries |

---

## API Reference

### Schema Management (src/lib/db/schemaManager.ts)

| Function | Description |
|----------|-------------|
| `registerTenant(email, username, passwordHash)` | Creates account + isolated schema |
| `deleteTenant(userId)` | Removes account + drops schema |
| `getTenantSchema(userId)` | Returns schema name for a user |
| `getTenantSchemaByEmail(email)` | Returns schema name by email |
| `tenantSchemaExists(schemaName)` | Checks if schema exists |

### Tenant Queries (src/lib/db/tenantQueries.ts)

All functions take `schemaName` as first parameter.

**Settings:**
- `upsertSetting(schema, key, value)` - Create/update setting
- `getSetting(schema, key)` - Get single setting
- `getAllSettings(schema)` - Get all settings
- `deleteSetting(schema, key)` - Delete setting

**Taxonomies:**
- `createTaxonomy(schema, name, options?)` - Create taxonomy
- `getTaxonomy(schema, id)` - Get single taxonomy
- `getAllTaxonomies(schema)` - Get all taxonomies
- `updateTaxonomy(schema, id, updates)` - Update taxonomy
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

**Metadata Search:**
- `findPostsByMetadata(schema, key, value)` - Find posts by metadata key-value
- `findPostsWithMetadataKey(schema, key)` - Find posts containing metadata key

---

## Project Structure

```
chronicles/
├── schema.prisma              # Prisma schema (Account, Session, SchemaCounter)
├── prisma.config.ts           # Prisma configuration
├── next.config.js             # Next.js configuration
├── package.json
├── tsconfig.json
├── .env                       # Environment variables
│
└── src/
    ├── app/
    │   ├── layout.tsx         # Root layout (wraps AuthProvider)
    │   ├── page.tsx           # Home page (posts)
    │   ├── globals.css        # Global styles
    │   ├── auth/
    │   │   ├── actions.ts     # Auth server actions
    │   │   ├── login/         # Login page
    │   │   └── signup/        # Sign up page
    │   ├── posts/             # Post CRUD
    │   ├── topics/            # Topic/taxonomy CRUD
    │   └── settings/          # Settings CRUD
    ├── components/
    │   ├── auth/              # AuthProvider, LoginForm, SignUpForm
    │   ├── form/              # Form components
    │   ├── layout/            # Layout components
    │   ├── post/              # Post components
    │   ├── settings/          # Settings components
    │   └── topic/             # Topic components
    ├── stores/
    │   └── authStore.ts       # Zustand auth store
    └── lib/
        ├── prisma.ts          # Prisma client singleton
        ├── auth/              # Password hashing, validation
        └── db/                # Schema manager, tenant queries
```

---

## Commands

```bash
npm run dev          # Start dev server (localhost only)
npm run build        # Production build
npm run test:run     # Run all tests
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
```

---

## Theming

### CSS Variables (src/app/globals.css)

| Variable | Default | Description |
|----------|---------|-------------|
| `--header-color` | `#2d2c2a` | Header/sidebar background |
| `--header-color-hover` | `#3d3c3a` | Header hover state |
| `--accent-color` | `#00b4d8` | Primary accent color (user-configurable in Settings) |
| `--accent-color-hover` | `#00a0c0` | Accent hover state (auto-calculated) |
| `--background-image` | `none` | Optional background image |

**User-configurable colors** (Settings > Theme):
- Header Color: 18 preset colors
- Accent Color: 16 preset colors (controls all icons and highlights)
- Background Image: 28 Unsplash images

### Accent Color Usage

The `--accent-color` variable controls all highlights and icons throughout the app:

- **All icons**: Sidebar nav icons, panel header buttons, topic icons (all use accent color with varying opacity)
- **Sidebar**: Navigation icons at 50% opacity (75% hover, 100% active)
- **Panel headers**: Add/edit/delete button icons
- **Topic icons**: SVG fill color (via `TopicIcon` component)
- **Post list**: Active/selected post title color
- **Topic list**: Active topic name, count badge, and background
- **Buttons**: Primary button background (`.btn-primary`)
- **Forms**: Input/textarea focus border and ring, toggle switch on-state
- **Selectors**: Color grid and image grid selected borders
- **Taxonomy selector**: Focus state, selected option highlight
- **Links**: Auth page links
- **Metadata**: Post metadata key highlighting
