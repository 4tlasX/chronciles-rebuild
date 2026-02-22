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

  it('renders topic selector', () => {
    render(<PostForm onSubmit={mockOnSubmit} />);
    expect(screen.getByText('Topic')).toBeInTheDocument();
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

  it('does not show specialized fields when no taxonomy selected', () => {
    render(<PostForm onSubmit={mockOnSubmit} />);
    expect(screen.queryByText('Task Settings')).not.toBeInTheDocument();
    expect(screen.queryByText('Goal Settings')).not.toBeInTheDocument();
  });

  it('shows specialized fields when taxonomy with specialized fields is selected', () => {
    const taxonomies = [
      { id: 1, name: 'Task', icon: 'circle-check', color: '#ff0000' },
    ];
    render(
      <PostForm
        onSubmit={mockOnSubmit}
        taxonomies={taxonomies}
        initialTaxonomyId={1}
      />
    );
    expect(screen.getByText('Task Settings')).toBeInTheDocument();
  });

  it('does not show specialized fields for taxonomy without them', () => {
    const taxonomies = [
      { id: 1, name: 'Idea', icon: 'lightbulb', color: '#ffcc00' },
    ];
    render(
      <PostForm
        onSubmit={mockOnSubmit}
        taxonomies={taxonomies}
        initialTaxonomyId={1}
      />
    );
    expect(screen.queryByText('Task Settings')).not.toBeInTheDocument();
    expect(screen.queryByText('Event Details')).not.toBeInTheDocument();
  });

  it('shows custom fields section when no taxonomy selected', () => {
    render(<PostForm onSubmit={mockOnSubmit} />);
    expect(screen.getByText('Custom Fields')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add field/i })).toBeInTheDocument();
  });

  it('shows custom fields for taxonomy without specialized fields', () => {
    const taxonomies = [
      { id: 1, name: 'Quote', icon: 'quote-left', color: '#9900ff' },
    ];
    render(
      <PostForm
        onSubmit={mockOnSubmit}
        taxonomies={taxonomies}
        initialTaxonomyId={1}
      />
    );
    expect(screen.getByText('Custom Fields')).toBeInTheDocument();
  });

  it('does not show custom fields section when specialized taxonomy selected', () => {
    const taxonomies = [
      { id: 1, name: 'Task', icon: 'circle-check', color: '#ff0000' },
    ];
    render(
      <PostForm
        onSubmit={mockOnSubmit}
        taxonomies={taxonomies}
        initialTaxonomyId={1}
      />
    );
    expect(screen.queryByText('Custom Fields')).not.toBeInTheDocument();
  });

  it('shows existing custom metadata but filters out specialized fields', () => {
    const post: Post = {
      id: 1,
      content: 'Content',
      metadata: {
        myCustomField: 'custom value',
        startDate: '2025-01-01', // specialized field - should be filtered
        notes: 'some notes', // specialized field - should be filtered
      },
      createdAt: new Date(),
    };
    const taxonomies = [
      { id: 1, name: 'Quote', icon: 'quote-left', color: '#9900ff' },
    ];
    render(
      <PostForm
        post={post}
        onSubmit={mockOnSubmit}
        taxonomies={taxonomies}
        initialTaxonomyId={1}
      />
    );
    // Should show the custom field
    expect(screen.getByDisplayValue('myCustomField')).toBeInTheDocument();
    expect(screen.getByDisplayValue('custom value')).toBeInTheDocument();
    // Should NOT show specialized fields
    expect(screen.queryByDisplayValue('startDate')).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue('notes')).not.toBeInTheDocument();
  });
});
