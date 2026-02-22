import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostCreateForm } from '../PostCreateForm';

// Mock the server action
vi.mock('../actions', () => ({
  createPostAction: vi.fn(),
}));

describe('PostCreateForm', () => {
  it('renders form panel with title', () => {
    render(<PostCreateForm email="test@example.com" />);
    expect(screen.getByText('Create New Post')).toBeInTheDocument();
  });

  it('renders post form', () => {
    render(<PostCreateForm email="test@example.com" />);
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
  });

  it('renders submit button with correct label', () => {
    render(<PostCreateForm email="test@example.com" />);
    expect(screen.getByRole('button', { name: 'Create Post' })).toBeInTheDocument();
  });

  it('renders add metadata button', () => {
    render(<PostCreateForm email="test@example.com" />);
    expect(screen.getByRole('button', { name: /add metadata field/i })).toBeInTheDocument();
  });
});
