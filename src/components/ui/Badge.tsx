import type { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'low' | 'medium' | 'high' | 'critical';
}

const Badge = ({ variant = 'default', children, style, ...props }: BadgeProps) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.125rem 0.5rem',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    borderRadius: 'var(--radius-sm)',
    whiteSpace: 'nowrap',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      backgroundColor: 'var(--color-border-subtle)',
      color: 'var(--color-text-secondary)',
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
    <span style={{ ...baseStyles, ...variantStyles[variant], ...style }} {...props}>
      {children}
    </span>
  );
};

export default Badge;
