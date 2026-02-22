import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopicCreateForm } from '../TopicCreateForm';

// Mock the server action
vi.mock('../actions', () => ({
  createTopicAction: vi.fn(),
}));

describe('TopicCreateForm', () => {
  it('renders form panel with title', () => {
    render(<TopicCreateForm />);
    expect(screen.getByText('Create New Topic')).toBeInTheDocument();
  });

  it('renders topic form', () => {
    render(<TopicCreateForm />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('renders submit button with correct label', () => {
    render(<TopicCreateForm />);
    expect(screen.getByRole('button', { name: 'Create Topic' })).toBeInTheDocument();
  });

  it('renders icon input', () => {
    render(<TopicCreateForm />);
    expect(screen.getByLabelText(/icon/i)).toBeInTheDocument();
  });
});
