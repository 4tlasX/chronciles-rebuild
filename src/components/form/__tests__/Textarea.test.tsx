import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Textarea } from '../Textarea';

describe('Textarea', () => {
  it('renders a textarea', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('applies form-textarea class', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox')).toHaveClass('form-textarea');
  });

  it('applies error class when error prop is true', () => {
    render(<Textarea error />);
    expect(screen.getByRole('textbox')).toHaveClass('form-textarea-error');
  });

  it('does not apply error class when error prop is false', () => {
    render(<Textarea error={false} />);
    expect(screen.getByRole('textbox')).not.toHaveClass('form-textarea-error');
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(<Textarea onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test content' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('supports placeholder', () => {
    render(<Textarea placeholder="Enter content" />);
    expect(screen.getByPlaceholderText('Enter content')).toBeInTheDocument();
  });

  it('supports name attribute', () => {
    render(<Textarea name="content" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'content');
  });

  it('supports defaultValue', () => {
    render(<Textarea defaultValue="initial content" />);
    expect(screen.getByRole('textbox')).toHaveValue('initial content');
  });

  it('supports rows attribute', () => {
    render(<Textarea rows={5} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
  });

  it('can be required', () => {
    render(<Textarea required />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });

  it('can be disabled', () => {
    render(<Textarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
