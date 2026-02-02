import type { SelectHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, options, style, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const containerStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.375rem',
    };

    const labelStyles: React.CSSProperties = {
      fontSize: 'var(--text-sm)',
      fontWeight: 500,
      color: 'var(--color-text-secondary)',
    };

    const selectStyles: React.CSSProperties = {
      padding: '0.5rem 0.75rem',
      paddingRight: '2rem',
      fontSize: 'var(--text-sm)',
      fontFamily: 'var(--font-sans)',
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      color: 'var(--color-text-primary)',
      cursor: 'pointer',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
      backgroundPosition: 'right 0.5rem center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '1.5em 1.5em',
      transition: 'border-color 150ms ease',
      width: '100%',
      ...style,
    };

    return (
      <div style={containerStyles}>
        {label && (
          <label htmlFor={selectId} style={labelStyles}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          style={selectStyles}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
