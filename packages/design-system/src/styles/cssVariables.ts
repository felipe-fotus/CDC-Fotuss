import { colors, lightTheme, darkTheme } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { spacing, borderRadius, shadows } from '../tokens/spacing';
import { breakpoints } from '../tokens/breakpoints';

export type Theme = 'light' | 'dark';

const flattenObject = (
  obj: Record<string, unknown>,
  prefix = ''
): Record<string, string> => {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}-${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
    } else {
      result[newKey] = String(value);
    }
  }

  return result;
};

export function generateCSSVariables(theme: Theme = 'light'): string {
  const themeColors = theme === 'light' ? lightTheme : darkTheme;
  const lines: string[] = [];

  // Base colors
  const flatColors = flattenObject(colors.primary, 'color-primary');
  const flatSlate = flattenObject(colors.slate, 'color-slate');

  for (const [key, value] of Object.entries({ ...flatColors, ...flatSlate })) {
    lines.push(`  --${key}: ${value};`);
  }

  // Theme-specific colors
  lines.push(`  --color-bg: ${themeColors.bg};`);
  lines.push(`  --color-surface: ${themeColors.surface};`);
  lines.push(`  --color-text-primary: ${themeColors.textPrimary};`);
  lines.push(`  --color-text-secondary: ${themeColors.textSecondary};`);
  lines.push(`  --color-primary: ${themeColors.primary};`);
  lines.push(`  --color-border: ${themeColors.border};`);

  // Semantic colors
  lines.push(`  --color-success-light: ${colors.success.light};`);
  lines.push(`  --color-success: ${colors.success.main};`);
  lines.push(`  --color-success-dark: ${colors.success.dark};`);
  lines.push(`  --color-warning-light: ${colors.warning.light};`);
  lines.push(`  --color-warning: ${colors.warning.main};`);
  lines.push(`  --color-warning-dark: ${colors.warning.dark};`);
  lines.push(`  --color-error-light: ${colors.error.light};`);
  lines.push(`  --color-error: ${colors.error.main};`);
  lines.push(`  --color-error-dark: ${colors.error.dark};`);
  lines.push(`  --color-info-light: ${colors.info.light};`);
  lines.push(`  --color-info: ${colors.info.main};`);
  lines.push(`  --color-info-dark: ${colors.info.dark};`);

  // Typography
  lines.push(`  --font-sans: ${typography.fontFamily.sans};`);
  lines.push(`  --font-mono: ${typography.fontFamily.mono};`);

  for (const [key, value] of Object.entries(typography.fontSize)) {
    lines.push(`  --text-${key}: ${value};`);
  }

  for (const [key, value] of Object.entries(typography.fontWeight)) {
    lines.push(`  --font-${key}: ${value};`);
  }

  for (const [key, value] of Object.entries(typography.lineHeight)) {
    lines.push(`  --leading-${key}: ${value};`);
  }

  // Spacing
  for (const [key, value] of Object.entries(spacing)) {
    lines.push(`  --spacing-${key}: ${value};`);
  }

  // Border radius
  for (const [key, value] of Object.entries(borderRadius)) {
    lines.push(`  --radius-${key}: ${value};`);
  }

  // Shadows
  for (const [key, value] of Object.entries(shadows)) {
    lines.push(`  --shadow-${key}: ${value};`);
  }

  // Breakpoints
  for (const [key, value] of Object.entries(breakpoints)) {
    lines.push(`  --breakpoint-${key}: ${value};`);
  }

  return `:root {\n${lines.join('\n')}\n}`;
}

// Generate theme-specific overrides
export function generateThemeOverrides(theme: Theme): string {
  if (theme === 'light') {
    return ''; // Light is default, no overrides needed
  }

  const lines: string[] = [];
  const themeColors = darkTheme;

  lines.push(`  --color-bg: ${themeColors.bg};`);
  lines.push(`  --color-surface: ${themeColors.surface};`);
  lines.push(`  --color-text-primary: ${themeColors.textPrimary};`);
  lines.push(`  --color-text-secondary: ${themeColors.textSecondary};`);
  lines.push(`  --color-primary: ${themeColors.primary};`);
  lines.push(`  --color-border: ${themeColors.border};`);

  return `[data-theme="dark"] {\n${lines.join('\n')}\n}`;
}
