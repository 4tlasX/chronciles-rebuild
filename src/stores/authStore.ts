import { create, StateCreator } from 'zustand';
import { AllSettings, DEFAULT_SETTINGS, SettingKey } from '@/lib/settings';

// Conditionally import zukeeper only in development browser environment
const enableDevTools = typeof window !== 'undefined' && process.env.NODE_ENV === 'development';

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
  /** Update a single setting without creating new userSettings object */
  setSetting: <K extends SettingKey>(key: K, value: AllSettings[K]) => void;
}

const storeCreator: StateCreator<AuthState> = (set) => ({
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

  setSetting: (key, value) => {
    set((state) => ({
      userSettings: { ...state.userSettings, [key]: value },
    }));
  },
});

// Apply zukeeper middleware only in browser dev environment
const applyMiddleware = (creator: StateCreator<AuthState>): StateCreator<AuthState> => {
  if (enableDevTools) {
    // Dynamic import to avoid issues in test/SSR environments
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const zukeeper = require('zukeeper').default;
    return zukeeper(creator) as StateCreator<AuthState>;
  }
  return creator;
};

export const useAuthStore = create<AuthState>()(applyMiddleware(storeCreator));
