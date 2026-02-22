'use client';

import { useEffect, useState, useTransition } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardTitle } from '@/components/card';
import { FormGroup, Select, Toggle, ColorGrid, ImageGrid, Button } from '@/components/form';
import {
  AllSettings,
  FeatureKey,
  FEATURES,
  HEADER_COLORS,
  BACKGROUND_IMAGES,
  TIMEZONES,
} from '@/lib/settings';
import {
  updateTimezoneAction,
  updateHeaderColorAction,
  updateBackgroundImageAction,
  toggleFeatureAction,
  signOutAction,
} from './actions';

interface SettingsClientProps {
  initialSettings: AllSettings;
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const setSettings = useAuthStore((state) => state.setSettings);
  const updateSettings = useAuthStore((state) => state.updateSettings);
  const userSettings = useAuthStore((state) => state.userSettings);
  const userName = useAuthStore((state) => state.userName);
  const userEmail = useAuthStore((state) => state.userEmail);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Initialize store with server-fetched settings
  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings, setSettings]);

  const handleTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTimezone = e.target.value;
    const prevTimezone = userSettings.timezone;

    updateSettings({ timezone: newTimezone });
    setError(null);

    startTransition(async () => {
      const result = await updateTimezoneAction(newTimezone);
      if (result.error) {
        updateSettings({ timezone: prevTimezone });
        setError(result.error);
      }
    });
  };

  const handleColorChange = (color: string) => {
    const prevColor = userSettings.headerColor;

    updateSettings({ headerColor: color });
    setError(null);

    // Update CSS variable immediately
    document.documentElement.style.setProperty('--header-color', color);

    startTransition(async () => {
      const result = await updateHeaderColorAction(color);
      if (result.error) {
        updateSettings({ headerColor: prevColor });
        document.documentElement.style.setProperty('--header-color', prevColor);
        setError(result.error);
      }
    });
  };

  const handleBackgroundChange = (image: string) => {
    const prevImage = userSettings.backgroundImage;

    updateSettings({ backgroundImage: image });
    setError(null);

    // Update CSS variable immediately
    if (image) {
      document.documentElement.style.setProperty('--background-image', `url(${image})`);
    } else {
      document.documentElement.style.setProperty('--background-image', 'none');
    }

    startTransition(async () => {
      const result = await updateBackgroundImageAction(image);
      if (result.error) {
        updateSettings({ backgroundImage: prevImage });
        if (prevImage) {
          document.documentElement.style.setProperty('--background-image', `url(${prevImage})`);
        } else {
          document.documentElement.style.setProperty('--background-image', 'none');
        }
        setError(result.error);
      }
    });
  };

  const handleFeatureToggle = (feature: FeatureKey, enabled: boolean) => {
    const featureConfig = FEATURES.find((f) => f.key === feature);
    if (!featureConfig) return;

    const settingKey = featureConfig.settingKey;
    const prevValue = userSettings[settingKey];

    updateSettings({ [settingKey]: enabled });
    setError(null);

    startTransition(async () => {
      const result = await toggleFeatureAction(feature, enabled);
      if (result.error) {
        updateSettings({ [settingKey]: prevValue });
        setError(result.error);
      }
    });
  };

  const handleSignOut = () => {
    startTransition(async () => {
      await signOutAction();
    });
  };

  const timezoneOptions = TIMEZONES.map((tz) => ({
    value: tz.value,
    label: tz.label,
  }));

  const colorOptions = HEADER_COLORS.map((c) => ({
    value: c.value,
    label: c.label,
  }));

  const imageOptions = BACKGROUND_IMAGES.map((bg) => ({
    value: bg.value,
    label: bg.label,
    artist: bg.artist,
  }));

  return (
    <div>
      {error && (
        <div className="form-error-banner">{error}</div>
      )}

      {/* Account */}
      <Card>
        <CardTitle>Account</CardTitle>
        <div className="card-body">
          <div className="form-row">
            <span className="text-muted">Email:</span> {userEmail}
          </div>
          {userName && (
            <div className="form-row">
              <span className="text-muted">Username:</span> {userName}
            </div>
          )}
        </div>
      </Card>

      {/* Preferences */}
      <Card>
        <CardTitle>Preferences</CardTitle>
        <FormGroup
          label="Timezone"
          hint="Used to determine the current day for journal entries"
        >
          <Select
            options={timezoneOptions}
            value={userSettings.timezone}
            onChange={handleTimezoneChange}
            disabled={isPending}
          />
        </FormGroup>
      </Card>

      {/* Theme */}
      <Card>
        <CardTitle>Theme</CardTitle>
        <FormGroup label="Header Color">
          <ColorGrid
            options={colorOptions}
            value={userSettings.headerColor}
            onChange={handleColorChange}
            disabled={isPending}
          />
        </FormGroup>

        <FormGroup label="Background Image">
          <ImageGrid
            options={imageOptions}
            value={userSettings.backgroundImage}
            onChange={handleBackgroundChange}
            disabled={isPending}
          />
          <p className="form-hint" style={{ marginTop: '0.5rem' }}>
            Images from{' '}
            <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">
              Unsplash
            </a>
          </p>
        </FormGroup>
      </Card>

      {/* Features */}
      <Card>
        <CardTitle>Features</CardTitle>
        <p className="form-hint" style={{ marginBottom: '0.75rem' }}>
          Enable optional topics for specialized tracking
        </p>
        {FEATURES.map((feature) => (
          <Toggle
            key={feature.key}
            id={`feature-${feature.key}`}
            label={feature.name}
            description={feature.description}
            checked={Boolean(userSettings[feature.settingKey])}
            onChange={(e) => handleFeatureToggle(feature.key, e.target.checked)}
            disabled={isPending}
          />
        ))}
      </Card>

      {/* Danger Zone */}
      <Card>
        <CardTitle>Danger Zone</CardTitle>
        <div className="card-body">
          <p className="form-hint" style={{ marginBottom: '0.75rem' }}>
            Sign out of your account on this device
          </p>
          <Button
            variant="danger"
            onClick={handleSignOut}
            disabled={isPending}
          >
            {isPending ? 'Signing out...' : 'Sign Out'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
