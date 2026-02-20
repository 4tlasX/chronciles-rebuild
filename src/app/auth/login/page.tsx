'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageContainer, PageHeader } from '@/components/layout';
import { LoginForm } from '@/components/auth';
import { useAuthStore } from '@/stores';

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isSessionValid = useAuthStore((state) => state.isSessionValid);

  useEffect(() => {
    if (isAuthenticated && isSessionValid()) {
      router.push('/');
    }
  }, [isAuthenticated, isSessionValid, router]);

  return (
    <PageContainer>
      <PageHeader title="Sign In" />
      <LoginForm />
      <p className="auth-link">
        Don&apos;t have an account? <Link href="/auth/signup">Sign up</Link>
      </p>
    </PageContainer>
  );
}
