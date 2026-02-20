'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormPanel } from '@/components/layout';
import { FormGroup, FormRow, TextInput, EmailInput, PasswordInput, Button } from '@/components/form';
import { useAuthStore } from '@/stores';
import { registerUserAction } from '@/app/auth/actions';

interface FormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export function SignUpForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormState>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Client-side validation
    const newErrors: FormErrors = {};

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    const fd = new FormData();
    fd.append('username', formData.username);
    fd.append('email', formData.email);
    fd.append('password', formData.password);

    const result = await registerUserAction(fd);

    if (result.error) {
      setErrors({ general: result.error });
      setIsSubmitting(false);
      return;
    }

    if (result.success && result.data) {
      useAuthStore.getState().setAuth({
        userName: result.data.userName,
        userEmail: result.data.userEmail,
      });
      router.push('/');
    }
  };

  return (
    <FormPanel title="Create Account">
      <form onSubmit={handleSubmit}>
        {errors.general && (
          <div className="form-error-banner">{errors.general}</div>
        )}

        <FormRow>
          <FormGroup label="Username" htmlFor="username" required error={errors.username}>
            <TextInput
              id="username"
              name="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              error={!!errors.username}
              autoComplete="username"
              required
            />
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup label="Email" htmlFor="email" required error={errors.email}>
            <EmailInput
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={!!errors.email}
              autoComplete="email"
              required
            />
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup
            label="Password"
            htmlFor="password"
            required
            error={errors.password}
            hint="At least 8 characters with uppercase, lowercase, and numbers"
          >
            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={!!errors.password}
              autoComplete="new-password"
              required
            />
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup label="Confirm Password" htmlFor="confirmPassword" required error={errors.confirmPassword}>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={!!errors.confirmPassword}
              autoComplete="new-password"
              showToggle={false}
              required
            />
          </FormGroup>
        </FormRow>

        <div className="form-actions">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </div>
      </form>
    </FormPanel>
  );
}
