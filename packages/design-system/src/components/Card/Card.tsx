import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  clickable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      clickable,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const baseStyles: React.CSSProperties = {
      borderRadius: 'var(--radius-lg)',
      transition: 'var(--transition-base)',
      cursor: clickable ? 'pointer' : 'default',
    };

    const variantStyles: Record<string, React.CSSProperties> = {
      default: {
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border-subtle)',
      },
      elevated: {
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--shadow-md)',
      },
      outlined: {
        backgroundColor: 'transparent',
        border: '1px solid var(--color-border)',
      },
    };

    const paddingStyles: Record<string, React.CSSProperties> = {
      none: { padding: 0 },
      sm: { padding: 'var(--spacing-3)' },
      md: { padding: 'var(--spacing-4)' },
      lg: { padding: 'var(--spacing-6)' },
    };

    return (
      <div
        ref={ref}
        style={{
          ...baseStyles,
          ...variantStyles[variant],
          ...paddingStyles[padding],
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, style, ...props }, ref) => {
    const headerStyles: React.CSSProperties = {
      padding: 'var(--spacing-4)',
      borderBottom: '1px solid var(--color-border-subtle)',
      ...style,
    };

    return (
      <div ref={ref} style={headerStyles} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// Card Body
export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, style, ...props }, ref) => {
    const bodyStyles: React.CSSProperties = {
      padding: 'var(--spacing-4)',
      ...style,
    };

    return (
      <div ref={ref} style={bodyStyles} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

// Card Footer
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, style, ...props }, ref) => {
    const footerStyles: React.CSSProperties = {
      padding: 'var(--spacing-4)',
      borderTop: '1px solid var(--color-border-subtle)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-2)',
      ...style,
    };

    return (
      <div ref={ref} style={footerStyles} {...props}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
