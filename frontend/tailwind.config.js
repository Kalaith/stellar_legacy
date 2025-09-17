/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      // Basic colors
      inherit: 'inherit',
      current: 'currentColor',
      transparent: 'transparent',
      white: '#ffffff',
      black: '#000000',

      // Tailwind default colors (keep some for compatibility)
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
      red: {
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
      },
      green: {
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
      },
      blue: {
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
      },
      yellow: {
        400: '#facc15',
        500: '#eab308',
        600: '#ca8a04',
      },
      purple: {
        400: '#a78bfa',
        500: '#8b5cf6',
        600: '#7c3aed',
      },
      pink: {
        400: '#f472b6',
        500: '#ec4899',
        600: '#db2777',
      },
      indigo: {
        400: '#818cf8',
        500: '#6366f1',
        600: '#4f46e5',
        900: '#312e81',
      },
      cyan: {
        400: '#22d3ee',
        500: '#06b6d4',
        600: '#0891b2',
      },
      orange: {
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c',
      },
      emerald: {
        400: '#34d399',
        500: '#10b981',
        600: '#059669',
      },

      // Custom game palette using CSS custom properties
      cream: {
        50: 'var(--color-cream-50)',
        100: 'var(--color-cream-100)',
      },
      charcoal: {
        700: 'var(--color-charcoal-700)',
        800: 'var(--color-charcoal-800)',
      },
      slate: {
        500: 'var(--color-slate-500)',
        900: 'var(--color-slate-900)',
      },
      teal: {
        300: 'var(--color-teal-300)',
        400: 'var(--color-teal-400)',
        500: 'var(--color-teal-500)',
        600: 'var(--color-teal-600)',
        700: 'var(--color-teal-700)',
        800: 'var(--color-teal-800)',
      },
      brown: {
        600: 'var(--color-brown-600)',
      },

      // Semantic design system colors
      primary: 'var(--color-primary)',
      'primary-hover': 'var(--color-primary-hover)',
      'primary-active': 'var(--color-primary-active)',
      background: 'var(--color-background)',
      surface: 'var(--color-surface)',
      text: 'var(--color-text)',
      'text-secondary': 'var(--color-text-secondary)',
      border: 'var(--color-border)',
      'card-border': 'var(--color-card-border)',
      error: 'var(--color-error)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      info: 'var(--color-info)',

      // Contextual background utilities
      'bg-1': 'var(--color-bg-1)',
      'bg-2': 'var(--color-bg-2)',
      'bg-3': 'var(--color-bg-3)',
      'bg-4': 'var(--color-bg-4)',
      'bg-5': 'var(--color-bg-5)',
      'bg-6': 'var(--color-bg-6)',
      'bg-7': 'var(--color-bg-7)',
      'bg-8': 'var(--color-bg-8)',
    },
    extend: {
      fontFamily: {
        base: 'var(--font-family-base)',
        mono: 'var(--font-family-mono)',
      },
      fontSize: {
        xs: 'var(--font-size-xs)',
        sm: 'var(--font-size-sm)',
        base: 'var(--font-size-base)',
        md: 'var(--font-size-md)',
        lg: 'var(--font-size-lg)',
        xl: 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
      },
      fontWeight: {
        normal: 'var(--font-weight-normal)',
        medium: 'var(--font-weight-medium)',
        semibold: 'var(--font-weight-semibold)',
        bold: 'var(--font-weight-bold)',
      },
      lineHeight: {
        tight: 'var(--line-height-tight)',
        normal: 'var(--line-height-normal)',
      },
      letterSpacing: {
        tight: 'var(--letter-spacing-tight)',
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        4: 'var(--space-4)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        10: 'var(--space-10)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
        20: 'var(--space-20)',
        24: 'var(--space-24)',
        32: 'var(--space-32)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        base: 'var(--radius-base)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        'inset-sm': 'var(--shadow-inset-sm)',
        focus: 'var(--focus-ring)',
      },
      animation: {
        'pulse-game': 'pulse 0.3s ease-in-out',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
      },
      transitionTimingFunction: {
        standard: 'var(--ease-standard)',
      },
      maxWidth: {
        'container-sm': 'var(--container-sm)',
        'container-md': 'var(--container-md)',
        'container-lg': 'var(--container-lg)',
        'container-xl': 'var(--container-xl)',
      },
    },
  },
  plugins: [],
};
