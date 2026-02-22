import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SettingCreateForm } from '../SettingCreateForm';

// Mock the server action
vi.mock('../actions', () => ({
  upsertSettingAction: vi.fn(),
}));

describe('SettingCreateForm', () => {
  it('renders form panel with title', () => {
    render(<SettingCreateForm email="test@example.com" />);
    expect(screen.getByText('Add or Update Setting')).toBeInTheDocument();
  });

  it('renders setting form', () => {
    render(<SettingCreateForm email="test@example.com" />);
    expect(screen.getByLabelText(/key/i)).toBeInTheDocument();
  });

  it('renders submit button with correct label', () => {
    render(<SettingCreateForm email="test@example.com" />);
    expect(screen.getByRole('button', { name: 'Save Setting' })).toBeInTheDocument();
  });

  it('renders value textarea', () => {
    render(<SettingCreateForm email="test@example.com" />);
    expect(screen.getByLabelText(/value/i)).toBeInTheDocument();
  });
});
