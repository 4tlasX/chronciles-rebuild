import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopicTag } from '../TopicTag';
import type { Taxonomy } from '@/lib/db';

describe('TopicTag', () => {
  const mockTopic: Taxonomy = {
    id: 1,
    name: 'JavaScript',
    icon: 'code',
    color: '#F7DF1E',
  };

  it('renders topic name', () => {
    render(<TopicTag topic={mockTopic} />);
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  it('renders topic icon as SVG', () => {
    const { container } = render(<TopicTag topic={mockTopic} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('role', 'img');
  });

  it('applies tag class', () => {
    const { container } = render(<TopicTag topic={mockTopic} />);
    expect(container.firstChild).toHaveClass('tag');
  });

  it('applies custom className', () => {
    const { container } = render(<TopicTag topic={mockTopic} className="custom" />);
    expect(container.firstChild).toHaveClass('tag', 'custom');
  });

  it('renders icon using accent color (no inline background)', () => {
    const { container } = render(<TopicTag topic={mockTopic} />);
    const svg = container.querySelector('svg');
    // TopicTag now uses TopicIcon which fills with accent color
    expect(svg).toHaveAttribute('fill', 'var(--accent-color)');
  });

  it('does not apply inline backgroundColor styles', () => {
    const topicNoColor: Taxonomy = { ...mockTopic, color: null };
    const { container } = render(<TopicTag topic={topicNoColor} />);
    const tag = container.firstChild as HTMLElement;
    // TopicTag no longer applies background color
    expect(tag.style.backgroundColor).toBe('');
  });

  it('renders dot fallback when icon is null', () => {
    const topicNoIcon: Taxonomy = { ...mockTopic, icon: null };
    const { container } = render(<TopicTag topic={topicNoIcon} />);
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    // When icon is null, TopicIcon renders a dot fallback
    const dot = container.querySelector('.topic-icon');
    expect(dot).toBeInTheDocument();
    expect(dot?.tagName.toLowerCase()).toBe('span');
  });
});
