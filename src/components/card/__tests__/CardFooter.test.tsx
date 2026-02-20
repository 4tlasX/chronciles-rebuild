import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardFooter } from '../CardFooter';

describe('CardFooter', () => {
  it('renders children', () => {
    render(
      <CardFooter>
        <span data-testid="content">Footer content</span>
      </CardFooter>
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('applies card-footer class', () => {
    const { container } = render(<CardFooter>Content</CardFooter>);
    expect(container.firstChild).toHaveClass('card-footer');
  });

  it('applies custom className', () => {
    const { container } = render(<CardFooter className="custom">Content</CardFooter>);
    expect(container.firstChild).toHaveClass('card-footer', 'custom');
  });
});
