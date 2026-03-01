/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from 'vitest';
import {
  generateMasterKey,
  generateRecoveryKey,
  generateSalt,
  generateIv,
  deriveKEK,
  importRawKey,
  wrapKey,
  unwrapKey,
  encrypt,
  decrypt,
} from '../primitives';
import { PBKDF2_ITERATIONS, IV_LENGTH, PBKDF2_SALT_LENGTH, RECOVERY_KEY_LENGTH } from '../constants';

describe('primitives', () => {
  describe('generateMasterKey', () => {
    it('generates an AES-GCM key', async () => {
      const key = await generateMasterKey();

      expect(key).toBeDefined();
      expect(key.algorithm.name).toBe('AES-GCM');
      expect(key.extractable).toBe(true);
      expect(key.usages).toContain('encrypt');
      expect(key.usages).toContain('decrypt');
    });

    it('generates different keys each time', async () => {
      const key1 = await generateMasterKey();
      const key2 = await generateMasterKey();

      // Export and compare raw key bytes
      const raw1 = await crypto.subtle.exportKey('raw', key1);
      const raw2 = await crypto.subtle.exportKey('raw', key2);

      expect(new Uint8Array(raw1)).not.toEqual(new Uint8Array(raw2));
    });
  });

  describe('generateRecoveryKey', () => {
    it('generates correct length', () => {
      const key = generateRecoveryKey();
      expect(key.length).toBe(RECOVERY_KEY_LENGTH);
    });

    it('generates different values each time', () => {
      const key1 = generateRecoveryKey();
      const key2 = generateRecoveryKey();
      expect(key1).not.toEqual(key2);
    });
  });

  describe('generateSalt', () => {
    it('generates correct length', () => {
      const salt = generateSalt();
      expect(salt.length).toBe(PBKDF2_SALT_LENGTH);
    });
  });

  describe('generateIv', () => {
    it('generates correct length', () => {
      const iv = generateIv();
      expect(iv.length).toBe(IV_LENGTH);
    });
  });

  describe('deriveKEK', () => {
    it('derives same key from same password + salt', async () => {
      const salt = generateSalt();
      const password = 'test-password-123';

      const kek1 = await deriveKEK(password, salt, PBKDF2_ITERATIONS);
      const kek2 = await deriveKEK(password, salt, PBKDF2_ITERATIONS);

      // KEKs are not extractable, so we test by wrapping the same key
      const testKey = await generateMasterKey();
      const iv = generateIv();

      const wrapped1 = await wrapKey(testKey, kek1, iv);
      const wrapped2 = await wrapKey(testKey, kek2, iv);

      expect(new Uint8Array(wrapped1)).toEqual(new Uint8Array(wrapped2));
    });

    it('derives different keys from different passwords', async () => {
      const salt = generateSalt();

      const kek1 = await deriveKEK('password1', salt, PBKDF2_ITERATIONS);
      const kek2 = await deriveKEK('password2', salt, PBKDF2_ITERATIONS);

      const testKey = await generateMasterKey();
      const iv = generateIv();

      const wrapped1 = await wrapKey(testKey, kek1, iv);
      const wrapped2 = await wrapKey(testKey, kek2, iv);

      expect(new Uint8Array(wrapped1)).not.toEqual(new Uint8Array(wrapped2));
    });

    it('derives different keys from different salts', async () => {
      const salt1 = generateSalt();
      const salt2 = generateSalt();
      const password = 'same-password';

      const kek1 = await deriveKEK(password, salt1, PBKDF2_ITERATIONS);
      const kek2 = await deriveKEK(password, salt2, PBKDF2_ITERATIONS);

      const testKey = await generateMasterKey();
      const iv = generateIv();

      const wrapped1 = await wrapKey(testKey, kek1, iv);
      const wrapped2 = await wrapKey(testKey, kek2, iv);

      expect(new Uint8Array(wrapped1)).not.toEqual(new Uint8Array(wrapped2));
    });
  });

  describe('wrapKey / unwrapKey', () => {
    it('roundtrips master key correctly', async () => {
      const masterKey = await generateMasterKey();
      const salt = generateSalt();
      const kek = await deriveKEK('test-password', salt, PBKDF2_ITERATIONS);
      const iv = generateIv();

      const wrapped = await wrapKey(masterKey, kek, iv);
      const unwrapped = await unwrapKey(wrapped, kek, iv);

      // Test by encrypting with both keys
      const testData = 'test data';
      const testIv = generateIv();

      const encrypted1 = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: testIv },
        masterKey,
        new TextEncoder().encode(testData)
      );

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: testIv },
        unwrapped,
        encrypted1
      );

      expect(new TextDecoder().decode(decrypted)).toBe(testData);
    });

    it('works with recovery key', async () => {
      const masterKey = await generateMasterKey();
      const recoveryKeyBytes = generateRecoveryKey();
      const recoveryKey = await importRawKey(recoveryKeyBytes);
      const iv = generateIv();

      const wrapped = await wrapKey(masterKey, recoveryKey, iv);
      const unwrapped = await unwrapKey(wrapped, recoveryKey, iv);

      // Verify keys are equivalent
      const raw1 = await crypto.subtle.exportKey('raw', masterKey);
      const raw2 = await crypto.subtle.exportKey('raw', unwrapped);

      expect(new Uint8Array(raw1)).toEqual(new Uint8Array(raw2));
    });

    it('fails with wrong key', async () => {
      const masterKey = await generateMasterKey();
      const salt = generateSalt();
      const kek1 = await deriveKEK('correct-password', salt, PBKDF2_ITERATIONS);
      const kek2 = await deriveKEK('wrong-password', salt, PBKDF2_ITERATIONS);
      const iv = generateIv();

      const wrapped = await wrapKey(masterKey, kek1, iv);

      await expect(unwrapKey(wrapped, kek2, iv)).rejects.toThrow();
    });
  });

  describe('encrypt / decrypt', () => {
    it('roundtrips plaintext correctly', async () => {
      const masterKey = await generateMasterKey();
      const plaintext = 'Hello, World!';

      const { ciphertext, iv } = await encrypt(masterKey, plaintext);
      const decrypted = await decrypt(masterKey, ciphertext, iv);

      expect(decrypted).toBe(plaintext);
    });

    it('uses different IV each encryption', async () => {
      const masterKey = await generateMasterKey();
      const plaintext = 'Same text';

      const result1 = await encrypt(masterKey, plaintext);
      const result2 = await encrypt(masterKey, plaintext);

      expect(result1.iv).not.toBe(result2.iv);
      expect(result1.ciphertext).not.toBe(result2.ciphertext);
    });

    it('fails to decrypt with wrong key', async () => {
      const key1 = await generateMasterKey();
      const key2 = await generateMasterKey();
      const plaintext = 'Secret message';

      const { ciphertext, iv } = await encrypt(key1, plaintext);

      await expect(decrypt(key2, ciphertext, iv)).rejects.toThrow();
    });

    it('handles unicode content', async () => {
      const masterKey = await generateMasterKey();
      const plaintext = '你好世界 🌍 émojis';

      const { ciphertext, iv } = await encrypt(masterKey, plaintext);
      const decrypted = await decrypt(masterKey, ciphertext, iv);

      expect(decrypted).toBe(plaintext);
    });

    it('handles empty string', async () => {
      const masterKey = await generateMasterKey();
      const plaintext = '';

      const { ciphertext, iv } = await encrypt(masterKey, plaintext);
      const decrypted = await decrypt(masterKey, ciphertext, iv);

      expect(decrypted).toBe(plaintext);
    });

    it('handles large content', async () => {
      const masterKey = await generateMasterKey();
      const plaintext = 'x'.repeat(100000);

      const { ciphertext, iv } = await encrypt(masterKey, plaintext);
      const decrypted = await decrypt(masterKey, ciphertext, iv);

      expect(decrypted).toBe(plaintext);
    });
  });
});
