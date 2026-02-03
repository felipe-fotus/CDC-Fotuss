import type { HTMLAttributes } from 'react';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circle' | 'rectangle';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'shimmer' | 'none';
}

export const Skeleton = ({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  style,
  ...props
}: SkeletonProps) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'text':
        return {
          width: width || '100%',
          height: height || '1em',
          borderRadius: 'var(--radius-sm)',
        };
      case 'circle':
        const size = width || height || '40px';
        return {
          width: size,
          height: size,
          borderRadius: 'var(--radius-full)',
        };
      case 'rectangle':
        return {
          width: width || '100%',
          height: height || '100px',
          borderRadius: 'var(--radius-md)',
        };
      default:
        return {};
    }
  };

  const getAnimationStyles = (): React.CSSProperties => {
    switch (animation) {
      case 'pulse':
        return {
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        };
      case 'shimmer':
        return {
          background: `linear-gradient(
            90deg,
            var(--color-border-subtle) 0%,
            var(--color-border) 50%,
            var(--color-border-subtle) 100%
          )`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s ease-in-out infinite',
        };
      case 'none':
      default:
        return {};
    }
  };

  const baseStyles: React.CSSProperties = {
    backgroundColor: 'var(--color-border-subtle)',
    ...getVariantStyles(),
    ...getAnimationStyles(),
    ...style,
  };

  return <div style={baseStyles} {...props} />;
};

Skeleton.displayName = 'Skeleton';

// Spinner Component
export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const Spinner = ({
  size = 'md',
  color = 'currentColor',
  style,
  ...props
}: SpinnerProps) => {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  const dimension = sizeMap[size];

  const containerStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };

  return (
    <div style={containerStyles} role="status" aria-label="Carregando" {...props}>
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 24 24"
        fill="none"
        style={{ animation: 'spin 1s linear infinite' }}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="3"
          strokeOpacity="0.25"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

Spinner.displayName = 'Spinner';

// Loading Overlay
export interface LoadingOverlayProps extends HTMLAttributes<HTMLDivElement> {
  isLoading: boolean;
  text?: string;
}

export const LoadingOverlay = ({
  isLoading,
  text,
  children,
  style,
  ...props
}: LoadingOverlayProps) => {
  if (!isLoading) return <>{children}</>;

  const overlayStyles: React.CSSProperties = {
    position: 'relative',
    ...style,
  };

  const backdropStyles: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'var(--color-surface)',
    opacity: 0.8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-2)',
    zIndex: 10,
    borderRadius: 'inherit',
  };

  const textStyles: React.CSSProperties = {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    fontWeight: 500,
  };

  return (
    <div style={overlayStyles} {...props}>
      {children}
      <div style={backdropStyles}>
        <Spinner size="lg" color="var(--color-primary)" />
        {text && <span style={textStyles}>{text}</span>}
      </div>
    </div>
  );
};

LoadingOverlay.displayName = 'LoadingOverlay';
