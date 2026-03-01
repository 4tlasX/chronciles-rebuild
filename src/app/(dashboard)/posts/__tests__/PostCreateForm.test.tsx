import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostCreateForm } from '../PostCreateForm';

// Mock the server action
vi.mock('../actions', () => ({
  createPostAction: vi.fn(),
}));

// Mock the encryption hook
vi.mock('@/components/encryption', () => ({
  useEncryption: () => ({
    isUnlocked: false,
    encryptPost: vi.fn(),
  }),
}));

describe('PostCreateForm', () => {
  it('renders form panel with title', () => {
    render(<PostCreateForm />);
    expect(screen.getByText('Create New Post')).toBeInTheDocument();
  });

  it('renders post form', () => {
    render(<PostCreateForm />);
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
  });

  it('renders submit button with correct label', () => {
    render(<PostCreateForm />);
    expect(screen.getByRole('button', { name: 'Create Post' })).toBeInTheDocument();
  });

  it('renders add field button', () => {
    render(<PostCreateForm />);
    expect(screen.getByRole('button', { name: /add field/i })).toBeInTheDocument();
  });
});
