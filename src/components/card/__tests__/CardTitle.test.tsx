import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardTitle } from '../CardTitle';

describe('CardTitle', () => {
  it('renders children', () => {
    render(<CardTitle>My Title</CardTitle>);
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('renders as h3 element', () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('applies card-title class', () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByRole('heading')).toHaveClass('card-title');
  });

  it('applies custom className', () => {
    render(<CardTitle className="custom">Title</CardTitle>);
    expect(screen.getByRole('heading')).toHaveClass('card-title', 'custom');
  });
});
