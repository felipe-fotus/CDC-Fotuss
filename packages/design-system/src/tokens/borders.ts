// Re-export from spacing for backwards compatibility
// Main definitions are in spacing.ts
export { borderRadius, shadows } from './spacing';

export const borders = {
  width: {
    0: '0',
    1: '1px',
    2: '2px',
    4: '4px',
  },
} as const;

// Dark mode shadows with adjusted opacity
export const shadowsDark = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
} as const;

export type Borders = typeof borders;
export type ShadowsDark = typeof shadowsDark;
