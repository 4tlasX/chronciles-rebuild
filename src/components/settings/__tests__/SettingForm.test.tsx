import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SettingForm } from '../SettingForm';
import type { Setting } from '@/lib/db';

describe('SettingForm', () => {
  const mockOnSubmit = vi.fn();

  it('renders key input', () => {
    render(<SettingForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/key/i)).toBeInTheDocument();
  });

  it('renders value textarea', () => {
    render(<SettingForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/value/i)).toBeInTheDocument();
  });

  it('renders submit button with default label', () => {
    render(<SettingForm onSubmit={mockOnSubmit} />);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('renders submit button with custom label', () => {
    render(<SettingForm onSubmit={mockOnSubmit} submitLabel="Save Setting" />);
    expect(screen.getByRole('button', { name: 'Save Setting' })).toBeInTheDocument();
  });

  it('renders cancel button when onCancel provided', () => {
    const onCancel = vi.fn();
    render(<SettingForm onSubmit={mockOnSubmit} onCancel={onCancel} />);
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('does not render cancel button when onCancel not provided', () => {
    render(<SettingForm onSubmit={mockOnSubmit} />);
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
  });

  it('pre-fills form when setting is provided', () => {
    const setting: Setting = {
      key: 'site_name',
      value: 'My Blog',
      updatedAt: new Date(),
    };
    render(<SettingForm setting={setting} onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/key/i)).toHaveValue('site_name');
    expect(screen.getByLabelText(/value/i)).toHaveValue('My Blog');
  });

  it('stringifies object value when setting has object', () => {
    const setting: Setting = {
      key: 'config',
      value: { theme: 'dark' },
      updatedAt: new Date(),
    };
    render(<SettingForm setting={setting} onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/value/i)).toHaveValue(JSON.stringify({ theme: 'dark' }, null, 2));
  });

  it('makes key input readonly when editing', () => {
    const setting: Setting = {
      key: 'site_name',
      value: 'value',
      updatedAt: new Date(),
    };
    render(<SettingForm setting={setting} onSubmit={mockOnSubmit} isEditing />);
    expect(screen.getByLabelText(/key/i)).toHaveAttribute('readonly');
  });

  it('key input is not readonly when creating', () => {
    render(<SettingForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/key/i)).not.toHaveAttribute('readonly');
  });

  it('key input is required', () => {
    render(<SettingForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/key/i)).toBeRequired();
  });

  it('applies setting-form class', () => {
    const { container } = render(<SettingForm onSubmit={mockOnSubmit} />);
    expect(container.querySelector('form')).toHaveClass('setting-form');
  });

  it('shows hint for value field', () => {
    render(<SettingForm onSubmit={mockOnSubmit} />);
    expect(screen.getByText(/enter plain text or valid json/i)).toBeInTheDocument();
  });
});
