import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopicForm } from '../TopicForm';
import type { Taxonomy } from '@/lib/db';

describe('TopicForm', () => {
  const mockOnSubmit = vi.fn();

  it('renders name input', () => {
    render(<TopicForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('renders icon input', () => {
    render(<TopicForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/icon/i)).toBeInTheDocument();
  });

  it('renders submit button with default label', () => {
    render(<TopicForm onSubmit={mockOnSubmit} />);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('renders submit button with custom label', () => {
    render(<TopicForm onSubmit={mockOnSubmit} submitLabel="Create Topic" />);
    expect(screen.getByRole('button', { name: 'Create Topic' })).toBeInTheDocument();
  });

  it('renders cancel button when onCancel provided', () => {
    const onCancel = vi.fn();
    render(<TopicForm onSubmit={mockOnSubmit} onCancel={onCancel} />);
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('does not render cancel button when onCancel not provided', () => {
    render(<TopicForm onSubmit={mockOnSubmit} />);
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
  });

  it('pre-fills form when topic is provided', () => {
    const topic: Taxonomy = {
      id: 1,
      name: 'Technology',
      icon: 'code',
      color: '#3B82F6',
    };
    render(<TopicForm topic={topic} onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/name/i)).toHaveValue('Technology');
    expect(screen.getByLabelText(/icon/i)).toHaveValue('code');
  });

  it('includes hidden id field when editing', () => {
    const topic: Taxonomy = { id: 42, name: 'Test', icon: null, color: null };
    const { container } = render(<TopicForm topic={topic} onSubmit={mockOnSubmit} />);
    const hiddenInput = container.querySelector('input[name="id"]');
    expect(hiddenInput).toHaveValue('42');
  });

  it('does not include id field when creating', () => {
    const { container } = render(<TopicForm onSubmit={mockOnSubmit} />);
    const hiddenInput = container.querySelector('input[name="id"]');
    expect(hiddenInput).not.toBeInTheDocument();
  });

  it('name input is required', () => {
    render(<TopicForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/name/i)).toBeRequired();
  });

  it('applies topic-form class', () => {
    const { container } = render(<TopicForm onSubmit={mockOnSubmit} />);
    expect(container.querySelector('form')).toHaveClass('topic-form');
  });
});
