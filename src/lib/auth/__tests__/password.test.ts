import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../password';

describe('Password utilities', () => {
  describe('hashPassword', () => {
    it('returns a bcrypt hash', async () => {
      const hash = await hashPassword('TestPassword123');
      expect(hash).toMatch(/^\$2[aby]\$\d{2}\$/);
    });

    it('generates different hashes for same password (salt)', async () => {
      const hash1 = await hashPassword('TestPassword123');
      const hash2 = await hashPassword('TestPassword123');
      expect(hash1).not.toBe(hash2);
    });

    it('generates hash of expected length', async () => {
      const hash = await hashPassword('TestPassword123');
      expect(hash.length).toBe(60);
    });
  });

  describe('verifyPassword', () => {
    it('returns true for correct password', async () => {
      const hash = await hashPassword('TestPassword123');
      const result = await verifyPassword('TestPassword123', hash);
      expect(result).toBe(true);
    });

    it('returns false for incorrect password', async () => {
      const hash = await hashPassword('TestPassword123');
      const result = await verifyPassword('WrongPassword', hash);
      expect(result).toBe(false);
    });

    it('returns false for empty password', async () => {
      const hash = await hashPassword('TestPassword123');
      const result = await verifyPassword('', hash);
      expect(result).toBe(false);
    });

    it('handles special characters in password', async () => {
      const password = 'P@ssw0rd!#$%^&*()';
      const hash = await hashPassword(password);
      const result = await verifyPassword(password, hash);
      expect(result).toBe(true);
    });
  });
});
