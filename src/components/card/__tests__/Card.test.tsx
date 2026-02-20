import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  it('renders children', () => {
    render(
      <Card>
        <span data-testid="content">Card content</span>
      </Card>
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('applies card class', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild).toHaveClass('card');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom">Content</Card>);
    expect(container.firstChild).toHaveClass('card', 'custom');
  });

  it('applies card-no-padding class when noPadding is true', () => {
    const { container } = render(<Card noPadding>Content</Card>);
    expect(container.firstChild).toHaveClass('card-no-padding');
  });

  it('does not apply card-no-padding class by default', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild).not.toHaveClass('card-no-padding');
  });

  it('renders multiple children', () => {
    render(
      <Card>
        <div data-testid="child1">First</div>
        <div data-testid="child2">Second</div>
      </Card>
    );
    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
  });
});
