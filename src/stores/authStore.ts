import { create } from 'zustand';
import { AllSettings, DEFAULT_SETTINGS } from '@/lib/settings';

export interface AuthData {
  userName: string;
  userEmail: string;
  userSettings?: Partial<AllSettings>;
}

interface AuthState {
  isAuthenticated: boolean;
  userName: string | null;
  userEmail: string | null;
  userSettings: AllSettings;

  setAuth: (data: AuthData) => void;
  clearAuth: () => void;
  /** Replace all settings */
  setSettings: (settings: AllSettings) => void;
  /** Partially update settings (merge with existing) */
  updateSettings: (partial: Partial<AllSettings>) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  userName: null,
  userEmail: null,
  userSettings: { ...DEFAULT_SETTINGS },

  setAuth: (data: AuthData) => {
    set({
      isAuthenticated: true,
      userName: data.userName,
      userEmail: data.userEmail,
      userSettings: { ...DEFAULT_SETTINGS, ...data.userSettings },
    });
  },

  clearAuth: () => {
    set({
      isAuthenticated: false,
      userName: null,
      userEmail: null,
      userSettings: { ...DEFAULT_SETTINGS },
    });
  },

  setSettings: (settings: AllSettings) => {
    set({ userSettings: settings });
  },

  updateSettings: (partial: Partial<AllSettings>) => {
    set((state) => ({
      userSettings: { ...state.userSettings, ...partial },
    }));
  },
}));
