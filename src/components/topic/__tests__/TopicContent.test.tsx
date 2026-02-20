import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopicContent } from '../TopicContent';

describe('TopicContent', () => {
  it('renders topic name', () => {
    render(<TopicContent name="Technology" />);
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<TopicContent name="Tech" icon="💻" />);
    expect(screen.getByText('💻')).toBeInTheDocument();
  });

  it('does not render icon when null', () => {
    render(<TopicContent name="Tech" icon={null} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders color swatch when color provided', () => {
    const { container } = render(<TopicContent name="Design" color="#FF0000" />);
    expect(container.querySelector('.color-swatch')).toBeInTheDocument();
  });

  it('does not render color swatch when color is null', () => {
    const { container } = render(<TopicContent name="Design" color={null} />);
    expect(container.querySelector('.color-swatch')).not.toBeInTheDocument();
  });

  it('renders ID when showId is provided', () => {
    render(<TopicContent name="Tech" showId={42} />);
    expect(screen.getByText('ID: 42')).toBeInTheDocument();
  });

  it('does not render ID when showId is undefined', () => {
    render(<TopicContent name="Tech" />);
    expect(screen.queryByText(/ID:/)).not.toBeInTheDocument();
  });

  it('applies topic-content class', () => {
    const { container } = render(<TopicContent name="Tech" />);
    expect(container.firstChild).toHaveClass('topic-content');
  });

  it('renders all elements together', () => {
    const { container } = render(
      <TopicContent name="Science" icon="🔬" color="#00FF00" showId={123} />
    );
    expect(screen.getByText('Science')).toBeInTheDocument();
    expect(screen.getByText('🔬')).toBeInTheDocument();
    expect(container.querySelector('.color-swatch')).toBeInTheDocument();
    expect(screen.getByText('ID: 123')).toBeInTheDocument();
  });
});
