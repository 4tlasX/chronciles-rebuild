import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostContent } from '../PostContent';

describe('PostContent', () => {
  it('renders content', () => {
    render(<PostContent content="Hello, world!" />);
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });

  it('applies post-content class', () => {
    const { container } = render(<PostContent content="Content" />);
    expect(container.firstChild).toHaveClass('post-content');
  });

  it('applies custom className', () => {
    const { container } = render(<PostContent content="Content" className="custom" />);
    expect(container.firstChild).toHaveClass('post-content', 'custom');
  });

  it('does not truncate by default', () => {
    const longContent = 'A'.repeat(300);
    render(<PostContent content={longContent} />);
    expect(screen.getByText(longContent)).toBeInTheDocument();
  });

  it('truncates content when truncate is true', () => {
    const longContent = 'A'.repeat(300);
    render(<PostContent content={longContent} truncate />);
    expect(screen.getByText(/\.\.\.$/)).toBeInTheDocument();
  });

  it('does not truncate short content even when truncate is true', () => {
    const shortContent = 'Short content';
    render(<PostContent content={shortContent} truncate />);
    expect(screen.getByText(shortContent)).toBeInTheDocument();
    expect(screen.queryByText(/\.\.\.$/)).not.toBeInTheDocument();
  });

  it('uses custom maxLength for truncation', () => {
    const content = 'A'.repeat(50);
    render(<PostContent content={content} truncate maxLength={20} />);
    const truncated = screen.getByText(/\.\.\.$/);
    expect(truncated.textContent?.length).toBeLessThan(50);
  });

  it('renders as paragraph', () => {
    const { container } = render(<PostContent content="Test" />);
    expect(container.firstChild?.nodeName).toBe('P');
  });
});
