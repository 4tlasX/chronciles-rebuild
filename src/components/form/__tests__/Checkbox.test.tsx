import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from '../Checkbox';

describe('Checkbox', () => {
  it('renders a checkbox', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('applies form-checkbox class', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toHaveClass('form-checkbox');
  });

  it('renders with label', () => {
    render(<Checkbox label="Accept terms" id="terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
    expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
  });

  it('handles change events', () => {
    const handleChange = vi.fn();
    render(<Checkbox onChange={handleChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalled();
  });

  it('can be checked by default', () => {
    render(<Checkbox defaultChecked />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('can be unchecked by default', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('can be disabled', () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('supports name attribute', () => {
    render(<Checkbox name="agree" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('name', 'agree');
  });

  it('supports custom className', () => {
    render(<Checkbox className="custom-checkbox" />);
    expect(screen.getByRole('checkbox')).toHaveClass('custom-checkbox');
  });

  it('associates label with checkbox via id', () => {
    render(<Checkbox id="my-checkbox" label="My Label" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('id', 'my-checkbox');
    expect(screen.getByLabelText('My Label')).toBe(checkbox);
  });
});
