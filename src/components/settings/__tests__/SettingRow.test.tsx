import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SettingRow } from '../SettingRow';
import type { Setting } from '@/lib/db';

describe('SettingRow', () => {
  const mockSetting: Setting = {
    key: 'site_name',
    value: 'My Blog',
    updatedAt: new Date('2024-03-15T12:00:00Z'),
  };

  // Wrap in table for proper rendering
  const renderInTable = (ui: React.ReactElement) => {
    return render(
      <table>
        <tbody>{ui}</tbody>
      </table>
    );
  };

  it('renders setting key', () => {
    renderInTable(<SettingRow setting={mockSetting} />);
    expect(screen.getByText('site_name')).toBeInTheDocument();
  });

  it('renders setting value', () => {
    renderInTable(<SettingRow setting={mockSetting} />);
    expect(screen.getByText('My Blog')).toBeInTheDocument();
  });

  it('renders date', () => {
    renderInTable(<SettingRow setting={mockSetting} />);
    expect(screen.getByRole('time')).toBeInTheDocument();
  });

  it('renders as table row', () => {
    renderInTable(<SettingRow setting={mockSetting} />);
    expect(screen.getByRole('row')).toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    renderInTable(
      <SettingRow
        setting={mockSetting}
        actions={<button data-testid="action">Edit</button>}
      />
    );
    expect(screen.getByTestId('action')).toBeInTheDocument();
  });

  it('renders four table cells', () => {
    renderInTable(<SettingRow setting={mockSetting} />);
    const cells = screen.getAllByRole('cell');
    expect(cells).toHaveLength(4);
  });

  it('handles object values', () => {
    const settingWithObject: Setting = {
      ...mockSetting,
      value: { theme: 'dark' },
    };
    renderInTable(<SettingRow setting={settingWithObject} />);
    expect(screen.getByText(/theme/)).toBeInTheDocument();
  });
});
