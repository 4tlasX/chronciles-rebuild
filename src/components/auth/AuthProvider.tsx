'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { validateSessionAction } from '@/app/auth/actions';
import { Nav } from '@/components/layout';

const PUBLIC_PATHS = ['/auth/login', '/auth/signup'];

function isPublicPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return PUBLIC_PATHS.some(path => pathname.startsWith(path));
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'public'>('loading');

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      // Public paths - render without nav
      if (isPublicPath(pathname)) {
        if (!cancelled) setAuthState('public');
        return;
      }

      // Protected path - validate session
      const result = await validateSessionAction();

      if (cancelled) return;

      if (!result.valid || !result.data) {
        useAuthStore.getState().clearAuth();
        router.push('/auth/login');
        return;
      }

      // Valid session - set auth and show app with nav
      useAuthStore.getState().setAuth({
        userName: result.data.userName,
        userEmail: result.data.userEmail,
      });

      setAuthState('authenticated');
    };

    setAuthState('loading');
    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  // Loading state - show nothing
  if (authState === 'loading') {
    return null;
  }

  // Public paths - render children without nav
  if (authState === 'public') {
    return <>{children}</>;
  }

  // Authenticated - render nav + children
  return (
    <>
      <Nav />
      {children}
    </>
  );
}
