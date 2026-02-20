import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../authStore';

describe('authStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({
      isAuthenticated: false,
      userName: null,
      userEmail: null,
      userSettings: {},
    });
  });

  describe('initial state', () => {
    it('starts with isAuthenticated false', () => {
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
    });

    it('starts with null user data', () => {
      const state = useAuthStore.getState();
      expect(state.userName).toBeNull();
      expect(state.userEmail).toBeNull();
    });

    it('starts with empty settings', () => {
      const state = useAuthStore.getState();
      expect(state.userSettings).toEqual({});
    });
  });

  describe('setAuth', () => {
    it('sets authentication state', () => {
      useAuthStore.getState().setAuth({
        userName: 'testuser',
        userEmail: 'test@example.com',
      });

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.userName).toBe('testuser');
      expect(state.userEmail).toBe('test@example.com');
    });

    it('sets user settings when provided', () => {
      useAuthStore.getState().setAuth({
        userName: 'testuser',
        userEmail: 'test@example.com',
        userSettings: { theme: 'dark' },
      });

      const state = useAuthStore.getState();
      expect(state.userSettings).toEqual({ theme: 'dark' });
    });
  });

  describe('clearAuth', () => {
    it('clears all authentication state', () => {
      // First set auth
      useAuthStore.getState().setAuth({
        userName: 'testuser',
        userEmail: 'test@example.com',
        userSettings: { theme: 'dark' },
      });

      // Then clear
      useAuthStore.getState().clearAuth();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.userName).toBeNull();
      expect(state.userEmail).toBeNull();
      expect(state.userSettings).toEqual({});
    });
  });

  describe('updateSettings', () => {
    it('updates user settings', () => {
      useAuthStore.getState().updateSettings({ theme: 'dark', language: 'en' });

      const state = useAuthStore.getState();
      expect(state.userSettings).toEqual({ theme: 'dark', language: 'en' });
    });

    it('replaces existing settings', () => {
      useAuthStore.getState().updateSettings({ theme: 'dark' });
      useAuthStore.getState().updateSettings({ language: 'en' });

      const state = useAuthStore.getState();
      expect(state.userSettings).toEqual({ language: 'en' });
    });
  });
});
