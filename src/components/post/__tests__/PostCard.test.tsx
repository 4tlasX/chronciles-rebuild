import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostCard } from '../PostCard';
import type { Post } from '@/lib/db';

describe('PostCard', () => {
  const mockPost: Post = {
    id: 1,
    content: 'This is my post content',
    metadata: { featured: true },
    createdAt: new Date('2024-03-15T12:00:00Z'),
  };

  it('renders post ID in title', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('Post #1')).toBeInTheDocument();
  });

  it('renders post content', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('This is my post content')).toBeInTheDocument();
  });

  it('renders post date', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByRole('time')).toBeInTheDocument();
  });

  it('renders metadata by default', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('featured:')).toBeInTheDocument();
  });

  it('hides metadata when showMeta is false', () => {
    render(<PostCard post={mockPost} showMeta={false} />);
    expect(screen.queryByText('featured:')).not.toBeInTheDocument();
  });

  it('does not render metadata section when metadata is empty', () => {
    const postNoMeta: Post = { ...mockPost, metadata: {} };
    const { container } = render(<PostCard post={postNoMeta} />);
    expect(container.querySelector('.post-meta')).not.toBeInTheDocument();
  });

  it('renders inside a Card', () => {
    const { container } = render(<PostCard post={mockPost} />);
    expect(container.querySelector('.card')).toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    render(
      <PostCard
        post={mockPost}
        actions={<button data-testid="action">Edit</button>}
      />
    );
    expect(screen.getByTestId('action')).toBeInTheDocument();
  });

  it('does not render CardActions when no actions provided', () => {
    const { container } = render(<PostCard post={mockPost} />);
    expect(container.querySelector('.card-actions')).not.toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(
      <PostCard
        post={mockPost}
        footer={<div data-testid="footer">Footer content</div>}
      />
    );
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('does not render CardFooter when no footer provided', () => {
    const { container } = render(<PostCard post={mockPost} />);
    expect(container.querySelector('.card-footer')).not.toBeInTheDocument();
  });
});
