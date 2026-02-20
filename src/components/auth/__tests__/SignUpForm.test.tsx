import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignUpForm } from '../SignUpForm';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Zustand store
const mockSetAuth = vi.fn();
vi.mock('@/stores', () => ({
  useAuthStore: (selector: (state: { setAuth: typeof mockSetAuth }) => unknown) =>
    selector({ setAuth: mockSetAuth }),
}));

// Mock server action
vi.mock('@/app/auth/actions', () => ({
  registerUserAction: vi.fn(),
}));

describe('SignUpForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper to get form fields by id
  const getPasswordField = () => document.getElementById('password') as HTMLInputElement;
  const getConfirmPasswordField = () => document.getElementById('confirmPassword') as HTMLInputElement;

  it('renders all form fields', () => {
    render(<SignUpForm />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(getPasswordField()).toBeInTheDocument();
    expect(getConfirmPasswordField()).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<SignUpForm />);
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('renders form panel with title', () => {
    render(<SignUpForm />);
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  it('shows password hint', () => {
    render(<SignUpForm />);
    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    render(<SignUpForm />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(getPasswordField(), {
      target: { value: 'Password123' },
    });
    fireEvent.change(getConfirmPasswordField(), {
      target: { value: 'Different123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('calls registerUserAction with form data', async () => {
    const { registerUserAction } = await import('@/app/auth/actions');
    (registerUserAction as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
      data: {
        userSchema: 'usr_1_abc',
        userName: 'testuser',
        userEmail: 'test@example.com',
      },
    });

    render(<SignUpForm />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(getPasswordField(), {
      target: { value: 'Password123' },
    });
    fireEvent.change(getConfirmPasswordField(), {
      target: { value: 'Password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(registerUserAction).toHaveBeenCalled();
    });
  });

  it('shows server error message', async () => {
    const { registerUserAction } = await import('@/app/auth/actions');
    (registerUserAction as ReturnType<typeof vi.fn>).mockResolvedValue({
      error: 'This username is already taken',
    });

    render(<SignUpForm />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(getPasswordField(), {
      target: { value: 'Password123' },
    });
    fireEvent.change(getConfirmPasswordField(), {
      target: { value: 'Password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/this username is already taken/i)).toBeInTheDocument();
    });
  });

  it('disables button while submitting', async () => {
    const { registerUserAction } = await import('@/app/auth/actions');
    (registerUserAction as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
    );

    render(<SignUpForm />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(getPasswordField(), {
      target: { value: 'Password123' },
    });
    fireEvent.change(getConfirmPasswordField(), {
      target: { value: 'Password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    const submitButton = screen.getByRole('button', { name: /creating account/i });
    expect(submitButton).toBeDisabled();
  });
});
