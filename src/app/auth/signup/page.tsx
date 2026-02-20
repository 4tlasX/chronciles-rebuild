import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PageContainer, PageHeader } from '@/components/layout';
import { SignUpForm } from '@/components/auth';
import { getServerSession } from '@/app/auth/actions';

export default async function SignUpPage() {
  // If already logged in, redirect to home
  const session = await getServerSession();
  if (session) {
    redirect('/');
  }

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
