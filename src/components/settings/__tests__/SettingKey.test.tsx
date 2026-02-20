import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SettingKey } from '../SettingKey';

describe('SettingKey', () => {
  it('renders the setting key', () => {
    render(<SettingKey settingKey="site_name" />);
    expect(screen.getByText('site_name')).toBeInTheDocument();
  });

  it('renders as code element', () => {
    const { container } = render(<SettingKey settingKey="key" />);
    expect(container.firstChild?.nodeName).toBe('CODE');
  });

  it('applies setting-key class', () => {
    render(<SettingKey settingKey="key" />);
    expect(screen.getByText('key')).toHaveClass('setting-key');
  });

  it('applies custom className', () => {
    render(<SettingKey settingKey="key" className="custom" />);
    expect(screen.getByText('key')).toHaveClass('setting-key', 'custom');
  });
});
