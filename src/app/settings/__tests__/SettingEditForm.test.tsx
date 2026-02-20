import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingEditForm } from '../SettingEditForm';
import type { Setting } from '@/lib/db';

// Mock the server action
vi.mock('../actions', () => ({
  upsertSettingAction: vi.fn(),
}));

describe('SettingEditForm', () => {
  const mockSetting: Setting = {
    key: 'site_name',
    value: 'My Blog',
    updatedAt: new Date(),
  };

  it('renders edit button initially', () => {
    render(<SettingEditForm setting={mockSetting} email="test@example.com" />);
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('does not show form initially', () => {
    render(<SettingEditForm setting={mockSetting} email="test@example.com" />);
    expect(screen.queryByLabelText(/value/i)).not.toBeInTheDocument();
  });

  it('shows form when edit button is clicked', () => {
    render(<SettingEditForm setting={mockSetting} email="test@example.com" />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByLabelText(/value/i)).toBeInTheDocument();
  });

  it('pre-fills form with setting value', () => {
    render(<SettingEditForm setting={mockSetting} email="test@example.com" />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByLabelText(/value/i)).toHaveValue('My Blog');
  });

  it('shows cancel button when form is open', () => {
    render(<SettingEditForm setting={mockSetting} email="test@example.com" />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('hides form when cancel is clicked', () => {
    render(<SettingEditForm setting={mockSetting} email="test@example.com" />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByLabelText(/value/i)).not.toBeInTheDocument();
  });

  it('shows save button', () => {
    render(<SettingEditForm setting={mockSetting} email="test@example.com" />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });
});
