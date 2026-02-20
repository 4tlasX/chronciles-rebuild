import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PageContainer, PageHeader } from '@/components/layout';
import { LoginForm } from '@/components/auth';
import { getServerSession } from '@/app/auth/actions';

export default async function LoginPage() {
  // If already logged in, redirect to home
  const session = await getServerSession();
  if (session) {
    redirect('/');
  }

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
