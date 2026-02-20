import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopicTag } from '../TopicTag';
import type { Taxonomy } from '@/lib/db';

describe('TopicTag', () => {
  const mockTopic: Taxonomy = {
    id: 1,
    name: 'JavaScript',
    icon: '📜',
    color: '#F7DF1E',
  };

  it('renders topic name', () => {
    render(<TopicTag topic={mockTopic} />);
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  it('renders topic icon', () => {
    render(<TopicTag topic={mockTopic} />);
    expect(screen.getByText('📜')).toBeInTheDocument();
  });

  it('applies tag class', () => {
    const { container } = render(<TopicTag topic={mockTopic} />);
    expect(container.firstChild).toHaveClass('tag');
  });

  it('applies custom className', () => {
    const { container } = render(<TopicTag topic={mockTopic} className="custom" />);
    expect(container.firstChild).toHaveClass('tag', 'custom');
  });

  it('applies background color when topic has color', () => {
    const { container } = render(<TopicTag topic={mockTopic} />);
    expect(container.firstChild).toHaveStyle({ backgroundColor: '#F7DF1E' });
  });

  it('does not apply inline styles when topic has no color', () => {
    const topicNoColor: Taxonomy = { ...mockTopic, color: null };
    const { container } = render(<TopicTag topic={topicNoColor} />);
    expect(container.firstChild).not.toHaveStyle({ backgroundColor: '#F7DF1E' });
  });

  it('renders without icon when icon is null', () => {
    const topicNoIcon: Taxonomy = { ...mockTopic, icon: null };
    render(<TopicTag topic={topicNoIcon} />);
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
