import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SettingsTable } from '../SettingsTable';

describe('SettingsTable', () => {
  it('renders as table', () => {
    render(
      <SettingsTable>
        <tr><td>Content</td></tr>
      </SettingsTable>
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('applies settings-table class', () => {
    render(
      <SettingsTable>
        <tr><td>Content</td></tr>
      </SettingsTable>
    );
    expect(screen.getByRole('table')).toHaveClass('settings-table');
  });

  it('renders table headers', () => {
    render(
      <SettingsTable>
        <tr><td>Content</td></tr>
      </SettingsTable>
    );
    expect(screen.getByText('Key')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });

  it('renders children in tbody', () => {
    render(
      <SettingsTable>
        <tr data-testid="row"><td>Content</td></tr>
      </SettingsTable>
    );
    expect(screen.getByTestId('row')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <SettingsTable>
        <tr data-testid="row1"><td>Row 1</td></tr>
        <tr data-testid="row2"><td>Row 2</td></tr>
      </SettingsTable>
    );
    expect(screen.getByTestId('row1')).toBeInTheDocument();
    expect(screen.getByTestId('row2')).toBeInTheDocument();
  });
});
