/**
 * TypeScript interfaces for encryption system
 */

// Result from initial encryption setup (registration)
export interface SetupEncryptionResult {
  // Password-derived key wrapping
  salt: string; // Base64 encoded
  wrappedMK: string; // Base64 encoded - MK wrapped by KEK
  wrapIv: string; // Base64 encoded - IV used for wrapping

  // Recovery key wrapping
  recoveryKey: string; // Base64 encoded - show to user ONCE
  recoveryWrappedMK: string; // Base64 encoded - MK wrapped by recovery key
  recoveryWrapIv: string; // Base64 encoded - IV used for recovery wrapping

  // The actual master key (kept in memory by Provider)
  masterKey: CryptoKey;
}

// Result from rewrapping MK with new password (after recovery)
export interface RewrapResult {
  salt: string;
  wrappedMK: string;
  wrapIv: string;
}

// Encrypted post data (sent to server)
export interface EncryptedPostData {
  contentEncrypted: string; // Base64 encoded
  contentIv: string; // Base64 encoded
  metadataEncrypted: string; // Base64 encoded
  metadataIv: string; // Base64 encoded
}

// Post with encrypted fields (from database)
export interface EncryptedPost {
  id: number;
  contentEncrypted: string | null;
  contentIv: string | null;
  metadataEncrypted: string | null;
  metadataIv: string | null;
  isEncrypted: boolean;
  // Plaintext fields (for non-encrypted posts)
  content?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Decrypted post (after client-side decryption)
export interface DecryptedPost {
  id: number;
  content: string;
  metadata: Record<string, unknown>;
  isEncrypted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Encryption parameters stored in Account (returned on login)
export interface EncryptionParams {
  encryptionEnabled: boolean;
  kekSalt: string; // Base64 encoded
  encryptedMasterKey: string; // Base64 encoded
  kekWrapIv: string; // Base64 encoded
  kekIterations: number;
  // Recovery params (for forgot password flow)
  recoveryWrappedMK: string; // Base64 encoded
  recoveryWrapIv: string; // Base64 encoded
}
