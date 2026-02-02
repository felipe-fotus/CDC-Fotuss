import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, style, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const containerStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
    };

    const labelStyles: React.CSSProperties = {
      fontSize: 'var(--text-xs)',
      fontWeight: 500,
      color: 'var(--color-text-muted)',
    };

    const inputStyles: React.CSSProperties = {
      padding: '0.5rem 0.75rem',
      fontSize: 'var(--text-sm)',
      fontFamily: 'var(--font-sans)',
      backgroundColor: 'var(--color-bg)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      color: 'var(--color-text-primary)',
      transition: 'border-color 150ms ease, background-color 150ms ease',
      width: '100%',
      outline: 'none',
      ...style,
    };

    return (
      <div style={containerStyles}>
        {label && (
          <label htmlFor={inputId} style={labelStyles}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          style={inputStyles}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-primary)';
            e.target.style.backgroundColor = 'var(--color-surface)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--color-border)';
            e.target.style.backgroundColor = 'var(--color-bg)';
          }}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
