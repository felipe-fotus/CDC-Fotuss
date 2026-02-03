export const colors = {
  // Brand
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Neutral
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  // Semantic
  success: {
    light: '#f0fdf4',
    main: '#22c55e',
    dark: '#15803d',
  },
  warning: {
    light: '#fefce8',
    main: '#eab308',
    dark: '#a16207',
  },
  error: {
    light: '#fef2f2',
    main: '#ef4444',
    dark: '#b91c1c',
  },
  info: {
    light: '#eff6ff',
    main: '#3b82f6',
    dark: '#1d4ed8',
  },

  // Criticality (specific to CDC Fotus)
  criticality: {
    low: {
      bg: { light: '#f0fdf4', dark: 'rgba(34, 197, 94, 0.15)' },
      text: { light: '#15803d', dark: '#4ade80' },
    },
    medium: {
      bg: { light: '#fefce8', dark: 'rgba(234, 179, 8, 0.15)' },
      text: { light: '#a16207', dark: '#facc15' },
    },
    high: {
      bg: { light: '#fff7ed', dark: 'rgba(249, 115, 22, 0.15)' },
      text: { light: '#c2410c', dark: '#fb923c' },
    },
    critical: {
      bg: { light: '#fef2f2', dark: 'rgba(239, 68, 68, 0.15)' },
      text: { light: '#b91c1c', dark: '#f87171' },
    },
  },
} as const;

export type Colors = typeof colors;

// Theme-specific color mappings
export const lightTheme = {
  bg: colors.slate[50],
  surface: '#ffffff',
  textPrimary: colors.slate[900],
  textSecondary: colors.slate[600],
  primary: colors.primary[500],
  border: colors.slate[200],
} as const;

export const darkTheme = {
  bg: colors.slate[900],
  surface: colors.slate[800],
  textPrimary: colors.slate[100],
  textSecondary: colors.slate[400],
  primary: colors.primary[400],
  border: colors.slate[700],
} as const;
