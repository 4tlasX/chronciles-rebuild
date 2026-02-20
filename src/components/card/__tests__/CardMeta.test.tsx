import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardMeta } from '../CardMeta';

describe('CardMeta', () => {
  it('renders children', () => {
    render(<CardMeta>Meta info</CardMeta>);
    expect(screen.getByText('Meta info')).toBeInTheDocument();
  });

  it('renders as span element', () => {
    const { container } = render(<CardMeta>Meta</CardMeta>);
    expect(container.firstChild?.nodeName).toBe('SPAN');
  });

  it('applies card-meta class', () => {
    const { container } = render(<CardMeta>Meta</CardMeta>);
    expect(container.firstChild).toHaveClass('card-meta');
  });

  it('applies custom className', () => {
    const { container } = render(<CardMeta className="custom">Meta</CardMeta>);
    expect(container.firstChild).toHaveClass('card-meta', 'custom');
  });
});
