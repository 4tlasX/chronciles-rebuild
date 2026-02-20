import { describe, it, expect } from 'vitest';
import { validatePassword, validateUsername, validateEmail } from '../validation';

describe('validatePassword', () => {
  it('accepts valid password', () => {
    const result = validatePassword('SecurePass123');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects short password', () => {
    const result = validatePassword('Short1A');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters long');
  });

  it('rejects password exceeding max length', () => {
    const longPassword = 'A'.repeat(129) + 'a1';
    const result = validatePassword(longPassword);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must not exceed 128 characters');
  });

  it('rejects password without uppercase', () => {
    const result = validatePassword('lowercase123');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one uppercase letter');
  });

  it('rejects password without lowercase', () => {
    const result = validatePassword('UPPERCASE123');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one lowercase letter');
  });

  it('rejects password without number', () => {
    const result = validatePassword('NoNumbersHere');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one number');
  });

  it('returns multiple errors for multiple violations', () => {
    const result = validatePassword('short');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });
});

describe('validateUsername', () => {
  it('accepts valid username', () => {
    const result = validateUsername('john_doe123');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('accepts username with only letters', () => {
    const result = validateUsername('johndoe');
    expect(result.valid).toBe(true);
  });

  it('accepts username with only numbers', () => {
    const result = validateUsername('12345');
    expect(result.valid).toBe(true);
  });

  it('rejects username with special characters', () => {
    const result = validateUsername('john@doe');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Username can only contain letters, numbers, and underscores');
  });

  it('rejects username with spaces', () => {
    const result = validateUsername('john doe');
    expect(result.valid).toBe(false);
  });

  it('rejects short username', () => {
    const result = validateUsername('ab');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Username must be at least 3 characters long');
  });

  it('rejects username exceeding max length', () => {
    const result = validateUsername('a'.repeat(31));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Username must not exceed 30 characters');
  });
});

describe('validateEmail', () => {
  it('accepts valid email', () => {
    const result = validateEmail('test@example.com');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('accepts email with subdomain', () => {
    const result = validateEmail('test@mail.example.com');
    expect(result.valid).toBe(true);
  });

  it('accepts email with plus sign', () => {
    const result = validateEmail('test+tag@example.com');
    expect(result.valid).toBe(true);
  });

  it('rejects email without @', () => {
    const result = validateEmail('testexample.com');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Please enter a valid email address');
  });

  it('rejects email without domain', () => {
    const result = validateEmail('test@');
    expect(result.valid).toBe(false);
  });

  it('rejects email without TLD', () => {
    const result = validateEmail('test@example');
    expect(result.valid).toBe(false);
  });

  it('rejects email with spaces', () => {
    const result = validateEmail('test @example.com');
    expect(result.valid).toBe(false);
  });
});
