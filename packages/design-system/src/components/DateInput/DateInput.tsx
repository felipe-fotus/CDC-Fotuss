import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

export interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, error, helperText, id, style, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const containerStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    };

    const labelStyles: React.CSSProperties = {
      fontSize: 'var(--text-xs)',
      fontWeight: 700,
      color: 'var(--color-text-primary)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    };

    const inputWrapperStyles: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    };

    const inputStyles: React.CSSProperties = {
      width: '100%',
      padding: '0.75rem 1rem',
      paddingRight: '2.5rem',
      fontSize: 'var(--text-sm)',
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text-primary)',
      border: `2px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      transition: 'border-color 150ms ease, box-shadow 150ms ease',
      colorScheme: 'light dark',
      ...style,
    };

    const iconStyles: React.CSSProperties = {
      position: 'absolute',
      right: '12px',
      pointerEvents: 'none',
      color: 'var(--color-text-primary)',
      opacity: 0.8,
    };

    const helperStyles: React.CSSProperties = {
      fontSize: 'var(--text-xs)',
      fontWeight: 600,
      color: error ? 'var(--color-error)' : 'var(--color-text-muted)',
    };

    return (
      <div style={containerStyles}>
        {label && (
          <label htmlFor={inputId} style={labelStyles}>
            {label}
          </label>
        )}
        <div style={inputWrapperStyles}>
          <input
            ref={ref}
            type="date"
            id={inputId}
            style={inputStyles}
            onFocus={(e) => {
              e.target.style.borderColor = error ? 'var(--color-error)' : '#3b82f6';
              e.target.style.boxShadow = error
                ? '0 0 0 3px rgba(239, 68, 68, 0.2)'
                : '0 0 0 3px rgba(59, 130, 246, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)';
              e.target.style.boxShadow = 'none';
            }}
            {...props}
          />
          <svg
            style={iconStyles}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        {(error || helperText) && <span style={helperStyles}>{error || helperText}</span>}
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';
