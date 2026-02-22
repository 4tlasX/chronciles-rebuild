import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TopicEditForm } from '../TopicEditForm';
import type { Taxonomy } from '@/lib/db';

// Mock the server action
vi.mock('../actions', () => ({
  updateTopicAction: vi.fn(),
}));

describe('TopicEditForm', () => {
  const mockTopic: Taxonomy = {
    id: 1,
    name: 'Technology',
    icon: '💻',
    color: '#3B82F6',
  };

  it('renders edit button initially', () => {
    render(<TopicEditForm topic={mockTopic} email="test@example.com" />);
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('does not show form initially', () => {
    render(<TopicEditForm topic={mockTopic} email="test@example.com" />);
    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
  });

  it('shows form when edit button is clicked', () => {
    render(<TopicEditForm topic={mockTopic} email="test@example.com" />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('pre-fills form with topic data', () => {
    render(<TopicEditForm topic={mockTopic} email="test@example.com" />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByLabelText(/name/i)).toHaveValue('Technology');
    expect(screen.getByLabelText(/icon/i)).toHaveValue('💻');
  });

  it('shows cancel button when form is open', () => {
    render(<TopicEditForm topic={mockTopic} email="test@example.com" />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('hides form when cancel is clicked', () => {
    render(<TopicEditForm topic={mockTopic} email="test@example.com" />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
  });

  it('shows save changes button', () => {
    render(<TopicEditForm topic={mockTopic} email="test@example.com" />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
  });
});
