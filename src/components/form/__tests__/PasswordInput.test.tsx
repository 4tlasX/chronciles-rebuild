import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PasswordInput } from '../PasswordInput';

describe('PasswordInput', () => {
  it('renders a password input by default', () => {
    render(<PasswordInput data-testid="password" />);
    const input = screen.getByTestId('password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('toggles to text when show button clicked', () => {
    render(<PasswordInput data-testid="password" />);
    const input = screen.getByTestId('password');
    const toggleButton = screen.getByRole('button', { name: /show password/i });

    expect(input).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
  });

  it('toggles back to password when hide button clicked', () => {
    render(<PasswordInput data-testid="password" />);
    const input = screen.getByTestId('password');
    const toggleButton = screen.getByRole('button', { name: /show password/i });

    fireEvent.click(toggleButton); // Show
    expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();

    fireEvent.click(toggleButton); // Hide
    expect(input).toHaveAttribute('type', 'password');
  });

  it('shows "Show" text initially', () => {
    render(<PasswordInput />);
    expect(screen.getByRole('button')).toHaveTextContent('Show');
  });

  it('shows "Hide" text when visible', () => {
    render(<PasswordInput />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveTextContent('Hide');
  });

  it('hides toggle when showToggle is false', () => {
    render(<PasswordInput showToggle={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies form-input class', () => {
    render(<PasswordInput data-testid="password" />);
    expect(screen.getByTestId('password')).toHaveClass('form-input');
  });

  it('applies error class when error prop is true', () => {
    render(<PasswordInput data-testid="password" error />);
    expect(screen.getByTestId('password')).toHaveClass('form-input-error');
  });

  it('does not apply error class when error is false', () => {
    render(<PasswordInput data-testid="password" error={false} />);
    expect(screen.getByTestId('password')).not.toHaveClass('form-input-error');
  });

  it('applies custom className', () => {
    render(<PasswordInput data-testid="password" className="custom-class" />);
    expect(screen.getByTestId('password')).toHaveClass('custom-class');
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(<PasswordInput data-testid="password" onChange={handleChange} />);

    fireEvent.change(screen.getByTestId('password'), { target: { value: 'secret' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('supports placeholder', () => {
    render(<PasswordInput placeholder="Enter password" />);
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
  });

  it('supports disabled state', () => {
    render(<PasswordInput data-testid="password" disabled />);
    expect(screen.getByTestId('password')).toBeDisabled();
  });

  it('wraps input in password-input-wrapper', () => {
    const { container } = render(<PasswordInput />);
    expect(container.querySelector('.password-input-wrapper')).toBeInTheDocument();
  });
});
