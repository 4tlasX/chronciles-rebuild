import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SettingDate } from '../SettingDate';

describe('SettingDate', () => {
  const testDate = new Date('2024-03-15T12:00:00Z');

  it('renders as time element', () => {
    const { container } = render(<SettingDate date={testDate} />);
    expect(container.firstChild?.nodeName).toBe('TIME');
  });

  it('has datetime attribute', () => {
    render(<SettingDate date={testDate} />);
    expect(screen.getByRole('time')).toHaveAttribute('datetime');
  });

  it('applies setting-date class', () => {
    render(<SettingDate date={testDate} />);
    expect(screen.getByRole('time')).toHaveClass('setting-date');
  });

  it('applies custom className', () => {
    render(<SettingDate date={testDate} className="custom" />);
    expect(screen.getByRole('time')).toHaveClass('setting-date', 'custom');
  });

  it('handles string date input', () => {
    render(<SettingDate date={'2024-03-15' as unknown as Date} />);
    expect(screen.getByRole('time')).toBeInTheDocument();
  });
});
