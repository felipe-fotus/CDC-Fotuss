import type { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'low' | 'medium' | 'high' | 'critical';
  size?: 'sm' | 'md';
}

export const Badge = ({
  variant = 'default',
  size = 'md',
  children,
  style,
  ...props
}: BadgeProps) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    fontWeight: 500,
    borderRadius: 'var(--radius-sm)',
    whiteSpace: 'nowrap',
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: '0.0625rem 0.375rem',
      fontSize: 'var(--text-xs)',
    },
    md: {
      padding: '0.125rem 0.5rem',
      fontSize: 'var(--text-xs)',
    },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      backgroundColor: 'var(--color-border-subtle)',
      color: 'var(--color-text-secondary)',
    },
    success: {
      backgroundColor: 'var(--color-success-light)',
      color: 'var(--color-success-dark)',
    },
    warning: {
      backgroundColor: 'var(--color-warning-light)',
      color: 'var(--color-warning-dark)',
    },
    error: {
      backgroundColor: 'var(--color-error-light)',
      color: 'var(--color-error-dark)',
    },
    info: {
      backgroundColor: 'var(--color-info-light)',
      color: 'var(--color-info-dark)',
    },
    low: {
      backgroundColor: 'var(--color-criticality-low)',
      color: 'var(--color-criticality-low-text)',
      border: '1px solid var(--color-criticality-low-border)',
    },
    medium: {
      backgroundColor: 'var(--color-criticality-medium)',
      color: 'var(--color-criticality-medium-text)',
      border: '1px solid var(--color-criticality-medium-border)',
    },
    high: {
      backgroundColor: 'var(--color-criticality-high)',
      color: 'var(--color-criticality-high-text)',
      border: '1px solid var(--color-criticality-high-border)',
    },
    critical: {
      backgroundColor: 'var(--color-criticality-critical)',
      color: 'var(--color-criticality-critical-text)',
      border: '1px solid var(--color-criticality-critical-border)',
    },
  };

  return (
    <span
      style={{ ...baseStyles, ...sizeStyles[size], ...variantStyles[variant], ...style }}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
