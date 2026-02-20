import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardBody } from '../CardBody';

describe('CardBody', () => {
  it('renders children', () => {
    render(
      <CardBody>
        <p data-testid="content">Body content</p>
      </CardBody>
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('applies card-body class', () => {
    const { container } = render(<CardBody>Content</CardBody>);
    expect(container.firstChild).toHaveClass('card-body');
  });

  it('applies custom className', () => {
    const { container } = render(<CardBody className="custom">Content</CardBody>);
    expect(container.firstChild).toHaveClass('card-body', 'custom');
  });
});
