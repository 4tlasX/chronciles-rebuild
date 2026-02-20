'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { validateSessionAction } from '@/app/auth/actions';

const PUBLIC_PATHS = ['/auth/login', '/auth/signup'];

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  const { setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      // Allow public paths without auth
      if (PUBLIC_PATHS.includes(pathname)) {
        setIsChecking(false);
        return;
      }

      // Validate session against server (checks HTTP-only cookie)
      const result = await validateSessionAction();

      if (!result.valid || !result.data) {
        clearAuth();
        router.push('/auth/login');
        setIsChecking(false);
        return;
      }

      // Sync Zustand store with session data
      setAuth({
        userSchema: result.data.userSchema,
        userName: result.data.userName,
        userEmail: result.data.userEmail,
      });

      setIsChecking(false);
    };

    checkAuth();
  }, [pathname, setAuth, clearAuth, router]);

  // Show nothing while checking auth (prevents flash of protected content)
  if (isChecking && !PUBLIC_PATHS.includes(pathname)) {
    return (
      <div className="auth-loading">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
