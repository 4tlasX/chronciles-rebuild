import { create } from 'zustand';

export interface AuthData {
  userName: string;
  userEmail: string;
  userSettings?: Record<string, unknown>;
}

interface AuthState {
  isAuthenticated: boolean;
  userName: string | null;
  userEmail: string | null;
  userSettings: Record<string, unknown>;

  setAuth: (data: AuthData) => void;
  clearAuth: () => void;
  updateSettings: (settings: Record<string, unknown>) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  userName: null,
  userEmail: null,
  userSettings: {},

  setAuth: (data: AuthData) => {
    set({
      isAuthenticated: true,
      userName: data.userName,
      userEmail: data.userEmail,
      userSettings: data.userSettings || {},
    });
  },

  clearAuth: () => {
    set({
      isAuthenticated: false,
      userName: null,
      userEmail: null,
      userSettings: {},
    });
  },

  updateSettings: (settings: Record<string, unknown>) => {
    set({ userSettings: settings });
  },
}));
