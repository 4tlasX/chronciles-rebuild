'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormPanel } from '@/components/layout';
import { FormGroup, FormRow, EmailInput, PasswordInput, Button } from '@/components/form';
import { useAuthStore } from '@/stores';
import { loginUserAction } from '@/app/auth/actions';

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const fd = new FormData();
    fd.append('email', email);
    fd.append('password', password);

    const result = await loginUserAction(fd);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    if (result.success && result.data) {
      setAuth({
        userSchema: result.data.userSchema,
        userName: result.data.userName,
        userEmail: result.data.userEmail,
      });
      router.push('/');
    }
  };

  return (
    <FormPanel title="Sign In">
      <form onSubmit={handleSubmit}>
        {error && <div className="form-error-banner">{error}</div>}

        <FormRow>
          <FormGroup label="Email" htmlFor="email" required>
            <EmailInput
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup label="Password" htmlFor="password" required>
            <PasswordInput
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </FormGroup>
        </FormRow>

        <div className="form-actions">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </div>
      </form>
    </FormPanel>
  );
}
