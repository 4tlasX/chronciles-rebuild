import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopicIcon } from '../TopicIcon';

describe('TopicIcon', () => {
  it('renders icon emoji', () => {
    render(<TopicIcon icon="💻" />);
    expect(screen.getByText('💻')).toBeInTheDocument();
  });

  it('returns null when icon is null', () => {
    const { container } = render(<TopicIcon icon={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('applies topic-icon class', () => {
    render(<TopicIcon icon="🎨" />);
    expect(screen.getByText('🎨')).toHaveClass('topic-icon');
  });

  it('applies custom className', () => {
    render(<TopicIcon icon="📚" className="custom" />);
    expect(screen.getByText('📚')).toHaveClass('topic-icon', 'custom');
  });

  it('applies small size', () => {
    render(<TopicIcon icon="🔧" size="sm" />);
    expect(screen.getByText('🔧')).toHaveStyle({ fontSize: '1rem' });
  });

  it('applies medium size by default', () => {
    render(<TopicIcon icon="⚙️" />);
    expect(screen.getByText('⚙️')).toHaveStyle({ fontSize: '1.5rem' });
  });

  it('applies large size', () => {
    render(<TopicIcon icon="🚀" size="lg" />);
    expect(screen.getByText('🚀')).toHaveStyle({ fontSize: '2rem' });
  });

  it('has accessible role and label', () => {
    render(<TopicIcon icon="💡" />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'topic icon');
  });
});
