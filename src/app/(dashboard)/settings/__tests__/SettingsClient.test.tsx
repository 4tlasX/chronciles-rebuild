import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SettingsClient } from '../SettingsClient';
import { useAuthStore } from '@/stores/authStore';
import { DEFAULT_SETTINGS } from '@/lib/settings';

// Mock the server actions
vi.mock('../actions', () => ({
  updateTimezoneAction: vi.fn().mockResolvedValue({}),
  updateAccentColorAction: vi.fn().mockResolvedValue({}),
  updateBackgroundImageAction: vi.fn().mockResolvedValue({}),
  toggleFeatureAction: vi.fn().mockResolvedValue({}),
  signOutAction: vi.fn().mockResolvedValue(undefined),
}));

// Import the mocked actions
import { updateAccentColorAction } from '../actions';

describe('SettingsClient', () => {
  // Use Cyan (the default) as initial color - Material Design Cyan 200
  const initialSettings = {
    ...DEFAULT_SETTINGS,
    accentColor: '#80deea', // Material Design Cyan 200
  };

  // Helper to get color grid by label
  const getAccentColorGrid = () => {
    const accentLabel = screen.getByText('Accent Color');
    return accentLabel.closest('.form-group')?.querySelector('.color-grid');
  };

  beforeEach(() => {
    // Reset store to defaults
    useAuthStore.setState({
      isAuthenticated: true,
      userName: 'testuser',
      userEmail: 'test@example.com',
      userSettings: { ...DEFAULT_SETTINGS },
    });

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any CSS variable changes
    document.documentElement.style.removeProperty('--accent-color');
    document.documentElement.style.removeProperty('--accent-color-hover');
  });

  describe('Accent Color', () => {
    it('renders accent color grid with options', () => {
      render(<SettingsClient initialSettings={initialSettings} />);

      // Check that the Accent Color label exists
      expect(screen.getByText('Accent Color')).toBeInTheDocument();

      // Check that Material Design 200 color options are rendered
      const accentGrid = getAccentColorGrid();
      expect(accentGrid).not.toBeNull();
      expect(accentGrid?.querySelector('[title="Red"]')).toBeInTheDocument();
      expect(accentGrid?.querySelector('[title="Blue"]')).toBeInTheDocument();
      expect(accentGrid?.querySelector('[title="Cyan"]')).toBeInTheDocument();
    });

    it('shows the current accent color as selected', async () => {
      render(<SettingsClient initialSettings={initialSettings} />);

      // Wait for useEffect to initialize settings
      await waitFor(() => {
        const accentGrid = getAccentColorGrid();
        const tealButton = accentGrid?.querySelector('[title="Cyan"]');
        expect(tealButton).toHaveClass('color-grid-item-selected');
      });
    });

    it('calls updateAccentColorAction when accent color is changed', async () => {
      render(<SettingsClient initialSettings={initialSettings} />);

      // Wait for settings to initialize
      await waitFor(() => {
        const accentGrid = getAccentColorGrid();
        expect(accentGrid?.querySelector('[title="Cyan"]')).toHaveClass('color-grid-item-selected');
      });

      // Click on Blue color
      const accentGrid = getAccentColorGrid();
      const blueButton = accentGrid?.querySelector('[title="Blue"]') as HTMLElement;
      fireEvent.click(blueButton);

      // Verify the action was called with the new color (after debounce)
      await waitFor(() => {
        expect(updateAccentColorAction).toHaveBeenCalledWith('#90caf9');
      }, { timeout: 1000 });
    });

    it('updates CSS variable when accent color is changed', async () => {
      render(<SettingsClient initialSettings={initialSettings} />);

      // Wait for settings to initialize
      await waitFor(() => {
        const accentGrid = getAccentColorGrid();
        expect(accentGrid?.querySelector('[title="Cyan"]')).toHaveClass('color-grid-item-selected');
      });

      // Click on Red color
      const accentGrid = getAccentColorGrid();
      const redButton = accentGrid?.querySelector('[title="Red"]') as HTMLElement;
      fireEvent.click(redButton);

      // Check CSS variable was set (immediate, before debounce)
      await waitFor(() => {
        const accentColor = document.documentElement.style.getPropertyValue('--accent-color');
        expect(accentColor).toBe('#ef9a9a');
      });
    });

    it('updates the Zustand store when accent color is changed', async () => {
      render(<SettingsClient initialSettings={initialSettings} />);

      // Wait for settings to initialize
      await waitFor(() => {
        const accentGrid = getAccentColorGrid();
        expect(accentGrid?.querySelector('[title="Cyan"]')).toHaveClass('color-grid-item-selected');
      });

      // Click on Amber color
      const accentGrid = getAccentColorGrid();
      const amberButton = accentGrid?.querySelector('[title="Amber"]') as HTMLElement;
      fireEvent.click(amberButton);

      // Verify store was updated (immediate, before debounce)
      await waitFor(() => {
        const state = useAuthStore.getState();
        expect(state.userSettings.accentColor).toBe('#ffe082');
      });
    });

    it('updates selection visual after clicking new color', async () => {
      render(<SettingsClient initialSettings={initialSettings} />);

      // Wait for settings to initialize
      await waitFor(() => {
        const accentGrid = getAccentColorGrid();
        expect(accentGrid?.querySelector('[title="Cyan"]')).toHaveClass('color-grid-item-selected');
      });

      // Click on Pink color
      const accentGrid = getAccentColorGrid();
      const pinkButton = accentGrid?.querySelector('[title="Pink"]') as HTMLElement;
      fireEvent.click(pinkButton);

      // Verify selection changed
      await waitFor(() => {
        const grid = getAccentColorGrid();
        expect(grid?.querySelector('[title="Pink"]')).toHaveClass('color-grid-item-selected');
        expect(grid?.querySelector('[title="Cyan"]')).not.toHaveClass('color-grid-item-selected');
      });
    });
  });

  describe('Settings initialization', () => {
    it('initializes Zustand store with provided settings', async () => {
      const customSettings = {
        ...DEFAULT_SETTINGS,
        accentColor: '#90caf9', // Blue 200
      };

      render(<SettingsClient initialSettings={customSettings} />);

      // Wait for useEffect to run
      await waitFor(() => {
        const state = useAuthStore.getState();
        expect(state.userSettings.accentColor).toBe('#90caf9');
      });
    });
  });
});
