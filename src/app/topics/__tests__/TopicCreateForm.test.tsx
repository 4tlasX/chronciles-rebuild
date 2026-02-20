import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopicCreateForm } from '../TopicCreateForm';

// Mock the server action
vi.mock('../actions', () => ({
  createTopicAction: vi.fn(),
}));

describe('TopicCreateForm', () => {
  it('renders form panel with title', () => {
    render(<TopicCreateForm email="test@example.com" />);
    expect(screen.getByText('Create New Topic')).toBeInTheDocument();
  });

  it('renders topic form', () => {
    render(<TopicCreateForm email="test@example.com" />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('renders submit button with correct label', () => {
    render(<TopicCreateForm email="test@example.com" />);
    expect(screen.getByRole('button', { name: 'Create Topic' })).toBeInTheDocument();
  });

  it('renders icon input', () => {
    render(<TopicCreateForm email="test@example.com" />);
    expect(screen.getByLabelText(/icon/i)).toBeInTheDocument();
  });

  it('renders color input', () => {
    render(<TopicCreateForm email="test@example.com" />);
    expect(screen.getByLabelText(/color/i)).toBeInTheDocument();
  });
});
