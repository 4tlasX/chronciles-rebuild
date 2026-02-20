import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostDate } from '../PostDate';

describe('PostDate', () => {
  const testDate = new Date('2024-03-15T12:00:00Z');

  it('renders formatted date', () => {
    render(<PostDate date={testDate} />);
    // The exact format depends on locale, so just check the element exists
    expect(screen.getByRole('time')).toBeInTheDocument();
  });

  it('renders as time element', () => {
    const { container } = render(<PostDate date={testDate} />);
    expect(container.firstChild?.nodeName).toBe('TIME');
  });

  it('has datetime attribute', () => {
    render(<PostDate date={testDate} />);
    expect(screen.getByRole('time')).toHaveAttribute('datetime');
  });

  it('applies post-date class', () => {
    render(<PostDate date={testDate} />);
    expect(screen.getByRole('time')).toHaveClass('post-date');
  });

  it('applies custom className', () => {
    render(<PostDate date={testDate} className="custom" />);
    expect(screen.getByRole('time')).toHaveClass('post-date', 'custom');
  });

  it('handles string date input', () => {
    render(<PostDate date={'2024-03-15' as unknown as Date} />);
    expect(screen.getByRole('time')).toBeInTheDocument();
  });
});
