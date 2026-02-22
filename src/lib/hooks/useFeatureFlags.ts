'use client';

import { useAuthStore } from '@/stores/authStore';
import { FeatureKey, FEATURES, FeatureDefinition } from '@/lib/settings';

/**
 * Hook for accessing feature flags from user settings.
 */
export function useFeatureFlags() {
  const userSettings = useAuthStore((state) => state.userSettings);

  /**
   * Check if a specific feature is enabled
   */
  const isEnabled = (feature: FeatureKey): boolean => {
    const settingKey = `${feature}Enabled` as keyof typeof userSettings;
    return Boolean(userSettings[settingKey]);
  };

  /**
   * Get all enabled features
   */
  const getEnabledFeatures = (): FeatureDefinition[] => {
    return FEATURES.filter((f) => isEnabled(f.key));
  };

  /**
   * Get all disabled features
   */
  const getDisabledFeatures = (): FeatureDefinition[] => {
    return FEATURES.filter((f) => !isEnabled(f.key));
  };

  /**
   * Individual feature flags for convenience
   */
  const flags = {
    food: userSettings.foodEnabled,
    medication: userSettings.medicationEnabled,
    goals: userSettings.goalsEnabled,
    milestones: userSettings.milestonesEnabled,
    exercise: userSettings.exerciseEnabled,
    allergies: userSettings.allergiesEnabled,
  };

  return {
    isEnabled,
    getEnabledFeatures,
    getDisabledFeatures,
    flags,
    // Individual flags for direct access
    foodEnabled: flags.food,
    medicationEnabled: flags.medication,
    goalsEnabled: flags.goals,
    milestonesEnabled: flags.milestones,
    exerciseEnabled: flags.exercise,
    allergiesEnabled: flags.allergies,
  };
}
