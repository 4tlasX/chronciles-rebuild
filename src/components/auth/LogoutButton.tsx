'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { logoutAction } from '@/app/auth/actions';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    useAuthStore.getState().clearAuth();
    router.push('/auth/login');
  };

  return (
    <button type="button" onClick={handleLogout} className="nav-logout">
      Logout
    </button>
  );
}
