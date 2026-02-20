import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardHeader } from '../CardHeader';

describe('CardHeader', () => {
  it('renders children', () => {
    render(
      <CardHeader>
        <span data-testid="content">Header content</span>
      </CardHeader>
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('applies card-header class', () => {
    const { container } = render(<CardHeader>Content</CardHeader>);
    expect(container.firstChild).toHaveClass('card-header');
  });

  it('applies custom className', () => {
    const { container } = render(<CardHeader className="custom">Content</CardHeader>);
    expect(container.firstChild).toHaveClass('card-header', 'custom');
  });
});
