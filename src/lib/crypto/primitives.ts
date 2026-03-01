/**
 * Low-level Web Crypto API wrappers
 * These are internal utilities - not exported from the module
 */

import {
  AES_ALGORITHM,
  AES_KEY_LENGTH,
  IV_LENGTH,
  PBKDF2_ALGORITHM,
  PBKDF2_HASH,
  PBKDF2_SALT_LENGTH,
  RECOVERY_KEY_LENGTH,
} from './constants';
import {
  generateRandomBytes,
  base64ToUint8Array,
  uint8ArrayToBase64,
  stringToArrayBuffer,
  arrayBufferToString,
} from './encoding';

/**
 * Generate a new AES-256 master key
 */
export async function generateMasterKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    {
      name: AES_ALGORITHM,
      length: AES_KEY_LENGTH,
    },
    true, // extractable - needed for wrapping
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate a random recovery key (256-bit)
 */
export function generateRecoveryKey(): Uint8Array {
  return generateRandomBytes(RECOVERY_KEY_LENGTH);
}

/**
 * Generate a random salt for PBKDF2
 */
export function generateSalt(): Uint8Array {
  return generateRandomBytes(PBKDF2_SALT_LENGTH);
}

/**
 * Generate a random IV for AES-GCM
 */
export function generateIv(): Uint8Array {
  return generateRandomBytes(IV_LENGTH);
}

/**
 * Derive a Key Encryption Key (KEK) from password using PBKDF2
 */
export async function deriveKEK(
  password: string,
  salt: Uint8Array,
  iterations: number
): Promise<CryptoKey> {
  // Import password as key material
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    stringToArrayBuffer(password),
    PBKDF2_ALGORITHM,
    false,
    ['deriveKey']
  );

  // Derive the KEK
  return crypto.subtle.deriveKey(
    {
      name: PBKDF2_ALGORITHM,
      salt: salt.buffer as ArrayBuffer,
      iterations: iterations,
      hash: PBKDF2_HASH,
    },
    passwordKey,
    {
      name: AES_ALGORITHM,
      length: AES_KEY_LENGTH,
    },
    false, // not extractable
    ['wrapKey', 'unwrapKey']
  );
}

/**
 * Import a raw key (recovery key) as CryptoKey for wrapping
 */
export async function importRawKey(keyBytes: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    keyBytes.buffer as ArrayBuffer,
    {
      name: AES_ALGORITHM,
      length: AES_KEY_LENGTH,
    },
    false,
    ['wrapKey', 'unwrapKey']
  );
}

/**
 * Wrap (encrypt) the master key with a wrapping key (KEK or recovery key)
 */
export async function wrapKey(
  masterKey: CryptoKey,
  wrappingKey: CryptoKey,
  iv: Uint8Array
): Promise<ArrayBuffer> {
  return crypto.subtle.wrapKey('raw', masterKey, wrappingKey, {
    name: AES_ALGORITHM,
    iv: iv.buffer as ArrayBuffer,
  });
}

/**
 * Unwrap (decrypt) the master key with a wrapping key (KEK or recovery key)
 */
export async function unwrapKey(
  wrappedKey: ArrayBuffer,
  wrappingKey: CryptoKey,
  iv: Uint8Array
): Promise<CryptoKey> {
  return crypto.subtle.unwrapKey(
    'raw',
    wrappedKey,
    wrappingKey,
    {
      name: AES_ALGORITHM,
      iv: iv.buffer as ArrayBuffer,
    },
    {
      name: AES_ALGORITHM,
      length: AES_KEY_LENGTH,
    },
    true, // extractable - needed for re-wrapping
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt plaintext with AES-GCM
 * Returns: { ciphertext, iv } both as Base64 strings
 */
export async function encrypt(
  masterKey: CryptoKey,
  plaintext: string
): Promise<{ ciphertext: string; iv: string }> {
  const iv = generateIv();
  const plaintextBuffer = stringToArrayBuffer(plaintext);

  const ciphertextBuffer = await crypto.subtle.encrypt(
    {
      name: AES_ALGORITHM,
      iv: iv.buffer as ArrayBuffer,
    },
    masterKey,
    plaintextBuffer
  );

  return {
    ciphertext: uint8ArrayToBase64(new Uint8Array(ciphertextBuffer)),
    iv: uint8ArrayToBase64(iv),
  };
}

/**
 * Decrypt ciphertext with AES-GCM
 */
export async function decrypt(
  masterKey: CryptoKey,
  ciphertext: string,
  iv: string
): Promise<string> {
  const ciphertextBuffer = base64ToUint8Array(ciphertext);
  const ivBuffer = base64ToUint8Array(iv);

  const plaintextBuffer = await crypto.subtle.decrypt(
    {
      name: AES_ALGORITHM,
      iv: ivBuffer.buffer as ArrayBuffer,
    },
    masterKey,
    ciphertextBuffer.buffer as ArrayBuffer
  );

  return arrayBufferToString(plaintextBuffer);
}
