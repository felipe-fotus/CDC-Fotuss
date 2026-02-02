import type { ButtonHTMLAttributes } from 'react';
import { forwardRef, useState } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false);

    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.375rem',
      fontFamily: 'var(--font-sans)',
      fontWeight: 500,
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      transition: 'all 150ms ease',
      border: 'none',
      outline: 'none',
    };

    const getVariantStyles = (): React.CSSProperties => {
      switch (variant) {
        case 'primary':
          return {
            backgroundColor: isHovered ? 'var(--color-primary-hover)' : 'var(--color-primary)',
            color: '#ffffff',
          };
        case 'secondary':
          return {
            backgroundColor: isHovered ? 'var(--color-bg)' : 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
          };
        case 'ghost':
          return {
            backgroundColor: isHovered ? 'var(--color-primary-subtle)' : 'transparent',
            color: isHovered ? 'var(--color-primary)' : 'var(--color-text-secondary)',
          };
        default:
          return {};
      }
    };

    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: {
        padding: '0.375rem 0.625rem',
        fontSize: 'var(--text-xs)',
      },
      md: {
        padding: '0.5rem 0.875rem',
        fontSize: 'var(--text-sm)',
      },
      lg: {
        padding: '0.625rem 1.25rem',
        fontSize: 'var(--text-sm)',
      },
    };

    return (
      <button
        ref={ref}
        style={{ ...baseStyles, ...getVariantStyles(), ...sizeStyles[size] }}
        className={className}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
