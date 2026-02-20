import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../LoginForm';

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
  loginUserAction: vi.fn(),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Helper to get password field by id
  const getPasswordField = () => document.getElementById('password') as HTMLInputElement;

  it('renders email field', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('renders password field', () => {
    render(<LoginForm />);
    expect(getPasswordField()).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<LoginForm />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders form panel with title', () => {
    render(<LoginForm />);
    // Title appears twice: once in FormPanel title and once in button area
    const titles = screen.getAllByText('Sign In');
    expect(titles.length).toBeGreaterThan(0);
  });

  it('calls loginUserAction with form data', async () => {
    const { loginUserAction } = await import('@/app/auth/actions');
    (loginUserAction as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
      data: {
        userSchema: 'usr_1_abc',
        userName: 'testuser',
        userEmail: 'test@example.com',
      },
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(getPasswordField(), {
      target: { value: 'Password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(loginUserAction).toHaveBeenCalled();
    });
  });

  it('shows error message on failed login', async () => {
    const { loginUserAction } = await import('@/app/auth/actions');
    (loginUserAction as ReturnType<typeof vi.fn>).mockResolvedValue({
      error: 'Invalid email or password',
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(getPasswordField(), {
      target: { value: 'WrongPassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  it('sets auth and redirects on successful login', async () => {
    const sessionData = {
      userSchema: 'usr_1_abc',
      userName: 'testuser',
      userEmail: 'test@example.com',
    };

    const { loginUserAction } = await import('@/app/auth/actions');
    (loginUserAction as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
      data: sessionData,
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(getPasswordField(), {
      target: { value: 'Password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSetAuth).toHaveBeenCalledWith(sessionData);
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('disables button while submitting', async () => {
    const { loginUserAction } = await import('@/app/auth/actions');
    (loginUserAction as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
    );

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(getPasswordField(), {
      target: { value: 'Password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    const submitButton = screen.getByRole('button', { name: /signing in/i });
    expect(submitButton).toBeDisabled();
  });
});
