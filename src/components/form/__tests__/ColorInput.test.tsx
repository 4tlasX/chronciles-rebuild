import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ColorInput } from '../ColorInput';

describe('ColorInput', () => {
  it('renders a color input', () => {
    const { container } = render(<ColorInput />);
    const input = container.querySelector('input[type="color"]');
    expect(input).toBeInTheDocument();
  });

  it('applies form-color class', () => {
    const { container } = render(<ColorInput />);
    const input = container.querySelector('input[type="color"]');
    expect(input).toHaveClass('form-color');
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    const { container } = render(<ColorInput onChange={handleChange} />);
    const input = container.querySelector('input[type="color"]')!;
    fireEvent.change(input, { target: { value: '#ff0000' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('supports defaultValue', () => {
    const { container } = render(<ColorInput defaultValue="#3B82F6" />);
    const input = container.querySelector('input[type="color"]');
    expect(input).toHaveValue('#3b82f6');
  });

  it('supports name attribute', () => {
    const { container } = render(<ColorInput name="color" />);
    const input = container.querySelector('input[type="color"]');
    expect(input).toHaveAttribute('name', 'color');
  });

  it('supports custom className', () => {
    const { container } = render(<ColorInput className="custom-color" />);
    const input = container.querySelector('input[type="color"]');
    expect(input).toHaveClass('custom-color');
  });

  it('can be disabled', () => {
    const { container } = render(<ColorInput disabled />);
    const input = container.querySelector('input[type="color"]');
    expect(input).toBeDisabled();
  });
});
