import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageHeader } from '../PageHeader';

describe('PageHeader', () => {
  it('renders title', () => {
    render(<PageHeader title="My Page" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('My Page');
  });

  it('applies page-header class', () => {
    const { container } = render(<PageHeader title="Title" />);
    expect(container.firstChild).toHaveClass('page-header');
  });

  it('renders actions when provided', () => {
    render(
      <PageHeader
        title="Title"
        actions={<button data-testid="action">Action</button>}
      />
    );
    expect(screen.getByTestId('action')).toBeInTheDocument();
  });

  it('does not render actions container when no actions provided', () => {
    const { container } = render(<PageHeader title="Title" />);
    expect(container.querySelector('.page-header-actions')).not.toBeInTheDocument();
  });

  it('renders actions inside page-header-actions container', () => {
    const { container } = render(
      <PageHeader title="Title" actions={<button>Click</button>} />
    );
    expect(container.querySelector('.page-header-actions')).toBeInTheDocument();
  });
});
