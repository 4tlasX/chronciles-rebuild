import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardActions } from '../CardActions';

describe('CardActions', () => {
  it('renders children', () => {
    render(
      <CardActions>
        <button>Action 1</button>
        <button>Action 2</button>
      </CardActions>
    );
    expect(screen.getByText('Action 1')).toBeInTheDocument();
    expect(screen.getByText('Action 2')).toBeInTheDocument();
  });

  it('applies card-actions class', () => {
    const { container } = render(<CardActions><button>Action</button></CardActions>);
    expect(container.firstChild).toHaveClass('card-actions');
  });

  it('applies custom className', () => {
    const { container } = render(
      <CardActions className="custom"><button>Action</button></CardActions>
    );
    expect(container.firstChild).toHaveClass('card-actions', 'custom');
  });
});
