import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Radio } from '../Radio';

describe('Radio', () => {
  it('renders a radio button', () => {
    render(<Radio />);
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('applies form-radio class', () => {
    render(<Radio />);
    expect(screen.getByRole('radio')).toHaveClass('form-radio');
  });

  it('renders with label', () => {
    render(<Radio label="Option A" id="option-a" />);
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByLabelText('Option A')).toBeInTheDocument();
  });

  it('handles change events', () => {
    const handleChange = vi.fn();
    render(<Radio onChange={handleChange} />);
    fireEvent.click(screen.getByRole('radio'));
    expect(handleChange).toHaveBeenCalled();
  });

  it('can be checked by default', () => {
    render(<Radio defaultChecked />);
    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('can be disabled', () => {
    render(<Radio disabled />);
    expect(screen.getByRole('radio')).toBeDisabled();
  });

  it('supports name attribute for grouping', () => {
    render(<Radio name="choice" />);
    expect(screen.getByRole('radio')).toHaveAttribute('name', 'choice');
  });

  it('supports value attribute', () => {
    render(<Radio value="option1" />);
    expect(screen.getByRole('radio')).toHaveAttribute('value', 'option1');
  });

  it('supports custom className', () => {
    render(<Radio className="custom-radio" />);
    expect(screen.getByRole('radio')).toHaveClass('custom-radio');
  });
});
