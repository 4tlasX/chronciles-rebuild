import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('renders message', () => {
    render(<EmptyState message="No items found" />);
    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('renders inside a Card', () => {
    const { container } = render(<EmptyState message="Empty" />);
    expect(container.querySelector('.card')).toBeInTheDocument();
  });

  it('applies empty-state class', () => {
    const { container } = render(<EmptyState message="Empty" />);
    expect(container.querySelector('.empty-state')).toBeInTheDocument();
  });
});
