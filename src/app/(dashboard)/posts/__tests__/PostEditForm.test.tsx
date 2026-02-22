import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PostEditForm } from '../PostEditForm';
import type { Post } from '@/lib/db';

// Mock the server action
vi.mock('../actions', () => ({
  updatePostAction: vi.fn(),
}));

describe('PostEditForm', () => {
  const mockPost: Post = {
    id: 1,
    content: 'Test content',
    metadata: { featured: true },
    createdAt: new Date(),
  };

  it('renders edit button initially', () => {
    render(<PostEditForm post={mockPost} />);
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('does not show form initially', () => {
    render(<PostEditForm post={mockPost} />);
    expect(screen.queryByLabelText(/content/i)).not.toBeInTheDocument();
  });

  it('shows form when edit button is clicked', () => {
    render(<PostEditForm post={mockPost} />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
  });

  it('pre-fills form with post content', () => {
    render(<PostEditForm post={mockPost} />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByLabelText(/content/i)).toHaveValue('Test content');
  });

  it('shows cancel button when form is open', () => {
    render(<PostEditForm post={mockPost} />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('hides form when cancel is clicked', () => {
    render(<PostEditForm post={mockPost} />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByLabelText(/content/i)).not.toBeInTheDocument();
  });

  it('shows save button', () => {
    render(<PostEditForm post={mockPost} />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });
});
