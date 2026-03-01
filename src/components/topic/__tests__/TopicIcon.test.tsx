import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopicIcon } from '../TopicIcon';

describe('TopicIcon', () => {
  it('renders SVG icon when valid icon name provided', () => {
    const { container } = render(<TopicIcon icon="check" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-label', 'topic icon');
  });

  it('renders dot fallback when icon is null', () => {
    const { container } = render(<TopicIcon icon={null} />);
    const dot = container.querySelector('.topic-icon');
    expect(dot).toBeInTheDocument();
    expect(dot?.tagName.toLowerCase()).toBe('span');
    expect(dot).toHaveAttribute('aria-label', 'topic indicator');
  });

  it('renders dot fallback when icon name is invalid', () => {
    const { container } = render(<TopicIcon icon="invalid-icon-name" />);
    const dot = container.querySelector('.topic-icon');
    expect(dot).toBeInTheDocument();
    expect(dot?.tagName.toLowerCase()).toBe('span');
    expect(dot).toHaveAttribute('aria-label', 'topic indicator');
  });

  it('applies topic-icon class to SVG', () => {
    const { container } = render(<TopicIcon icon="star" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('topic-icon');
  });

  it('applies custom className', () => {
    const { container } = render(<TopicIcon icon="heart" className="custom" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('topic-icon', 'custom');
  });

  it('applies small size', () => {
    const { container } = render(<TopicIcon icon="bolt" size="sm" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('height', '16');
  });

  it('applies medium size by default', () => {
    const { container } = render(<TopicIcon icon="book" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
  });

  it('applies large size', () => {
    const { container } = render(<TopicIcon icon="trophy" size="lg" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('has accessible role and label on SVG', () => {
    render(<TopicIcon icon="lightbulb" />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'topic icon');
  });

  it('uses icon color fill on SVG', () => {
    const { container } = render(<TopicIcon icon="pen" />);
    const svg = container.querySelector('svg');
    // TopicIcon uses a muted color for icons
    expect(svg).toHaveAttribute('fill', '#b0bec5');
  });
});
