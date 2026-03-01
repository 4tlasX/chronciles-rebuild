# End-to-End Encryption Layer for Chronicles

## Overview

Add client-side AES-256-GCM encryption for post content and metadata. Data is encrypted before leaving the browser and stored encrypted in the database. The server never sees plaintext.

**Key decisions:**
- Password prompt on each new session (tab close/refresh loses key)
- New posts only encrypted (existing posts remain plaintext)
- Settings NOT encrypted (low sensitivity)
- **MODULAR**: Crypto utilities in stateless `EncryptionService`, state managed by `EncryptionProvider`

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT BROWSER                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │         EncryptionProvider (OWNS STATE - React Context)          │    │
│  │              src/components/encryption/EncryptionProvider.tsx    │    │
│  │                                                                   │    │
│  │  State (React useState):                                         │    │
│  │    - masterKey: CryptoKey | null                                 │    │
│  │    - isUnlocked: boolean (derived: masterKey !== null)          │    │
│  │    - encryptionParams: {salt, wrappedMK, wrapIv, iterations}    │    │
│  │                                                                   │    │
│  │  Context Methods (call service, manage state):                   │    │
│  │    - unlock(password) → sets masterKey state                    │    │
│  │    - lock() → clears masterKey state                            │    │
│  │    - encryptPost(content, metadata) → calls service with key    │    │
│  │    - decryptPosts(posts[]) → calls service with key             │    │
│  │                                                                   │    │
│  └──────────────────────────┬──────────────────────────────────────┘    │
│                              │                                           │
│  ┌───────────────────────────┴───────────────────────────────────────┐  │
│  │         EncryptionService (STATELESS - Pure Crypto Utils)         │  │
│  │                  src/lib/crypto/encryptionService.ts              │  │
│  │                                                                    │  │
│  │  Key Operations (no internal state):                              │  │
│  │    - setupEncryption(password) → {salt, wrappedMK, wrapIv, mk}   │  │
│  │    - unwrapMasterKey(password, salt, ...) → CryptoKey            │  │
│  │                                                                    │  │
│  │  Content Operations (take key as parameter):                      │  │
│  │    - encryptPost(mk, content, metadata) → EncryptedPost          │  │
│  │    - decryptPost(mk, encryptedPost) → DecryptedPost              │  │
│  │    - decryptPosts(mk, posts[]) → DecryptedPost[]                 │  │
│  │                                                                    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│         ┌────────────────────┼────────────────────┐                     │
│         │                    │                    │                     │
│         ▼                    ▼                    ▼                     │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐             │
│  │ LoginForm   │      │  PostForm   │      │PostCardFeed │             │
│  │             │      │             │      │             │             │
│  │ useEncrypt  │      │ useEncrypt  │      │ useEncrypt  │             │
│  │ .unlock()   │      │ .encryptPost│      │ .decryptPost│             │
│  └─────────────┘      └─────────────┘      └─────────────┘             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Hierarchy:**
1. **Master Key (MK)**: AES-256, generated once per user, encrypts all content
2. **Key Encryption Key (KEK)**: Derived from password via PBKDF2, wraps the MK
3. **Recovery Key (RK)**: Random 256-bit key, independently wraps the MK (backup path)
4. MK stored encrypted in database (twice: password-wrapped + recovery-wrapped)

```
                      ┌─────────────┐
                      │  Master Key │
                      │    (MK)     │
                      └──────┬──────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
      ┌─────────────────┐       ┌─────────────────┐
      │  Password Path  │       │  Recovery Path  │
      │                 │       │                 │
      │  KEK derived    │       │  Recovery Key   │
      │  from password  │       │  (random 256b)  │
      │  wraps MK       │       │  wraps MK       │
      └────────┬────────┘       └────────┬────────┘
               │                         │
               ▼                         ▼
      ┌─────────────────┐       ┌─────────────────┐
      │  wrappedMK      │       │  recoveryWrapped│
      │  + salt + iv    │       │  MK + iv        │
      │  (stored in DB) │       │  (stored in DB) │
      └─────────────────┘       └─────────────────┘
```

---

## Implementation Steps

### Phase 1: Crypto Service + Provider

**1.1 Create EncryptionService** `src/lib/crypto/encryptionService.ts`

Stateless service - the ONLY file that touches Web Crypto API. All methods take key as parameter.

```typescript
class EncryptionService {
  // No internal state - all methods are pure functions

  // Key Operations
  async setupEncryption(password: string): Promise<{
    salt: string;
    wrappedMK: string;
    wrapIv: string;
    recoveryKey: string;        // Show to user ONCE - base64 encoded
    recoveryWrappedMK: string;  // MK wrapped by recovery key
    recoveryWrapIv: string;
    masterKey: CryptoKey;       // Return key to caller (Provider stores it)
  }>;

  async unwrapMasterKey(
    password: string,
    salt: string,
    wrappedMK: string,
    wrapIv: string,
    iterations: number
  ): Promise<CryptoKey>;  // Return key to caller

  async unwrapWithRecoveryKey(
    recoveryKey: string,
    recoveryWrappedMK: string,
    recoveryWrapIv: string
  ): Promise<CryptoKey>;  // Recovery path - no PBKDF2 needed

  async rewrapMasterKey(
    masterKey: CryptoKey,
    newPassword: string
  ): Promise<{
    salt: string;
    wrappedMK: string;
    wrapIv: string;
  }>;  // After recovery, wrap MK with new password

  // Content Operations - take key as parameter
  async encryptPost(
    masterKey: CryptoKey,
    content: string,
    metadata: Record<string, unknown>
  ): Promise<EncryptedPostData>;

  async decryptPost(
    masterKey: CryptoKey,
    post: EncryptedPost
  ): Promise<DecryptedPost>;

  async decryptPosts(
    masterKey: CryptoKey,
    posts: Post[]
  ): Promise<DecryptedPost[]>;
}

export const encryptionService = new EncryptionService();
```

**1.2 Create EncryptionProvider** `src/components/encryption/EncryptionProvider.tsx`

React Context owns the master key state. Components use `useEncryption()` hook.

```typescript
interface EncryptionContextValue {
  isUnlocked: boolean;
  unlock: (password: string) => Promise<void>;
  lock: () => void;
  encryptPost: (content: string, metadata: Record<string, unknown>) => Promise<EncryptedPostData>;
  decryptPosts: (posts: Post[]) => Promise<DecryptedPost[]>;
}

export function EncryptionProvider({ children, encryptionParams }) {
  const [masterKey, setMasterKey] = useState<CryptoKey | null>(null);
  const isUnlocked = masterKey !== null;

  const unlock = async (password: string) => {
    const mk = await encryptionService.unwrapMasterKey(
      password,
      encryptionParams.salt,
      encryptionParams.wrappedMK,
      encryptionParams.wrapIv,
      encryptionParams.iterations
    );
    setMasterKey(mk);  // React state update → re-render
  };

  const lock = () => setMasterKey(null);

  const encryptPost = async (content, metadata) => {
    if (!masterKey) throw new Error('Not unlocked');
    return encryptionService.encryptPost(masterKey, content, metadata);
  };

  const decryptPosts = async (posts) => {
    if (!masterKey) throw new Error('Not unlocked');
    return encryptionService.decryptPosts(masterKey, posts);
  };

  return (
    <EncryptionContext.Provider value={{ isUnlocked, unlock, lock, encryptPost, decryptPosts }}>
      {children}
    </EncryptionContext.Provider>
  );
}

export const useEncryption = () => useContext(EncryptionContext);
```

**1.3 Create supporting utilities** (internal to service, not exported)
- `src/lib/crypto/primitives.ts` - Low-level Web Crypto wrappers (deriveKey, encrypt, decrypt)
- `src/lib/crypto/encoding.ts` - Base64/ArrayBuffer helpers
- `src/lib/crypto/constants.ts` - Algorithm configs

**1.4 Unit Tests** `src/lib/crypto/__tests__/`

Create tests alongside implementation using Vitest:

`encoding.test.ts`:
```typescript
describe('encoding', () => {
  it('base64Encode/Decode roundtrips correctly', ...);
  it('handles empty arrays', ...);
  it('handles binary data with null bytes', ...);
});
```

`primitives.test.ts`:
```typescript
describe('deriveKEK', () => {
  it('derives same key from same password + salt', ...);
  it('derives different keys from different passwords', ...);
  it('derives different keys from different salts', ...);
});

describe('encrypt/decrypt', () => {
  it('roundtrips plaintext correctly', ...);
  it('uses different IV each encryption', ...);
  it('fails to decrypt with wrong key', ...);
  it('handles unicode content', ...);
  it('handles empty string', ...);
});
```

`encryptionService.test.ts`:
```typescript
describe('EncryptionService', () => {
  // No beforeEach needed - service is stateless

  describe('setupEncryption', () => {
    it('generates salt, wrappedMK, wrapIv', ...);
    it('returns usable masterKey', ...);
  });

  describe('unwrapMasterKey', () => {
    it('unwraps master key with correct password', ...);
    it('throws on wrong password', ...);
  });

  describe('unwrapWithRecoveryKey', () => {
    it('unwraps master key with correct recovery key', ...);
    it('throws on wrong recovery key', ...);
  });

  describe('rewrapMasterKey', () => {
    it('wraps master key with new password', ...);
    it('new wrapped key can be unwrapped with new password', ...);
  });

  describe('encryptPost', () => {
    it('returns encrypted content + iv', ...);
    it('returns encrypted metadata + iv', ...);
  });

  describe('decryptPost', () => {
    it('decrypts content correctly', ...);
    it('decrypts metadata correctly', ...);
    it('passes through plaintext posts unchanged', ...);
  });

  describe('decryptPosts', () => {
    it('handles mixed encrypted/plaintext posts', ...);
  });
});
```

`EncryptionProvider.test.tsx`:
```typescript
describe('EncryptionProvider', () => {
  describe('useEncryption hook', () => {
    it('isUnlocked is false initially', ...);
    it('isUnlocked becomes true after unlock()', ...);
    it('isUnlocked becomes false after lock()', ...);
    it('encryptPost throws if not unlocked', ...);
    it('decryptPosts throws if not unlocked', ...);
    it('re-renders children when isUnlocked changes', ...);
  });
});
```

### Phase 2: Database Schema

**2.1 Update Prisma schema** `schema.prisma`
```prisma
model Account {
  // ... existing fields ...

  // Password-wrapped master key
  encryptedMasterKey  Bytes?    @map("encrypted_master_key")
  kekSalt             Bytes?    @map("kek_salt")
  kekWrapIv           Bytes?    @map("kek_wrap_iv")
  kekIterations       Int       @default(600000) @map("kek_iterations")

  // Recovery-wrapped master key (independent backup path)
  recoveryWrappedMK   Bytes?    @map("recovery_wrapped_mk")
  recoveryWrapIv      Bytes?    @map("recovery_wrap_iv")

  encryptionEnabled   Boolean   @default(false) @map("encryption_enabled")
}
```

**2.2 Update tenant schema creation** `src/lib/db/schemaManager.ts`
Add encrypted columns to posts table:
```sql
content_encrypted BYTEA,
content_iv BYTEA,
metadata_encrypted BYTEA,
metadata_iv BYTEA,
is_encrypted BOOLEAN DEFAULT FALSE
```

**2.3 Update tenant queries** `src/lib/db/tenantQueries.ts`
- Add `createEncryptedPost()` function
- Update `getAllPosts()` to return encrypted fields
- Update `Post` interface with encrypted variants

### Phase 3: Auth Integration

**3.1 Modify registration** `src/app/auth/actions.ts`
- Accept `kekSalt`, `wrappedMK`, `wrapIv` from FormData
- Store encryption fields in Account record

**3.2 Modify login** `src/app/auth/actions.ts`
- Return encryption params on successful login

**3.3 Update SignUpForm** `src/components/auth/SignUpForm.tsx`
```typescript
const { setMasterKey } = useEncryption();

// Call service, store key in Provider
const result = await encryptionService.setupEncryption(password);
formData.append('kekSalt', result.salt);
formData.append('wrappedMK', result.wrappedMK);
formData.append('wrapIv', result.wrapIv);
formData.append('recoveryWrappedMK', result.recoveryWrappedMK);
formData.append('recoveryWrapIv', result.recoveryWrapIv);
setMasterKey(result.masterKey);  // Provider stores key → isUnlocked = true

// Show recovery key dialog ONCE after successful registration
showRecoveryKeyDialog(result.recoveryKey);
```

**3.4 Update LoginForm** `src/components/auth/LoginForm.tsx`
```typescript
const { unlock } = useEncryption();

// After successful login, unlock encryption
if (result.encryption?.encryptionEnabled) {
  await unlock(password);  // Provider calls service.unwrapMasterKey internally
}
```

### Phase 4: Post Encryption

**4.1 Update PostForm** `src/components/post/PostForm.tsx`
```typescript
const { isUnlocked, encryptPost } = useEncryption();

// In handleSubmit
if (isUnlocked) {
  const encrypted = await encryptPost(content, metadata);
  formData.set('encryptedPayload', JSON.stringify(encrypted));
  formData.set('isEncrypted', 'true');
}
```

**4.2 Update PostCardFeed** `src/app/(dashboard)/PostCardFeed.tsx`
```typescript
const { isUnlocked, decryptPosts } = useEncryption();
const [posts, setPosts] = useState(initialPosts);

useEffect(() => {
  if (isUnlocked) {
    decryptPosts(initialPosts).then(setPosts);
  }
}, [initialPosts, isUnlocked]);  // Auto-decrypts when unlocked
```

**4.3 Update post actions** `src/app/(dashboard)/posts/actions.ts`
- Handle encrypted payload, store as BYTEA

### Phase 5: Unlock Flow

**5.1 Create UnlockDialog** `src/components/encryption/UnlockDialog.tsx`
- Modal prompting for password
- Calls `unlock()` from `useEncryption()` hook
- On success, dialog closes automatically (isUnlocked triggers re-render)

**5.2 Wire up EncryptionProvider** `src/app/layout.tsx`
- Wrap app with EncryptionProvider
- Pass encryption params from server session
- Provider shows UnlockDialog when session valid but masterKey is null

### Phase 6: Recovery Key System

**6.1 Create RecoveryKeyDialog** `src/components/encryption/RecoveryKeyDialog.tsx`
- Modal shown ONCE after registration
- Displays recovery key with copy button
- Warning: "Save this key somewhere safe. You won't see it again."
- Checkbox: "I have saved my recovery key" (required to close)

**6.2 Create ViewRecoveryKeyDialog** `src/components/encryption/ViewRecoveryKeyDialog.tsx`
- Accessed from Settings page
- Requires current password to reveal
- Re-derives recovery key from masterKey (requires unlocked state)

**6.3 Create ForgotPasswordDialog** `src/components/encryption/ForgotPasswordDialog.tsx`
- Link on login page: "Forgot password? Use recovery key"
- Input for recovery key
- Calls `encryptionService.unwrapWithRecoveryKey()`
- On success, prompts for new password
- Calls `encryptionService.rewrapMasterKey()` with new password
- Updates password hash + re-wrapped MK in database

**6.4 Update Settings page** `src/app/settings/page.tsx`
- Add "Security" section
- "View Recovery Key" button → opens ViewRecoveryKeyDialog

**6.5 Recovery flow:**
```
User forgets password
        │
        ▼
Login page → "Forgot password?"
        │
        ▼
┌─────────────────────────────┐
│   ForgotPasswordDialog      │
│                             │
│   Enter recovery key:       │
│   [________________________]│
│                             │
│   [Recover Account]         │
└─────────────┬───────────────┘
              │
              ▼
  unwrapWithRecoveryKey(recoveryKey)
              │
              ▼
        MK unwrapped
              │
              ▼
┌─────────────────────────────┐
│   Set New Password          │
│                             │
│   New password:             │
│   [________________________]│
│   Confirm:                  │
│   [________________________]│
│                             │
│   [Save New Password]       │
└─────────────┬───────────────┘
              │
              ▼
  rewrapMasterKey(mk, newPassword)
              │
              ▼
  Update Account: new passwordHash,
  new salt, new wrappedMK, new wrapIv
              │
              ▼
       Login with new password
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `schema.prisma` | Add 7 encryption fields to Account (incl. recovery) |
| `src/lib/db/schemaManager.ts` | Add encrypted columns to posts table DDL |
| `src/lib/db/tenantQueries.ts` | Add encrypted post functions, update Post interface |
| `src/app/auth/actions.ts` | Handle encryption params in register/login |
| `src/components/auth/SignUpForm.tsx` | Call service + set key via Provider |
| `src/components/auth/LoginForm.tsx` | Call `unlock()` from `useEncryption()` |
| `src/components/post/PostForm.tsx` | Call `encryptPost()` from `useEncryption()` |
| `src/app/(dashboard)/posts/actions.ts` | Handle encrypted payloads |
| `src/app/(dashboard)/PostCardFeed.tsx` | Call `decryptPosts()` from `useEncryption()` |
| `src/app/layout.tsx` | Wrap with EncryptionProvider |
| `src/app/settings/page.tsx` | Add Security section with "View Recovery Key" |

## New Files

| File | Purpose |
|------|---------|
| `src/lib/crypto/encryptionService.ts` | **STATELESS SERVICE** - pure crypto functions |
| `src/lib/crypto/primitives.ts` | Internal Web Crypto wrappers (not exported) |
| `src/lib/crypto/encoding.ts` | Base64/ArrayBuffer utilities |
| `src/lib/crypto/constants.ts` | Algorithm configs |
| `src/lib/crypto/types.ts` | TypeScript interfaces |
| `src/lib/crypto/index.ts` | Public exports (service only) |
| `src/lib/crypto/__tests__/encoding.test.ts` | Unit tests for encoding utilities |
| `src/lib/crypto/__tests__/primitives.test.ts` | Unit tests for crypto primitives |
| `src/lib/crypto/__tests__/encryptionService.test.ts` | Unit tests for main service |
| `src/components/encryption/EncryptionProvider.tsx` | **OWNS STATE** - React context + useEncryption hook |
| `src/components/encryption/UnlockDialog.tsx` | Password re-entry modal |
| `src/components/encryption/RecoveryKeyDialog.tsx` | Show recovery key after registration |
| `src/components/encryption/ViewRecoveryKeyDialog.tsx` | View recovery key in Settings (requires password) |
| `src/components/encryption/ForgotPasswordDialog.tsx` | Password reset via recovery key |
| `src/components/encryption/__tests__/EncryptionProvider.test.tsx` | Tests for Provider + hook |
| `src/components/encryption/__tests__/UnlockDialog.test.tsx` | Component tests for unlock dialog |
| `src/components/encryption/__tests__/ForgotPasswordDialog.test.tsx` | Tests for recovery flow |

---

## Verification

### Unit Tests (run with `npm run test:run`)
```bash
# Run all crypto tests
npm run test:run -- src/lib/crypto

# Run with coverage
npm run test:coverage -- --include='src/lib/crypto/**'
```

**Expected test coverage:**
- `encoding.ts` - 100%
- `primitives.ts` - 100%
- `encryptionService.ts` - 90%+ (some browser-specific paths)

### Manual Testing
1. **Registration flow**: Sign up, verify encryption fields saved in Account, verify isUnlocked = true
2. **Login flow**: Log in, verify unlock dialog, enter password, verify isUnlocked = true
3. **Create post**: Create post, verify content/metadata stored as encrypted BYTEA
4. **Read post**: Refresh page, enter password, verify posts auto-decrypt when isUnlocked changes
5. **Mixed content**: Verify old plaintext posts display alongside new encrypted posts
6. **Session timeout**: Close tab, reopen, verify unlock prompt appears
7. **Wrong password**: Enter wrong password in unlock dialog, verify error shown
8. **React reactivity**: Verify UI updates immediately when unlock() completes (no manual refresh)
9. **Recovery key shown**: After registration, verify recovery key dialog appears
10. **View recovery key**: In Settings, enter password, verify recovery key displays
11. **Password reset**: Use recovery key to reset password, verify login works with new password
12. **Wrong recovery key**: Enter invalid recovery key, verify error shown

---

## Security Notes

- MK never leaves browser unencrypted
- Password only available briefly during login/signup
- PBKDF2 with 600,000 iterations (OWASP 2024 recommendation)
- 12-byte random IV per encryption (never reused)
- AES-GCM provides authenticated encryption (tamper detection)
- Recovery key is 256-bit random, shown once at registration + viewable in Settings
- Recovery key provides independent path to MK (no password needed)
- **Data loss warning**: If user loses BOTH password AND recovery key, encrypted data is unrecoverable
