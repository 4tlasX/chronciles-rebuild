'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { validateSessionAction, logoutAction } from '@/app/auth/actions';

/**
 * Hook for validating sessions before protected operations.
 * Session token is stored in HTTP-only cookie and validated server-side.
 */
export function useSessionValidation() {
  const router = useRouter();
  const { isAuthenticated, clearAuth } = useAuthStore();

  /**
   * Validates the current session.
   * Returns true if valid, false otherwise.
   * Automatically clears auth and redirects to login if invalid.
   */
  const validateSession = useCallback(async (): Promise<boolean> => {
    // Validate against server (checks HTTP-only cookie)
    const result = await validateSessionAction();

    if (!result.valid) {
      clearAuth();
      router.push('/auth/login');
      return false;
    }

    return true;
  }, [clearAuth, router]);

  /**
   * Wrapper that validates session before executing a callback.
   * Only executes the callback if session is valid.
   */
  const withSessionValidation = useCallback(
    async <T>(callback: () => Promise<T>): Promise<T | null> => {
      const isValid = await validateSession();
      if (!isValid) {
        return null;
      }
      return callback();
    },
    [validateSession]
  );

  /**
   * Logout the current user
   */
  const logout = useCallback(async () => {
    await logoutAction();
    clearAuth();
    router.push('/auth/login');
  }, [clearAuth, router]);

  return {
    validateSession,
    withSessionValidation,
    logout,
    isAuthenticated,
  };
}
