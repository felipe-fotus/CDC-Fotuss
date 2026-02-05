import { forwardRef } from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onChange, disabled = false, label, description, size = 'md' }, ref) => {
    const sizes = {
      sm: { width: 36, height: 20, knob: 14 },
      md: { width: 52, height: 28, knob: 20 },
      lg: { width: 64, height: 34, knob: 26 },
    };

    const { width, height, knob } = sizes[size];
    const knobOffset = (height - knob) / 2 - 2;

    const containerStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
    };

    const switchStyle: React.CSSProperties = {
      position: 'relative',
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: checked ? '#3b82f6' : 'var(--color-border)',
      borderRadius: `${height / 2}px`,
      transition: 'background-color 200ms',
      cursor: disabled ? 'not-allowed' : 'pointer',
      flexShrink: 0,
      border: checked ? '2px solid #3b82f6' : '2px solid var(--color-text-muted)',
      outline: 'none',
    };

    const knobStyle: React.CSSProperties = {
      position: 'absolute',
      top: `${knobOffset}px`,
      left: checked ? `${width - knob - knobOffset - 4}px` : `${knobOffset}px`,
      width: `${knob}px`,
      height: `${knob}px`,
      backgroundColor: 'white',
      borderRadius: '50%',
      transition: 'left 200ms',
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    };

    const labelContainerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
    };

    const labelStyle: React.CSSProperties = {
      fontSize: 'var(--text-sm)',
      fontWeight: 700,
      color: 'var(--color-text-primary)',
    };

    const descriptionStyle: React.CSSProperties = {
      fontSize: 'var(--text-xs)',
      fontWeight: 500,
      color: 'var(--color-text-secondary)',
      marginTop: '2px',
    };

    const handleClick = () => {
      if (!disabled) {
        onChange(!checked);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    };

    return (
      <div style={containerStyle} onClick={handleClick}>
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          style={switchStyle}
          onKeyDown={handleKeyDown}
        >
          <div style={knobStyle} />
        </button>
        {(label || description) && (
          <div style={labelContainerStyle}>
            {label && <span style={labelStyle}>{label}</span>}
            {description && <span style={descriptionStyle}>{description}</span>}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
