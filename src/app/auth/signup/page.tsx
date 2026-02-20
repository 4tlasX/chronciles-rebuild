'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageContainer, PageHeader } from '@/components/layout';
import { SignUpForm } from '@/components/auth';
import { useAuthStore } from '@/stores';

export default function SignUpPage() {
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
      <PageHeader title="Sign Up" />
      <SignUpForm />
      <p className="auth-link">
        Already have an account? <Link href="/auth/login">Sign in</Link>
      </p>
    </PageContainer>
  );
}
