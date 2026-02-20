import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopicColorSwatch } from '../TopicColorSwatch';

describe('TopicColorSwatch', () => {
  it('renders with color', () => {
    const { container } = render(<TopicColorSwatch color="#FF0000" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('returns null when color is null', () => {
    const { container } = render(<TopicColorSwatch color={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('applies color-swatch class', () => {
    const { container } = render(<TopicColorSwatch color="#00FF00" />);
    expect(container.firstChild).toHaveClass('color-swatch');
  });

  it('applies custom className', () => {
    const { container } = render(<TopicColorSwatch color="#0000FF" className="custom" />);
    expect(container.firstChild).toHaveClass('color-swatch', 'custom');
  });

  it('sets background color style', () => {
    const { container } = render(<TopicColorSwatch color="#3B82F6" />);
    expect(container.firstChild).toHaveStyle({ backgroundColor: '#3B82F6' });
  });

  it('applies small size', () => {
    const { container } = render(<TopicColorSwatch color="#FF0000" size="sm" />);
    expect(container.firstChild).toHaveStyle({ width: '0.75rem', height: '0.75rem' });
  });

  it('applies medium size by default', () => {
    const { container } = render(<TopicColorSwatch color="#FF0000" />);
    expect(container.firstChild).toHaveStyle({ width: '1rem', height: '1rem' });
  });

  it('applies large size', () => {
    const { container } = render(<TopicColorSwatch color="#FF0000" size="lg" />);
    expect(container.firstChild).toHaveStyle({ width: '1.5rem', height: '1.5rem' });
  });

  it('has title attribute with color value', () => {
    const { container } = render(<TopicColorSwatch color="#ABC123" />);
    expect(container.firstChild).toHaveAttribute('title', '#ABC123');
  });

  it('has aria-label for accessibility', () => {
    const { container } = render(<TopicColorSwatch color="#DEF456" />);
    expect(container.firstChild).toHaveAttribute('aria-label', 'Color: #DEF456');
  });
});
