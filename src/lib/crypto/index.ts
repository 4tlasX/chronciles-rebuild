/**
 * Public exports for the crypto module
 * Only export what external code needs to use
 */

// Main service
export { encryptionService } from './encryptionService';

// Types for consumers
export type {
  SetupEncryptionResult,
  RewrapResult,
  EncryptedPostData,
  EncryptedPost,
  DecryptedPost,
  EncryptionParams,
} from './types';

// Constants that might be needed externally
export { PBKDF2_ITERATIONS } from './constants';
