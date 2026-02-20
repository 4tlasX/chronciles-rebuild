import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextInput } from '../TextInput';

describe('TextInput', () => {
  it('renders a text input', () => {
    render(<TextInput />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
  });

  it('applies form-input class', () => {
    render(<TextInput />);
    expect(screen.getByRole('textbox')).toHaveClass('form-input');
  });

  it('applies error class when error prop is true', () => {
    render(<TextInput error />);
    expect(screen.getByRole('textbox')).toHaveClass('form-input-error');
  });

  it('does not apply error class when error prop is false', () => {
    render(<TextInput error={false} />);
    expect(screen.getByRole('textbox')).not.toHaveClass('form-input-error');
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(<TextInput onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('supports placeholder', () => {
    render(<TextInput placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('supports name attribute', () => {
    render(<TextInput name="username" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'username');
  });

  it('supports defaultValue', () => {
    render(<TextInput defaultValue="initial" />);
    expect(screen.getByRole('textbox')).toHaveValue('initial');
  });

  it('supports custom className', () => {
    render(<TextInput className="custom-input" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-input');
  });

  it('can be required', () => {
    render(<TextInput required />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });

  it('can be disabled', () => {
    render(<TextInput disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('can be readonly', () => {
    render(<TextInput readOnly />);
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
  });
});
