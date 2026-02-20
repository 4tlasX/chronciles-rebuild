import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostForm } from '../PostForm';
import type { Post } from '@/lib/db';

describe('PostForm', () => {
  const mockOnSubmit = vi.fn();

  it('renders content textarea', () => {
    render(<PostForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
  });

  it('renders metadata section', () => {
    render(<PostForm onSubmit={mockOnSubmit} />);
    expect(screen.getByText('Metadata')).toBeInTheDocument();
  });

  it('renders add metadata button', () => {
    render(<PostForm onSubmit={mockOnSubmit} />);
    expect(screen.getByRole('button', { name: /add metadata field/i })).toBeInTheDocument();
  });

  it('renders submit button with default label', () => {
    render(<PostForm onSubmit={mockOnSubmit} />);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('renders submit button with custom label', () => {
    render(<PostForm onSubmit={mockOnSubmit} submitLabel="Create Post" />);
    expect(screen.getByRole('button', { name: 'Create Post' })).toBeInTheDocument();
  });

  it('renders cancel button when onCancel provided', () => {
    const onCancel = vi.fn();
    render(<PostForm onSubmit={mockOnSubmit} onCancel={onCancel} />);
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('does not render cancel button when onCancel not provided', () => {
    render(<PostForm onSubmit={mockOnSubmit} />);
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
  });

  it('pre-fills content when post is provided', () => {
    const post: Post = {
      id: 1,
      content: 'Existing content',
      metadata: {},
      createdAt: new Date(),
    };
    render(<PostForm post={post} onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/content/i)).toHaveValue('Existing content');
  });

  it('pre-fills metadata when post has metadata', () => {
    const post: Post = {
      id: 1,
      content: 'Content',
      metadata: { featured: true, category: 'tech' },
      createdAt: new Date(),
    };
    render(<PostForm post={post} onSubmit={mockOnSubmit} />);
    // Check that key-value inputs are rendered
    const inputs = screen.getAllByRole('textbox');
    // Content textarea + 4 inputs (2 key-value pairs × 2 inputs each)
    expect(inputs.length).toBeGreaterThanOrEqual(5);
  });

  it('includes hidden id field when editing', () => {
    const post: Post = {
      id: 42,
      content: 'Content',
      metadata: {},
      createdAt: new Date(),
    };
    const { container } = render(<PostForm post={post} onSubmit={mockOnSubmit} />);
    const hiddenInput = container.querySelector('input[name="id"]');
    expect(hiddenInput).toHaveValue('42');
  });

  it('does not include id field when creating', () => {
    const { container } = render(<PostForm onSubmit={mockOnSubmit} />);
    const hiddenInput = container.querySelector('input[name="id"]');
    expect(hiddenInput).not.toBeInTheDocument();
  });

  it('content textarea is required', () => {
    render(<PostForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/content/i)).toBeRequired();
  });

  it('applies post-form class', () => {
    const { container } = render(<PostForm onSubmit={mockOnSubmit} />);
    expect(container.querySelector('form')).toHaveClass('post-form');
  });
});
