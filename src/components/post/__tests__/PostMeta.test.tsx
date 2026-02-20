import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostMeta } from '../PostMeta';

describe('PostMeta', () => {
  it('renders metadata key-value pairs', () => {
    render(<PostMeta metadata={{ featured: true, category: 'tech' }} />);
    expect(screen.getByText('featured:')).toBeInTheDocument();
    expect(screen.getByText('true')).toBeInTheDocument();
    expect(screen.getByText('category:')).toBeInTheDocument();
    expect(screen.getByText('tech')).toBeInTheDocument();
  });

  it('returns null when metadata is empty', () => {
    const { container } = render(<PostMeta metadata={{}} />);
    expect(container.firstChild).toBeNull();
  });

  it('applies post-meta class', () => {
    const { container } = render(<PostMeta metadata={{ key: 'value' }} />);
    expect(container.firstChild).toHaveClass('post-meta');
  });

  it('applies custom className', () => {
    const { container } = render(<PostMeta metadata={{ key: 'value' }} className="custom" />);
    expect(container.firstChild).toHaveClass('post-meta', 'custom');
  });

  it('stringifies object values', () => {
    render(<PostMeta metadata={{ config: { nested: true } }} />);
    expect(screen.getByText('config:')).toBeInTheDocument();
    expect(screen.getByText('{"nested":true}')).toBeInTheDocument();
  });

  it('converts boolean values to string', () => {
    render(<PostMeta metadata={{ active: false }} />);
    expect(screen.getByText('false')).toBeInTheDocument();
  });

  it('converts number values to string', () => {
    render(<PostMeta metadata={{ count: 42 }} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders multiple items with correct structure', () => {
    const { container } = render(
      <PostMeta metadata={{ a: '1', b: '2', c: '3' }} />
    );
    const items = container.querySelectorAll('.post-meta-item');
    expect(items).toHaveLength(3);
  });
});
