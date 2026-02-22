import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopicCard } from '../TopicCard';
import type { Taxonomy } from '@/lib/db';

describe('TopicCard', () => {
  const mockTopic: Taxonomy = {
    id: 1,
    name: 'Technology',
    icon: 'code',
    color: '#3B82F6',
  };

  it('renders topic name', () => {
    render(<TopicCard topic={mockTopic} />);
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('renders topic icon as SVG', () => {
    const { container } = render(<TopicCard topic={mockTopic} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('role', 'img');
  });

  it('renders topic ID', () => {
    render(<TopicCard topic={mockTopic} />);
    expect(screen.getByText('ID: 1')).toBeInTheDocument();
  });

  it('renders inside a Card', () => {
    const { container } = render(<TopicCard topic={mockTopic} />);
    expect(container.querySelector('.card')).toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    render(
      <TopicCard
        topic={mockTopic}
        actions={<button data-testid="action">Edit</button>}
      />
    );
    expect(screen.getByTestId('action')).toBeInTheDocument();
  });

  it('does not render CardActions when no actions provided', () => {
    const { container } = render(<TopicCard topic={mockTopic} />);
    expect(container.querySelector('.card-actions')).not.toBeInTheDocument();
  });

  it('handles topic without icon', () => {
    const topicNoIcon: Taxonomy = { ...mockTopic, icon: null };
    const { container } = render(<TopicCard topic={topicNoIcon} />);
    expect(screen.getByText('Technology')).toBeInTheDocument();
    // When icon is null, TopicIcon renders a dot fallback
    const dot = container.querySelector('.topic-icon');
    expect(dot).toBeInTheDocument();
    expect(dot?.tagName.toLowerCase()).toBe('span');
  });

  it('handles topic without color', () => {
    const topicNoColor: Taxonomy = { ...mockTopic, color: null };
    const { container } = render(<TopicCard topic={topicNoColor} />);
    expect(container.querySelector('.color-swatch')).not.toBeInTheDocument();
  });
});
