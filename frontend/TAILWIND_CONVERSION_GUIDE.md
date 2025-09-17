# Tailwind CSS v4 Conversion Guide for Daemon Directorate

## Overview
This guide shows how to convert custom CSS classes to Tailwind utilities in your game application.

## Design System Integration

### Custom Colors in Tailwind Config
Your CSS custom properties are now mapped to Tailwind's color system:

```javascript
// tailwind.config.js
colors: {
  primary: 'rgb(var(--color-primary) / <alpha-value>)',
  'primary-hover': 'rgb(var(--color-primary-hover) / <alpha-value>)',
  background: 'rgb(var(--color-background) / <alpha-value>)',
  surface: 'rgb(var(--color-surface) / <alpha-value>)',
  text: 'rgb(var(--color-text) / <alpha-value>)',
  'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
  // ... more colors
}
```

## CSS Class Conversions

### Layout & Utility Classes

| Old CSS Class | Tailwind Equivalent | Notes |
|---------------|-------------------|-------|
| `.flex` | `flex` | Native Tailwind |
| `.flex-col` | `flex-col` | Native Tailwind |
| `.items-center` | `items-center` | Native Tailwind |
| `.justify-between` | `justify-between` | Native Tailwind |
| `.gap-4` | `gap-1` | Using custom spacing |
| `.gap-8` | `gap-2` | Using custom spacing |
| `.gap-16` | `gap-4` | Using custom spacing |
| `.m-0` | `m-0` | Native Tailwind |
| `.p-0` | `p-0` | Native Tailwind |
| `.hidden` | `hidden` | Native Tailwind |
| `.block` | `block` | Native Tailwind |

### Grid Layouts

| Old CSS Class | Tailwind Equivalent |
|---------------|-------------------|
| `.daemon-grid` | `grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 mb-6` |
| `.planet-grid` | `grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5` |
| `.room-grid` | `grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5` |
| `.equipment-grid` | `grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 mb-6` |
| `.dashboard-grid` | `grid grid-cols-1 md:grid-cols-3 gap-6` |

### Card Components

| Old CSS Class | Tailwind Equivalent |
|---------------|-------------------|
| `.daemon-card` | `bg-surface border border-border rounded-lg p-4 transition-all duration-normal hover:border-primary hover:shadow-md` |
| `.planet-card` | `bg-surface border border-border rounded-lg p-5 transition-all duration-normal hover:border-primary hover:shadow-lg` |
| `.room-card` | `bg-surface border border-border rounded-lg p-5` |
| `.equipment-card` | `bg-surface border border-border rounded-lg p-4` |

### Header and Layout

| Old CSS Class | Tailwind Equivalent |
|---------------|-------------------|
| `.daemon-header` | `flex justify-between items-start mb-3` |
| `.planet-header` | `flex justify-between items-center mb-3` |
| `.room-header` | `flex justify-between items-center mb-3` |
| `.equipment-header` | `flex justify-between items-start mb-3` |

### Typography and Badges

| Old CSS Class | Tailwind Equivalent |
|---------------|-------------------|
| `.daemon-name` | `font-semibold text-text m-0` |
| `.planet-name` | `text-lg font-semibold m-0` |
| `.quirk-tag` | `inline-block bg-bg-3 text-text-secondary px-2 py-0.5 rounded-full text-xs mr-0.5 mt-0.5` |
| `.equipment-type` | `bg-bg-6 text-text px-2 py-0.5 rounded-full text-xs` |

### Status and Progress Elements

| Old CSS Class | Tailwind Equivalent |
|---------------|-------------------|
| `.daemon-stats` | `grid grid-cols-2 gap-2 mb-3` |
| `.stat-bar` | `flex flex-col gap-1` |
| `.stat-label` | `text-xs text-text-secondary font-medium` |
| `.daemon-quirks` | `mt-3` |
| `.daemon-actions` | `mt-3 flex gap-2` |
| `.status-indicator` | `inline-flex items-center gap-1 text-xs font-medium` |

### Buttons

| Old CSS Class | Tailwind Equivalent |
|---------------|-------------------|
| `.btn` | `inline-flex items-center justify-center px-4 py-2 rounded-base text-base font-medium leading-normal cursor-pointer transition-all duration-normal border-none` |
| `.btn--primary` | `bg-primary text-primary-hover hover:bg-primary-hover active:bg-primary-active` |
| `.btn--secondary` | `bg-secondary text-text hover:bg-secondary-hover active:bg-secondary-active` |
| `.btn--outline` | `bg-transparent border border-border text-text hover:bg-secondary` |
| `.btn--sm` | `px-3 py-1 text-sm rounded-sm` |
| `.btn--lg` | `px-5 py-2.5 text-lg rounded-md` |
| `.btn--full-width` | `w-full` |
| `.recruit-btn` | `w-full` |

### Status Badges

| Old CSS Class | Tailwind Equivalent |
|---------------|-------------------|
| `.difficulty-easy` | `bg-bg-3 text-success px-3 py-1 rounded-full text-xs font-semibold` |
| `.difficulty-medium` | `bg-bg-2 text-warning px-3 py-1 rounded-full text-xs font-semibold` |
| `.difficulty-hard` | `bg-bg-4 text-error px-3 py-1 rounded-full text-xs font-semibold` |
| `.room-level` | `bg-secondary px-2 py-1 rounded-full text-xs font-semibold` |

### Info Sections

| Old CSS Class | Tailwind Equivalent |
|---------------|-------------------|
| `.planet-info` | `mb-4 text-sm text-text-secondary` |
| `.planet-reward` | `bg-bg-1 p-3 rounded-sm mb-4` |
| `.room-bonus` | `bg-bg-5 p-2 rounded-sm mb-3 text-sm` |
| `.equipment-ability` | `bg-bg-8 p-2 rounded-sm mb-3 text-sm` |

### Special Components (Keep as Custom CSS)

These components have complex styling that benefits from staying as custom CSS:

- `.progress-bar` and `.progress-fill` variants
- `.status-dot` variants
- `.lifespan-critical` and `.lifespan-warning`
- `.durability-*` variants
- Modal and overlay components
- Custom animations and transitions

## Migration Strategy

1. **Start with layout**: Convert flex, grid, and spacing utilities first
2. **Typography and colors**: Update text styling and color classes
3. **Components**: Convert card and button components
4. **Keep specialized**: Maintain game-specific components as custom CSS
5. **Test thoroughly**: Ensure visual consistency after each conversion

## Example Component Migration

```tsx
// Before (using custom CSS classes)
<div className="daemon-card">
  <div className="daemon-header">
    <h3 className="daemon-name">Daemon Name</h3>
    <span className="daemon-specialization">Hacker</span>
  </div>
  <div className="daemon-stats">
    <div className="stat-bar">
      <span className="stat-label">Health</span>
      <div className="progress-bar">
        <div className="progress-fill health" style={{width: '75%'}}></div>
      </div>
    </div>
  </div>
</div>

// After (using Tailwind utilities + custom CSS where needed)
<div className="bg-surface border border-border rounded-lg p-4 transition-all duration-normal hover:border-primary hover:shadow-md">
  <div className="flex justify-between items-start mb-3">
    <h3 className="font-semibold text-text m-0">Daemon Name</h3>
    <span className="bg-primary text-primary-hover px-2 py-0.5 rounded-full text-xs font-medium">Hacker</span>
  </div>
  <div className="grid grid-cols-2 gap-2 mb-3">
    <div className="flex flex-col gap-1">
      <span className="text-xs text-text-secondary font-medium">Health</span>
      <div className="progress-bar">
        <div className="progress-fill health" style={{width: '75%'}}></div>
      </div>
    </div>
  </div>
</div>
```

## Benefits of This Approach

1. **Consistency**: Tailwind utilities provide consistent spacing and sizing
2. **Performance**: Smaller CSS bundle by eliminating redundant styles
3. **Developer Experience**: Faster development with utility classes
4. **Maintainability**: Easier to modify styles inline
5. **Design System**: Your custom properties work seamlessly with Tailwind

## Next Steps

1. Update your existing components one by one
2. Test the visual output to ensure consistency
3. Remove unused CSS classes from your stylesheet
4. Consider using Tailwind's `@apply` directive for frequently used utility combinations
