# Implementation Plan: Settings Migration from Original App

## Overview

Port all settings from the original Chronicles app to the new Chronicles app. The original app uses a denormalized single-row table with typed columns, while the new app uses a flexible key-value store with JSONB values. This plan covers migrating feature toggles, user preferences, theme settings, and related UI components.

**Storage Difference:**
- **Original**: Single row in `user_settings` table with typed columns (`foodEnabled BOOLEAN`, `timezone TEXT`, etc.)
- **New**: Key-value pairs in `settings` table (`key TEXT`, `value JSONB`)

---

## Part 1: Settings to Port

### Feature Toggles (6)

| Setting Key | Type | Default | Description |
|-------------|------|---------|-------------|
| `foodEnabled` | boolean | `false` | Enable food logging feature |
| `medicationEnabled` | boolean | `false` | Enable medication tracking |
| `goalsEnabled` | boolean | `false` | Enable goal tracking |
| `milestonesEnabled` | boolean | `false` | Enable milestone tracking |
| `exerciseEnabled` | boolean | `false` | Enable exercise logging |
| `allergiesEnabled` | boolean | `false` | Enable allergy tracking |

### User Preferences (3)

| Setting Key | Type | Default | Description |
|-------------|------|---------|-------------|
| `timezone` | string | `"UTC"` | User's timezone for date calculations |
| `headerColor` | string | `"#2d2c2a"` | Theme accent/header color |
| `backgroundImage` | string | `""` | Background image URL |

---

## Part 2: Theme Options to Port

### Header Colors (18)

```typescript
const HEADER_COLORS = [
  { name: 'Dark', value: '#2d2c2a' },
  { name: 'Navy', value: '#1e3a5f' },
  { name: 'Gold', value: '#b8860b' },
  { name: 'Coral', value: '#cd5c5c' },
  { name: 'Teal', value: '#008080' },
  { name: 'Steel Blue', value: '#4682b4' },
  { name: 'Verdigris', value: '#43b3ae' },
  { name: 'Tan', value: '#d2b48c' },
  { name: 'Rose', value: '#bc8f8f' },
  { name: 'Plum', value: '#8e4585' },
  { name: 'Purple', value: '#663399' },
  { name: 'Midnight', value: '#191970' },
  { name: 'Black', value: '#000000' },
  { name: 'Burgundy', value: '#800020' },
  { name: 'Ruby', value: '#9b111e' },
  { name: 'Orange', value: '#cc5500' },
  { name: 'Deep Teal', value: '#004d4d' },
  { name: 'Transparent', value: 'transparent' },
];
```

### Background Images (28)

From Unsplash with artist credits:
- Waterfall, Plants, Abstract, Ocean, Desert, Blush, Texture, Waves
- Gradient, Lights, Mountain, Vintage, Paper, Marble, Forest, Soft
- Colorful, Warm, Earth, Floral, Minimalist, Aurora, Lake, Nordic
- Winter, Concrete, Pastel, Pink

---

## Part 3: Implementation Tasks

### Phase 1: Settings Constants & Types

**1.1 Create Settings Constants**
- File: `src/lib/settings/settingsConfig.ts`
- Define `DEFAULT_SETTINGS` object with all default values
- Define `HEADER_COLORS` array with color options
- Define `BACKGROUND_IMAGES` array with image options (URLs + artist credits)
- Export TypeScript types for settings

```typescript
// Types to define
interface FeatureSettings {
  foodEnabled: boolean;
  medicationEnabled: boolean;
  goalsEnabled: boolean;
  milestonesEnabled: boolean;
  exerciseEnabled: boolean;
  allergiesEnabled: boolean;
}

interface PreferenceSettings {
  timezone: string;
  headerColor: string;
  backgroundImage: string;
}

type AllSettings = FeatureSettings & PreferenceSettings;
```

**1.2 Create Timezone Options**
- File: `src/lib/settings/timezones.ts`
- Define array of common timezones (21 options from original)
- Include display labels and IANA timezone identifiers

### Phase 2: Settings Seeding

**2.1 Create Default Settings Seeding Function**
- File: `src/lib/settings/seedDefaultSettings.ts`
- Function to seed all default settings for new tenants
- Call `upsertSetting()` for each default setting

**2.2 Update Tenant Registration**
- File: `src/lib/db/schemaManager.ts`
- Import and call `seedDefaultSettings()` after creating tenant schema
- Ensures new users start with sensible defaults

### Phase 3: Settings Page Redesign

**3.1 Create Settings Section Components**

Each section is a collapsible card with specific inputs:

- `src/components/settings/AccountSection.tsx` - Display user email (read-only)
- `src/components/settings/PreferencesSection.tsx` - Timezone selector
- `src/components/settings/ThemeSection.tsx` - Header color + background image grids
- `src/components/settings/FeaturesSection.tsx` - Feature toggle switches
- `src/components/settings/SecuritySection.tsx` - Password change, session management
- `src/components/settings/DataSection.tsx` - Export, seed default topics
- `src/components/settings/DangerSection.tsx` - Sign out button

**3.2 Create Theme Selection Components**

- `src/components/settings/ColorPicker.tsx` - Grid of color swatches with selection ring
- `src/components/settings/BackgroundPicker.tsx` - Grid of background images with selection ring

**3.3 Create Feature Toggle Component**

- `src/components/settings/FeatureToggle.tsx` - Toggle switch with label and description
- Handles optimistic updates with revert-on-error

**3.4 Update Settings Page**
- File: `src/app/(dashboard)/settings/page.tsx`
- Replace generic key-value table with organized sections
- Fetch all settings and pass to section components
- Each section handles its own updates via server actions

### Phase 4: Server Actions

**4.1 Create Typed Settings Actions**
- File: `src/app/(dashboard)/settings/actions.ts`
- Add validation with Zod schemas
- `updateTimezoneAction(formData)` - Update timezone setting
- `updateThemeAction(formData)` - Update headerColor or backgroundImage
- `toggleFeatureAction(formData)` - Toggle a feature flag
- Each action validates input type before saving

**4.2 Create Settings Helper Functions**
- File: `src/lib/settings/settingsHelpers.ts`
- `getTypedSettings(schemaName)` - Fetch and parse all settings with proper types
- `getSetting<T>(schemaName, key, defaultValue)` - Get single typed setting
- Handle JSONB parsing and type coercion

### Phase 5: Zustand Store Updates

**5.1 Update Auth Store**
- File: `src/stores/authStore.ts`
- Add `userSettings` field to store settings for client-side access
- Add `updateSettings(partial)` action for optimistic updates
- Settings populated after session validation

**5.2 Create Settings Sync**
- On successful login/session validation, fetch and cache settings
- Theme settings (`headerColor`, `backgroundImage`) available for immediate UI use

### Phase 6: Theme Application

**6.1 Create Theme Provider/Hook**
- File: `src/lib/hooks/useTheme.ts`
- Read `headerColor` and `backgroundImage` from auth store
- Apply CSS custom properties or inline styles
- Use localStorage for instant theme switching (before server confirms)

**6.2 Update Layout Components**
- File: `src/components/layout/AppLayout.tsx`
- Apply theme colors from settings
- Support background image display

**6.3 Add Theme CSS Variables**
- File: `src/app/globals.css`
- Define CSS custom properties for theme colors
- `--header-color`, `--accent-color`, etc.

### Phase 7: Timezone Hook

**7.1 Create useTimezone Hook**
- File: `src/lib/hooks/useTimezone.ts`
- Calculate "today" in user's timezone
- Format dates according to user's timezone
- Critical for correct date calculations in journal entries

```typescript
function useTimezone() {
  const { userSettings } = useAuthStore();
  const timezone = userSettings?.timezone || 'UTC';

  const today = useMemo(() => {
    // Calculate current date in user's timezone
  }, [timezone]);

  return { timezone, today, formatDate };
}
```

### Phase 8: Feature Flag Integration

**8.1 Create useFeatureFlags Hook**
- File: `src/lib/hooks/useFeatureFlags.ts`
- Expose feature flags from settings
- Components can check `if (features.foodEnabled)` to show/hide UI

**8.2 Update Taxonomy Display**
- Conditionally show/hide optional feature taxonomies based on flags
- When `foodEnabled` is false, hide Food taxonomy from selectors
- When enabling a feature, auto-create corresponding taxonomy if missing

### Phase 9: Security Features (Future Phase)

These are more complex and could be done in a later phase:

**9.1 Password Change Flow**
- Requires re-encrypting all data (if encryption is implemented)
- Complex multi-step flow

**9.2 Session Management**
- List active sessions
- Revoke individual sessions
- "Sign out all devices"

**9.3 Data Export**
- Export all posts to CSV
- Include topics, content, dates, metadata

---

## Part 4: UI/UX Specifications

### Settings Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Settings                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Account                                         [▼] │    │
│  │ Email: user@example.com                              │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Preferences                                     [▼] │    │
│  │ Timezone: [America/New_York        ▼]               │    │
│  │ Used to determine the current day for entries       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Theme                                           [▼] │    │
│  │                                                      │    │
│  │ Header & Accent Color                               │    │
│  │ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐       │    │
│  │ │██│ │██│ │██│ │██│ │██│ │██│ │██│ │██│ │██│       │    │
│  │ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘       │    │
│  │ (selected has ring)                                  │    │
│  │                                                      │    │
│  │ Background Image                                    │    │
│  │ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐          │    │
│  │ │    │ │    │ │    │ │    │ │    │ │    │          │    │
│  │ │img │ │img │ │img │ │img │ │img │ │img │          │    │
│  │ │    │ │    │ │    │ │    │ │    │ │    │          │    │
│  │ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘          │    │
│  │ (selected has ring, shows artist credit on hover)  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Features                                        [▼] │    │
│  │                                                      │    │
│  │ Food Tracking          [═══○   ]                    │    │
│  │ Track meals and nutrition                           │    │
│  │                                                      │    │
│  │ Medication Tracking    [   ○═══]                    │    │
│  │ Track medications and schedules                     │    │
│  │                                                      │    │
│  │ ... (4 more toggles)                                │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Danger Zone                                     [▼] │    │
│  │                                                      │    │
│  │ [Sign Out]                                          │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Color Swatch Styling

```css
/* Color swatch button */
.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.color-swatch:hover {
  transform: scale(1.1);
}

.color-swatch.selected {
  ring: 2px;
  ring-offset: 2px;
  ring-color: blue-500;
}
```

### Background Image Tile Styling

```css
/* Background image tile */
.bg-tile {
  aspect-ratio: 16/9;
  border-radius: 8px;
  background-size: cover;
  cursor: pointer;
  position: relative;
}

.bg-tile:hover .artist-credit {
  opacity: 1;
}

.bg-tile.selected {
  ring: 2px;
  ring-offset: 2px;
  ring-color: blue-500;
}
```

---

## Part 5: File Structure After Implementation

```
src/
├── lib/
│   ├── settings/
│   │   ├── settingsConfig.ts        # NEW - defaults, colors, images
│   │   ├── timezones.ts             # NEW - timezone options
│   │   ├── seedDefaultSettings.ts   # NEW - seeding function
│   │   └── settingsHelpers.ts       # NEW - typed getters
│   ├── hooks/
│   │   ├── useTimezone.ts           # NEW - timezone calculations
│   │   ├── useTheme.ts              # NEW - theme application
│   │   └── useFeatureFlags.ts       # NEW - feature flag access
│   └── db/
│       └── schemaManager.ts         # UPDATE - call seedDefaultSettings
├── components/
│   └── settings/
│       ├── AccountSection.tsx       # NEW
│       ├── PreferencesSection.tsx   # NEW
│       ├── ThemeSection.tsx         # NEW
│       ├── FeaturesSection.tsx      # NEW
│       ├── SecuritySection.tsx      # NEW (placeholder)
│       ├── DataSection.tsx          # NEW (placeholder)
│       ├── DangerSection.tsx        # NEW
│       ├── ColorPicker.tsx          # NEW
│       ├── BackgroundPicker.tsx     # NEW
│       └── FeatureToggle.tsx        # NEW
├── stores/
│   └── authStore.ts                 # UPDATE - add userSettings
└── app/
    ├── globals.css                  # UPDATE - add theme variables
    └── (dashboard)/
        └── settings/
            ├── page.tsx             # UPDATE - new layout
            └── actions.ts           # UPDATE - typed actions
```

---

## Part 6: Data Flow

### Settings Update Flow

```
┌────────────────────────────────────────────────────────────┐
│                  ThemeSection                               │
├────────────────────────────────────────────────────────────┤
│  User clicks color swatch                                  │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. Optimistic update                                │   │
│  │    - Update Zustand store immediately               │   │
│  │    - Apply CSS variable immediately                 │   │
│  │    - Store in localStorage (for page refresh)       │   │
│  └────────┬────────────────────────────────────────────┘   │
│           │                                                 │
│           ▼                                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 2. Server action                                    │   │
│  │    updateThemeAction({ headerColor: '#1e3a5f' })    │   │
│  │         │                                           │   │
│  │         ▼                                           │   │
│  │    getServerSession() → schemaName                  │   │
│  │         │                                           │   │
│  │         ▼                                           │   │
│  │    upsertSetting(schemaName, 'headerColor', value)  │   │
│  │         │                                           │   │
│  │         ▼                                           │   │
│  │    revalidatePath('/settings')                      │   │
│  └────────┬────────────────────────────────────────────┘   │
│           │                                                 │
│           ▼                                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 3. On error: Revert                                 │   │
│  │    - Restore previous value in Zustand              │   │
│  │    - Restore CSS variable                           │   │
│  │    - Show error toast                               │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

### Feature Toggle Flow

```
┌────────────────────────────────────────────────────────────┐
│  User toggles "Food Tracking" ON                           │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. toggleFeatureAction('foodEnabled', true)         │   │
│  │         │                                           │   │
│  │         ▼                                           │   │
│  │    upsertSetting(schema, 'foodEnabled', true)       │   │
│  └────────┬────────────────────────────────────────────┘   │
│           │                                                 │
│           ▼                                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 2. Check if "Food" taxonomy exists                  │   │
│  │         │                                           │   │
│  │    No → Create taxonomy with icon + color           │   │
│  │    Yes → Do nothing                                 │   │
│  └────────┬────────────────────────────────────────────┘   │
│           │                                                 │
│           ▼                                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 3. Update UI                                        │   │
│  │    - "Food" now appears in TaxonomySelector         │   │
│  │    - PostForm shows Food option                     │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

---

## Part 7: Key Decisions

### Storage Format

Each setting stored as separate key-value pair:
```
key: "headerColor"    value: "#1e3a5f"
key: "foodEnabled"    value: true
key: "timezone"       value: "America/New_York"
```

Benefits:
- Can update individual settings without fetching all
- Flexible schema - add new settings without migrations
- JSONB allows typed values (boolean, string, number)

### Theme Persistence Strategy

Two-layer approach for best UX:
1. **localStorage**: Immediate visual feedback on interaction
2. **Server (database)**: Persistent source of truth

On page load:
1. Check localStorage for theme values (instant)
2. Fetch server settings (async)
3. If server differs, update localStorage

### Feature Toggle Behavior

When enabling a feature:
1. Update setting in database
2. Check if corresponding taxonomy exists
3. If not, create it with default icon/color from `defaultTaxonomies.ts`
4. Taxonomy immediately available in UI

When disabling a feature:
1. Update setting in database
2. Do NOT delete taxonomy (user may have posts with it)
3. Hide from TaxonomySelector
4. Existing posts with that taxonomy still display correctly

### Timezone Handling

- Store IANA timezone string (e.g., "America/New_York")
- All date calculations for "today" use user's timezone
- Display dates in user's timezone
- Store dates in UTC in database

---

## Part 8: Testing Strategy

### Unit Tests

- `settingsConfig.ts` - Constants export correctly
- `settingsHelpers.ts` - Typed getters handle missing/malformed data
- `useTimezone` hook - Correct date calculations
- `FeatureToggle` component - Toggle state and callbacks

### Integration Tests

- Settings page renders all sections
- Color picker updates headerColor setting
- Feature toggle creates taxonomy when enabling
- Timezone selector persists selection

### E2E Tests

- Full settings flow: change theme, verify persistence after refresh
- Enable feature, create post with that taxonomy, disable feature, verify post still displays
- Change timezone, verify "today" calculation changes

---

## Part 9: Migration Checklist

### Phase 1: Foundation (Essential)
- [ ] Create `src/lib/settings/settingsConfig.ts`
- [ ] Create `src/lib/settings/timezones.ts`
- [ ] Create `src/lib/settings/seedDefaultSettings.ts`
- [ ] Update `schemaManager.ts` to seed defaults

### Phase 2: Settings Page (Essential)
- [ ] Create section components
- [ ] Create `ColorPicker.tsx`
- [ ] Create `BackgroundPicker.tsx`
- [ ] Create `FeatureToggle.tsx`
- [ ] Update settings page layout
- [ ] Update server actions

### Phase 3: State & Hooks (Essential)
- [ ] Update `authStore.ts` with userSettings
- [ ] Create `useTimezone.ts` hook
- [ ] Create `useTheme.ts` hook
- [ ] Create `useFeatureFlags.ts` hook

### Phase 4: Theme Application (Essential)
- [ ] Add CSS custom properties
- [ ] Update layout to apply theme

### Phase 5: Feature Integration (Essential)
- [ ] Hide/show taxonomies based on feature flags
- [ ] Auto-create taxonomy on feature enable

### Phase 6: Security (Deferred)
- [ ] Password change flow
- [ ] Session management
- [ ] Data export

---

## Estimated Component Count

| Category | New Files | Updated Files |
|----------|-----------|---------------|
| Settings Config | 4 | 0 |
| Settings Components | 10 | 0 |
| Hooks | 3 | 0 |
| Store | 0 | 1 |
| Page/Actions | 0 | 2 |
| Schema Manager | 0 | 1 |
| Styles | 0 | 1 |
| **Total** | **17** | **5** |

---

## Implementation Order (Suggested)

1. Settings config files (constants, types, defaults)
2. Seed function + schema manager update
3. Auth store updates (userSettings field)
4. Hooks (useTimezone, useTheme, useFeatureFlags)
5. Settings section components
6. ColorPicker and BackgroundPicker
7. FeatureToggle component
8. Settings page redesign
9. Server actions updates
10. Theme application (CSS variables, layout)
11. Feature flag integration (taxonomy visibility)
12. Tests
