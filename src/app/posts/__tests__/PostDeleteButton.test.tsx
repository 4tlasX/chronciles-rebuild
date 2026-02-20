import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostDeleteButton } from '../PostDeleteButton';

// Mock the server action
vi.mock('../actions', () => ({
  deletePostAction: vi.fn(),
}));

describe('PostDeleteButton', () => {
  it('renders delete button', () => {
    render(<PostDeleteButton postId={1} email="test@example.com" />);
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('renders button with danger variant styling', () => {
    render(<PostDeleteButton postId={1} email="test@example.com" />);
    expect(screen.getByRole('button')).toHaveClass('btn-danger');
  });

  it('renders inside a form', () => {
    const { container } = render(<PostDeleteButton postId={1} email="test@example.com" />);
    expect(container.querySelector('form')).toBeInTheDocument();
  });
});
