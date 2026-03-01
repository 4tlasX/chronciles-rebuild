import { describe, it, expect } from 'vitest';
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  stringToArrayBuffer,
  arrayBufferToString,
  generateRandomBytes,
  uint8ArrayToBase64,
  base64ToUint8Array,
} from '../encoding';

describe('encoding', () => {
  describe('arrayBufferToBase64 / base64ToArrayBuffer', () => {
    it('roundtrips correctly', () => {
      const original = new Uint8Array([1, 2, 3, 4, 5, 255, 0, 128]);
      const base64 = arrayBufferToBase64(original.buffer);
      const restored = new Uint8Array(base64ToArrayBuffer(base64));

      expect(restored).toEqual(original);
    });

    it('handles empty arrays', () => {
      const original = new Uint8Array([]);
      const base64 = arrayBufferToBase64(original.buffer);
      const restored = new Uint8Array(base64ToArrayBuffer(base64));

      expect(restored).toEqual(original);
      expect(base64).toBe('');
    });

    it('handles binary data with null bytes', () => {
      const original = new Uint8Array([0, 0, 0, 1, 0, 0, 0]);
      const base64 = arrayBufferToBase64(original.buffer);
      const restored = new Uint8Array(base64ToArrayBuffer(base64));

      expect(restored).toEqual(original);
    });

    it('handles all possible byte values', () => {
      const original = new Uint8Array(256);
      for (let i = 0; i < 256; i++) {
        original[i] = i;
      }
      const base64 = arrayBufferToBase64(original.buffer);
      const restored = new Uint8Array(base64ToArrayBuffer(base64));

      expect(restored).toEqual(original);
    });
  });

  describe('stringToArrayBuffer / arrayBufferToString', () => {
    it('roundtrips ASCII correctly', () => {
      const original = 'Hello, World!';
      const buffer = stringToArrayBuffer(original);
      const restored = arrayBufferToString(buffer);

      expect(restored).toBe(original);
    });

    it('handles unicode content', () => {
      const original = '你好世界 🌍 émojis àéïõü';
      const buffer = stringToArrayBuffer(original);
      const restored = arrayBufferToString(buffer);

      expect(restored).toBe(original);
    });

    it('handles empty string', () => {
      const original = '';
      const buffer = stringToArrayBuffer(original);
      const restored = arrayBufferToString(buffer);

      expect(restored).toBe(original);
    });

    it('handles newlines and special characters', () => {
      const original = 'line1\nline2\r\ntab\there';
      const buffer = stringToArrayBuffer(original);
      const restored = arrayBufferToString(buffer);

      expect(restored).toBe(original);
    });
  });

  describe('generateRandomBytes', () => {
    it('generates bytes of correct length', () => {
      const bytes16 = generateRandomBytes(16);
      const bytes32 = generateRandomBytes(32);

      expect(bytes16.length).toBe(16);
      expect(bytes32.length).toBe(32);
    });

    it('generates different values each call', () => {
      const bytes1 = generateRandomBytes(32);
      const bytes2 = generateRandomBytes(32);

      // Extremely unlikely to be equal if random
      expect(bytes1).not.toEqual(bytes2);
    });

    it('handles zero length', () => {
      const bytes = generateRandomBytes(0);
      expect(bytes.length).toBe(0);
    });
  });

  describe('uint8ArrayToBase64 / base64ToUint8Array', () => {
    it('roundtrips correctly', () => {
      const original = new Uint8Array([10, 20, 30, 40, 50]);
      const base64 = uint8ArrayToBase64(original);
      const restored = base64ToUint8Array(base64);

      expect(restored).toEqual(original);
    });
  });
});
