/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from 'vitest';
import { encryptionService } from '../encryptionService';
import type { EncryptedPost } from '../types';

describe('EncryptionService', () => {
  describe('setupEncryption', () => {
    it('generates all required fields', async () => {
      const result = await encryptionService.setupEncryption('test-password');

      expect(result.salt).toBeDefined();
      expect(result.wrappedMK).toBeDefined();
      expect(result.wrapIv).toBeDefined();
      expect(result.recoveryKey).toBeDefined();
      expect(result.recoveryWrappedMK).toBeDefined();
      expect(result.recoveryWrapIv).toBeDefined();
      expect(result.masterKey).toBeDefined();
    });

    it('returns base64 encoded strings', async () => {
      const result = await encryptionService.setupEncryption('test-password');

      // Base64 should not throw when decoded
      expect(() => atob(result.salt)).not.toThrow();
      expect(() => atob(result.wrappedMK)).not.toThrow();
      expect(() => atob(result.wrapIv)).not.toThrow();
      expect(() => atob(result.recoveryKey)).not.toThrow();
      expect(() => atob(result.recoveryWrappedMK)).not.toThrow();
      expect(() => atob(result.recoveryWrapIv)).not.toThrow();
    });

    it('returns usable masterKey', async () => {
      const result = await encryptionService.setupEncryption('test-password');

      // Should be able to encrypt with the key
      const encrypted = await encryptionService.encryptPost(
        result.masterKey,
        'test content',
        { test: true }
      );

      expect(encrypted.contentEncrypted).toBeDefined();
    });
  });

  describe('unwrapMasterKey', () => {
    it('unwraps master key with correct password', async () => {
      const password = 'correct-password';
      const setup = await encryptionService.setupEncryption(password);

      const unwrapped = await encryptionService.unwrapMasterKey(
        password,
        setup.salt,
        setup.wrappedMK,
        setup.wrapIv,
        600000
      );

      // Verify by encrypting with original and decrypting with unwrapped
      const encrypted = await encryptionService.encryptPost(
        setup.masterKey,
        'test content',
        {}
      );

      const post: EncryptedPost = {
        id: 1,
        contentEncrypted: encrypted.contentEncrypted,
        contentIv: encrypted.contentIv,
        metadataEncrypted: encrypted.metadataEncrypted,
        metadataIv: encrypted.metadataIv,
        isEncrypted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const decrypted = await encryptionService.decryptPost(unwrapped, post);
      expect(decrypted.content).toBe('test content');
    });

    it('throws on wrong password', async () => {
      const setup = await encryptionService.setupEncryption('correct-password');

      await expect(
        encryptionService.unwrapMasterKey(
          'wrong-password',
          setup.salt,
          setup.wrappedMK,
          setup.wrapIv,
          600000
        )
      ).rejects.toThrow();
    });
  });

  describe('unwrapWithRecoveryKey', () => {
    it('unwraps master key with correct recovery key', async () => {
      const setup = await encryptionService.setupEncryption('test-password');

      const unwrapped = await encryptionService.unwrapWithRecoveryKey(
        setup.recoveryKey,
        setup.recoveryWrappedMK,
        setup.recoveryWrapIv
      );

      // Verify by encrypting with original and decrypting with unwrapped
      const encrypted = await encryptionService.encryptPost(
        setup.masterKey,
        'recovery test',
        {}
      );

      const post: EncryptedPost = {
        id: 1,
        contentEncrypted: encrypted.contentEncrypted,
        contentIv: encrypted.contentIv,
        metadataEncrypted: encrypted.metadataEncrypted,
        metadataIv: encrypted.metadataIv,
        isEncrypted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const decrypted = await encryptionService.decryptPost(unwrapped, post);
      expect(decrypted.content).toBe('recovery test');
    });

    it('throws on wrong recovery key', async () => {
      const setup = await encryptionService.setupEncryption('test-password');
      const wrongKey = btoa(
        String.fromCharCode(...new Uint8Array(32).fill(0))
      );

      await expect(
        encryptionService.unwrapWithRecoveryKey(
          wrongKey,
          setup.recoveryWrappedMK,
          setup.recoveryWrapIv
        )
      ).rejects.toThrow();
    });
  });

  describe('rewrapMasterKey', () => {
    it('wraps master key with new password', async () => {
      const setup = await encryptionService.setupEncryption('old-password');

      const rewrap = await encryptionService.rewrapMasterKey(
        setup.masterKey,
        'new-password'
      );

      expect(rewrap.salt).toBeDefined();
      expect(rewrap.wrappedMK).toBeDefined();
      expect(rewrap.wrapIv).toBeDefined();
    });

    it('new wrapped key can be unwrapped with new password', async () => {
      const setup = await encryptionService.setupEncryption('old-password');

      const rewrap = await encryptionService.rewrapMasterKey(
        setup.masterKey,
        'new-password'
      );

      const unwrapped = await encryptionService.unwrapMasterKey(
        'new-password',
        rewrap.salt,
        rewrap.wrappedMK,
        rewrap.wrapIv,
        600000
      );

      // Verify keys are equivalent
      const encrypted = await encryptionService.encryptPost(
        setup.masterKey,
        'rewrap test',
        {}
      );

      const post: EncryptedPost = {
        id: 1,
        contentEncrypted: encrypted.contentEncrypted,
        contentIv: encrypted.contentIv,
        metadataEncrypted: encrypted.metadataEncrypted,
        metadataIv: encrypted.metadataIv,
        isEncrypted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const decrypted = await encryptionService.decryptPost(unwrapped, post);
      expect(decrypted.content).toBe('rewrap test');
    });
  });

  describe('encryptPost', () => {
    it('returns encrypted content + iv', async () => {
      const setup = await encryptionService.setupEncryption('test-password');

      const encrypted = await encryptionService.encryptPost(
        setup.masterKey,
        'test content',
        { key: 'value' }
      );

      expect(encrypted.contentEncrypted).toBeDefined();
      expect(encrypted.contentIv).toBeDefined();
      expect(encrypted.metadataEncrypted).toBeDefined();
      expect(encrypted.metadataIv).toBeDefined();

      // Should be base64
      expect(() => atob(encrypted.contentEncrypted)).not.toThrow();
      expect(() => atob(encrypted.contentIv)).not.toThrow();
    });

    it('produces different ciphertext each time (unique IV)', async () => {
      const setup = await encryptionService.setupEncryption('test-password');

      const encrypted1 = await encryptionService.encryptPost(
        setup.masterKey,
        'same content',
        {}
      );

      const encrypted2 = await encryptionService.encryptPost(
        setup.masterKey,
        'same content',
        {}
      );

      expect(encrypted1.contentIv).not.toBe(encrypted2.contentIv);
      expect(encrypted1.contentEncrypted).not.toBe(encrypted2.contentEncrypted);
    });
  });

  describe('decryptPost', () => {
    it('decrypts content correctly', async () => {
      const setup = await encryptionService.setupEncryption('test-password');

      const encrypted = await encryptionService.encryptPost(
        setup.masterKey,
        'secret content',
        { meta: 'data' }
      );

      const post: EncryptedPost = {
        id: 1,
        contentEncrypted: encrypted.contentEncrypted,
        contentIv: encrypted.contentIv,
        metadataEncrypted: encrypted.metadataEncrypted,
        metadataIv: encrypted.metadataIv,
        isEncrypted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const decrypted = await encryptionService.decryptPost(
        setup.masterKey,
        post
      );

      expect(decrypted.content).toBe('secret content');
      expect(decrypted.metadata).toEqual({ meta: 'data' });
    });

    it('passes through plaintext posts unchanged', async () => {
      const setup = await encryptionService.setupEncryption('test-password');

      const post: EncryptedPost = {
        id: 1,
        content: 'plaintext content',
        metadata: { plain: true },
        contentEncrypted: null,
        contentIv: null,
        metadataEncrypted: null,
        metadataIv: null,
        isEncrypted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const decrypted = await encryptionService.decryptPost(
        setup.masterKey,
        post
      );

      expect(decrypted.content).toBe('plaintext content');
      expect(decrypted.metadata).toEqual({ plain: true });
      expect(decrypted.isEncrypted).toBe(false);
    });

    it('handles unicode in content', async () => {
      const setup = await encryptionService.setupEncryption('test-password');

      const encrypted = await encryptionService.encryptPost(
        setup.masterKey,
        '你好世界 🌍 émojis',
        { emoji: '🎉' }
      );

      const post: EncryptedPost = {
        id: 1,
        contentEncrypted: encrypted.contentEncrypted,
        contentIv: encrypted.contentIv,
        metadataEncrypted: encrypted.metadataEncrypted,
        metadataIv: encrypted.metadataIv,
        isEncrypted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const decrypted = await encryptionService.decryptPost(
        setup.masterKey,
        post
      );

      expect(decrypted.content).toBe('你好世界 🌍 émojis');
      expect(decrypted.metadata).toEqual({ emoji: '🎉' });
    });
  });

  describe('decryptPosts', () => {
    it('handles mixed encrypted/plaintext posts', async () => {
      const setup = await encryptionService.setupEncryption('test-password');

      const encrypted = await encryptionService.encryptPost(
        setup.masterKey,
        'encrypted content',
        { encrypted: true }
      );

      const posts: EncryptedPost[] = [
        {
          id: 1,
          content: 'plaintext post',
          metadata: { plain: true },
          contentEncrypted: null,
          contentIv: null,
          metadataEncrypted: null,
          metadataIv: null,
          isEncrypted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          contentEncrypted: encrypted.contentEncrypted,
          contentIv: encrypted.contentIv,
          metadataEncrypted: encrypted.metadataEncrypted,
          metadataIv: encrypted.metadataIv,
          isEncrypted: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const decrypted = await encryptionService.decryptPosts(
        setup.masterKey,
        posts
      );

      expect(decrypted).toHaveLength(2);
      expect(decrypted[0].content).toBe('plaintext post');
      expect(decrypted[0].isEncrypted).toBe(false);
      expect(decrypted[1].content).toBe('encrypted content');
      expect(decrypted[1].isEncrypted).toBe(true);
    });
  });
});
