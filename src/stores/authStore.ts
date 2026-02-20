import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthData {
  userSchema: string;
  userName: string;
  userEmail: string;
  userSettings?: Record<string, unknown>;
}

interface AuthState {
  isAuthenticated: boolean;
  userSchema: string | null;
  userName: string | null;
  userEmail: string | null;
  userSettings: Record<string, unknown>;

  setAuth: (data: AuthData) => void;
  clearAuth: () => void;
  updateSettings: (settings: Record<string, unknown>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userSchema: null,
      userName: null,
      userEmail: null,
      userSettings: {},

      setAuth: (data: AuthData) => {
        set({
          isAuthenticated: true,
          userSchema: data.userSchema,
          userName: data.userName,
          userEmail: data.userEmail,
          userSettings: data.userSettings || {},
        });
      },

      clearAuth: () => {
        set({
          isAuthenticated: false,
          userSchema: null,
          userName: null,
          userEmail: null,
          userSettings: {},
        });
      },

      updateSettings: (settings: Record<string, unknown>) => {
        set({ userSettings: settings });
      },
    }),
    {
      name: 'chronicles-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userSchema: state.userSchema,
        userName: state.userName,
        userEmail: state.userEmail,
        userSettings: state.userSettings,
      }),
    }
  )
);
