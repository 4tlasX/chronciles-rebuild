import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies primary variant by default', () => {
    render(<Button>Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn', 'btn-primary');
  });

  it('applies secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn', 'btn-secondary');
  });

  it('applies danger variant', () => {
    render(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn', 'btn-danger');
  });

  it('applies small size', () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-sm');
  });

  it('applies large size', () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-lg');
  });

  it('does not apply size class for medium (default)', () => {
    render(<Button size="md">Medium</Button>);
    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('btn-md');
    expect(button).not.toHaveClass('btn-sm');
    expect(button).not.toHaveClass('btn-lg');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('supports custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('supports type attribute', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
