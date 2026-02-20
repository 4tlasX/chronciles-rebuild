import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopicDeleteButton } from '../TopicDeleteButton';

// Mock the server action
vi.mock('../actions', () => ({
  deleteTopicAction: vi.fn(),
}));

describe('TopicDeleteButton', () => {
  it('renders delete button', () => {
    render(<TopicDeleteButton topicId={1} email="test@example.com" />);
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('renders button with danger variant styling', () => {
    render(<TopicDeleteButton topicId={1} email="test@example.com" />);
    expect(screen.getByRole('button')).toHaveClass('btn-danger');
  });

  it('renders inside a form', () => {
    const { container } = render(<TopicDeleteButton topicId={1} email="test@example.com" />);
    expect(container.querySelector('form')).toBeInTheDocument();
  });
});
