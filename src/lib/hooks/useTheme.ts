'use client';

import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { HEADER_COLORS } from '@/lib/settings';

// localStorage keys for instant theme switching
const STORAGE_KEY_HEADER_COLOR = 'chronicles-header-color';
const STORAGE_KEY_BACKGROUND_IMAGE = 'chronicles-background-image';

// Custom event names for cross-component communication
const EVENT_HEADER_COLOR_CHANGE = 'headerColorChange';
const EVENT_BACKGROUND_IMAGE_CHANGE = 'backgroundImageChange';

/**
 * Hook for managing theme settings with optimistic updates.
 * Provides both immediate visual feedback (localStorage + events) and
 * integration with the Zustand store.
 */
export function useTheme() {
  const headerColor = useAuthStore((state) => state.userSettings.headerColor);
  const backgroundImage = useAuthStore(
    (state) => state.userSettings.backgroundImage
  );
  const updateSettings = useAuthStore((state) => state.updateSettings);

  /**
   * Get the label for the current header color
   */
  const headerColorLabel =
    HEADER_COLORS.find((c) => c.value === headerColor)?.label ?? 'Custom';

  /**
   * Apply theme to DOM (CSS custom properties)
   */
  useEffect(() => {
    applyThemeToDOM(headerColor, backgroundImage);
  }, [headerColor, backgroundImage]);

  /**
   * Set header color with optimistic update
   */
  const setHeaderColor = useCallback(
    (color: string) => {
      // Update Zustand store
      updateSettings({ headerColor: color });

      // Store in localStorage for instant switching on page load
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_HEADER_COLOR, color);
        window.dispatchEvent(
          new CustomEvent(EVENT_HEADER_COLOR_CHANGE, { detail: color })
        );
      }

      // Apply immediately
      applyHeaderColorToDOM(color);
    },
    [updateSettings]
  );

  /**
   * Set background image with optimistic update
   */
  const setBackgroundImage = useCallback(
    (image: string) => {
      // Update Zustand store
      updateSettings({ backgroundImage: image });

      // Store in localStorage for instant switching on page load
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_BACKGROUND_IMAGE, image);
        window.dispatchEvent(
          new CustomEvent(EVENT_BACKGROUND_IMAGE_CHANGE, { detail: image })
        );
      }

      // Apply immediately
      applyBackgroundImageToDOM(image);
    },
    [updateSettings]
  );

  /**
   * Revert to a previous theme (for error handling)
   */
  const revertTheme = useCallback(
    (prevHeaderColor: string, prevBackgroundImage: string) => {
      setHeaderColor(prevHeaderColor);
      setBackgroundImage(prevBackgroundImage);
    },
    [setHeaderColor, setBackgroundImage]
  );

  return {
    headerColor,
    headerColorLabel,
    backgroundImage,
    setHeaderColor,
    setBackgroundImage,
    revertTheme,
  };
}

/**
 * Apply header color to DOM via CSS custom property
 */
function applyHeaderColorToDOM(color: string) {
  if (typeof document === 'undefined') return;

  document.documentElement.style.setProperty('--header-color', color);

  // Calculate a slightly lighter/darker variant for hover states
  if (color !== 'transparent' && color.startsWith('#')) {
    const hoverColor = adjustBrightness(color, 20);
    document.documentElement.style.setProperty('--header-color-hover', hoverColor);
  }
}

/**
 * Apply background image to DOM via CSS custom property
 */
function applyBackgroundImageToDOM(image: string) {
  if (typeof document === 'undefined') return;

  if (image) {
    document.documentElement.style.setProperty(
      '--background-image',
      `url(${image})`
    );
  } else {
    document.documentElement.style.removeProperty('--background-image');
  }
}

/**
 * Apply both theme values to DOM
 */
function applyThemeToDOM(headerColor: string, backgroundImage: string) {
  applyHeaderColorToDOM(headerColor);
  applyBackgroundImageToDOM(backgroundImage);
}

/**
 * Adjust the brightness of a hex color
 */
function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);

  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));

  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

/**
 * Initialize theme from localStorage on page load.
 * Call this early in the app lifecycle for instant theme application.
 */
export function initializeThemeFromStorage() {
  if (typeof window === 'undefined') return;

  const storedHeaderColor = localStorage.getItem(STORAGE_KEY_HEADER_COLOR);
  const storedBackgroundImage = localStorage.getItem(STORAGE_KEY_BACKGROUND_IMAGE);

  if (storedHeaderColor) {
    applyHeaderColorToDOM(storedHeaderColor);
  }

  if (storedBackgroundImage) {
    applyBackgroundImageToDOM(storedBackgroundImage);
  }
}
