import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SettingDeleteButton } from '../SettingDeleteButton';

// Mock the server action
vi.mock('../actions', () => ({
  deleteSettingAction: vi.fn(),
}));

describe('SettingDeleteButton', () => {
  it('renders delete button', () => {
    render(<SettingDeleteButton settingKey="site_name" email="test@example.com" />);
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('renders button with danger variant styling', () => {
    render(<SettingDeleteButton settingKey="site_name" email="test@example.com" />);
    expect(screen.getByRole('button')).toHaveClass('btn-danger');
  });

  it('renders inside a form', () => {
    const { container } = render(
      <SettingDeleteButton settingKey="site_name" email="test@example.com" />
    );
    expect(container.querySelector('form')).toBeInTheDocument();
  });
});
