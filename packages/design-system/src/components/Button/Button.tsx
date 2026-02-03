import type { ButtonHTMLAttributes } from 'react';
import { forwardRef, useState } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading,
      leftIcon,
      rightIcon,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);

    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.375rem',
      fontFamily: 'var(--font-sans)',
      fontWeight: 500,
      borderRadius: 'var(--radius-md)',
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      transition: 'all 150ms ease',
      border: 'none',
      outline: 'none',
      opacity: disabled || isLoading ? 0.6 : 1,
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
        case 'danger':
          return {
            backgroundColor: isHovered ? 'var(--color-error-dark)' : 'var(--color-error)',
            color: '#ffffff',
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

    const LoadingSpinner = () => (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{
          animation: 'spin 1s linear infinite',
        }}
      >
        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
        <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.75" />
      </svg>
    );

    return (
      <button
        ref={ref}
        style={{ ...baseStyles, ...getVariantStyles(), ...sizeStyles[size] }}
        className={className}
        disabled={disabled || isLoading}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {isLoading ? <LoadingSpinner /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
