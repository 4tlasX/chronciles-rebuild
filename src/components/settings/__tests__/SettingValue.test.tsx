import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SettingValue } from '../SettingValue';

describe('SettingValue', () => {
  it('renders string value', () => {
    render(<SettingValue value="My Site" />);
    expect(screen.getByText('My Site')).toBeInTheDocument();
  });

  it('renders as code element', () => {
    const { container } = render(<SettingValue value="value" />);
    expect(container.firstChild?.nodeName).toBe('CODE');
  });

  it('applies setting-value class', () => {
    render(<SettingValue value="value" />);
    expect(screen.getByText('value')).toHaveClass('setting-value');
  });

  it('applies custom className', () => {
    render(<SettingValue value="value" className="custom" />);
    expect(screen.getByText('value')).toHaveClass('setting-value', 'custom');
  });

  it('stringifies object values', () => {
    render(<SettingValue value={{ theme: 'dark' }} />);
    expect(screen.getByText('{"theme":"dark"}')).toBeInTheDocument();
  });

  it('converts boolean values to string', () => {
    render(<SettingValue value={true} />);
    expect(screen.getByText('true')).toBeInTheDocument();
  });

  it('converts number values to string', () => {
    render(<SettingValue value={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('truncates long values by default', () => {
    const longValue = 'A'.repeat(100);
    render(<SettingValue value={longValue} />);
    expect(screen.getByText(/\.\.\.$/)).toBeInTheDocument();
  });

  it('does not truncate when truncate is false', () => {
    const longValue = 'A'.repeat(100);
    render(<SettingValue value={longValue} truncate={false} />);
    expect(screen.getByText(longValue)).toBeInTheDocument();
  });

  it('uses custom maxLength for truncation', () => {
    const value = 'A'.repeat(30);
    render(<SettingValue value={value} maxLength={10} />);
    const element = screen.getByText(/\.\.\.$/);
    expect(element.textContent?.length).toBeLessThan(30);
  });

  it('has title attribute with full value', () => {
    const longValue = 'A'.repeat(100);
    render(<SettingValue value={longValue} />);
    expect(screen.getByText(/\.\.\.$/)).toHaveAttribute('title', longValue);
  });
});
