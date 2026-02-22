'use client';

import { useMemo } from 'react';
import { useAuthStore } from '@/stores/authStore';

/**
 * Hook for timezone-aware date calculations.
 * Uses the user's configured timezone from settings.
 */
export function useTimezone() {
  const timezone = useAuthStore((state) => state.userSettings.timezone);

  /**
   * Get today's date in the user's timezone as YYYY-MM-DD
   */
  const today = useMemo(() => {
    const now = new Date();
    return formatDateInTimezone(now, timezone);
  }, [timezone]);

  /**
   * Format a date to YYYY-MM-DD in the user's timezone
   */
  const formatDate = (date: Date): string => {
    return formatDateInTimezone(date, timezone);
  };

  /**
   * Format a date to a localized string in the user's timezone
   */
  const formatLocaleDate = (
    date: Date,
    options?: Intl.DateTimeFormatOptions
  ): string => {
    return date.toLocaleDateString('en-US', {
      timeZone: timezone,
      ...options,
    });
  };

  /**
   * Format a time to a localized string in the user's timezone
   */
  const formatLocaleTime = (
    date: Date,
    options?: Intl.DateTimeFormatOptions
  ): string => {
    return date.toLocaleTimeString('en-US', {
      timeZone: timezone,
      ...options,
    });
  };

  /**
   * Format a date and time to a localized string in the user's timezone
   */
  const formatLocaleDateTime = (
    date: Date,
    options?: Intl.DateTimeFormatOptions
  ): string => {
    return date.toLocaleString('en-US', {
      timeZone: timezone,
      ...options,
    });
  };

  /**
   * Check if a date string (YYYY-MM-DD) is today in the user's timezone
   */
  const isToday = (dateStr: string): boolean => {
    return dateStr === today;
  };

  /**
   * Check if a date string (YYYY-MM-DD) is in the past in the user's timezone
   */
  const isPast = (dateStr: string): boolean => {
    return dateStr < today;
  };

  /**
   * Check if a date string (YYYY-MM-DD) is in the future in the user's timezone
   */
  const isFuture = (dateStr: string): boolean => {
    return dateStr > today;
  };

  return {
    timezone,
    today,
    formatDate,
    formatLocaleDate,
    formatLocaleTime,
    formatLocaleDateTime,
    isToday,
    isPast,
    isFuture,
  };
}

/**
 * Format a Date object to YYYY-MM-DD in a specific timezone
 */
function formatDateInTimezone(date: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const year = parts.find((p) => p.type === 'year')?.value ?? '';
  const month = parts.find((p) => p.type === 'month')?.value ?? '';
  const day = parts.find((p) => p.type === 'day')?.value ?? '';

  return `${year}-${month}-${day}`;
}
