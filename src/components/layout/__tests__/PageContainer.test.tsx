import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageContainer } from '../PageContainer';

describe('PageContainer', () => {
  it('renders children', () => {
    render(
      <PageContainer>
        <div data-testid="content">Page content</div>
      </PageContainer>
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('applies container class', () => {
    const { container } = render(<PageContainer>Content</PageContainer>);
    expect(container.firstChild).toHaveClass('container');
  });
});
