import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmailInput } from '../EmailInput';

describe('EmailInput', () => {
  it('renders an email input', () => {
    render(<EmailInput />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'email');
  });

  it('applies form-input class', () => {
    render(<EmailInput />);
    expect(screen.getByRole('textbox')).toHaveClass('form-input');
  });

  it('applies error class when error prop is true', () => {
    render(<EmailInput error />);
    expect(screen.getByRole('textbox')).toHaveClass('form-input-error');
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(<EmailInput onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test@example.com' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('supports placeholder', () => {
    render(<EmailInput placeholder="Enter email" />);
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('supports name attribute', () => {
    render(<EmailInput name="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'email');
  });
});
