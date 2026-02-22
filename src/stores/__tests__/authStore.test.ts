import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../authStore';
import { DEFAULT_SETTINGS } from '@/lib/settings';

describe('authStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({
      isAuthenticated: false,
      userName: null,
      userEmail: null,
      userSettings: { ...DEFAULT_SETTINGS },
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

    it('starts with default settings', () => {
      const state = useAuthStore.getState();
      expect(state.userSettings).toEqual(DEFAULT_SETTINGS);
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

    it('merges user settings with defaults when provided', () => {
      useAuthStore.getState().setAuth({
        userName: 'testuser',
        userEmail: 'test@example.com',
        userSettings: { accentColor: '#ff0000' },
      });

      const state = useAuthStore.getState();
      // Should merge with defaults
      expect(state.userSettings.accentColor).toBe('#ff0000');
      expect(state.userSettings.timezone).toBe(DEFAULT_SETTINGS.timezone);
    });
  });

  describe('clearAuth', () => {
    it('clears all authentication state', () => {
      // First set auth
      useAuthStore.getState().setAuth({
        userName: 'testuser',
        userEmail: 'test@example.com',
        userSettings: { accentColor: '#ff0000' },
      });

      // Then clear
      useAuthStore.getState().clearAuth();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.userName).toBeNull();
      expect(state.userEmail).toBeNull();
      expect(state.userSettings).toEqual(DEFAULT_SETTINGS);
    });
  });

  describe('updateSettings', () => {
    it('updates user settings', () => {
      useAuthStore.getState().updateSettings({ accentColor: '#ff0000' });

      const state = useAuthStore.getState();
      expect(state.userSettings.accentColor).toBe('#ff0000');
    });

    it('merges with existing settings', () => {
      useAuthStore.getState().updateSettings({ accentColor: '#ff0000' });
      useAuthStore.getState().updateSettings({ timezone: 'America/New_York' });

      const state = useAuthStore.getState();
      // Both updates should be preserved
      expect(state.userSettings.accentColor).toBe('#ff0000');
      expect(state.userSettings.timezone).toBe('America/New_York');
    });
  });
});
