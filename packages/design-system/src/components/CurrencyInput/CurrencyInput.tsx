import type { InputHTMLAttributes } from 'react';
import { forwardRef, useState, useEffect } from 'react';

export interface CurrencyInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  value: number;
  onChange: (value: number) => void;
  onValidate?: (value: number) => string | null;
  minValue?: number;
  maxValue?: number;
  currency?: string;
}

// Formata número para moeda brasileira: 150000 → 150.000,00
const formatCurrencyValue = (value: number): string => {
  if (isNaN(value) || value === 0) return '';
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Parseia string de moeda para número: "150.000,00" → 150000
const parseCurrencyString = (str: string): number => {
  if (!str) return 0;
  // Remove todos os pontos (separadores de milhar)
  // Substitui vírgula por ponto (separador decimal)
  const cleaned = str.replace(/\./g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// Formata input em tempo real enquanto o usuário digita
// Entrada: apenas números, saída: formato brasileiro
const formatInputValue = (input: string): string => {
  // Remove tudo que não é número
  const numbers = input.replace(/\D/g, '');
  if (!numbers) return '';

  // Converte para centavos e depois para reais
  const cents = parseInt(numbers, 10);
  const reais = cents / 100;

  return reais.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      label,
      error: externalError,
      helperText,
      id,
      style,
      value,
      onChange,
      onValidate,
      minValue,
      maxValue,
      currency = 'R$',
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState('');
    const [internalError, setInternalError] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    const error = externalError || internalError;
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    // Sincroniza valor externo com display
    useEffect(() => {
      if (!isFocused && value > 0) {
        setDisplayValue(formatCurrencyValue(value));
      } else if (!isFocused && value === 0) {
        setDisplayValue('');
      }
    }, [value, isFocused]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const formatted = formatInputValue(raw);
      setDisplayValue(formatted);

      // Converte para número e notifica
      const numericValue = parseCurrencyString(formatted);
      onChange(numericValue);
    };

    const handleBlur = () => {
      setIsFocused(false);
      const numericValue = parseCurrencyString(displayValue);

      // Validação de limites
      if (minValue !== undefined && numericValue < minValue && numericValue > 0) {
        setInternalError(
          `Valor abaixo do mínimo (${currency} ${formatCurrencyValue(minValue)})`
        );
        return;
      }

      if (maxValue !== undefined && numericValue > maxValue) {
        // Auto-corrige para o máximo
        setDisplayValue(formatCurrencyValue(maxValue));
        onChange(maxValue);
        setInternalError(null);
        return;
      }

      // Auto-corrige para mínimo se valor for 0 ou muito baixo
      if (minValue !== undefined && numericValue === 0) {
        setDisplayValue(formatCurrencyValue(minValue));
        onChange(minValue);
        setInternalError(null);
        return;
      }

      // Validação customizada
      if (onValidate) {
        const validationError = onValidate(numericValue);
        setInternalError(validationError);
      } else {
        setInternalError(null);
      }

      // Formata o valor final
      if (numericValue > 0) {
        setDisplayValue(formatCurrencyValue(numericValue));
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      e.target.style.borderColor = error ? 'var(--color-error)' : '#3b82f6';
      e.target.style.boxShadow = error
        ? '0 0 0 3px rgba(239, 68, 68, 0.2)'
        : '0 0 0 3px rgba(59, 130, 246, 0.2)';
    };

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

    const prefixStyles: React.CSSProperties = {
      position: 'absolute',
      left: '12px',
      color: 'var(--color-text-secondary)',
      fontWeight: 600,
      fontSize: 'var(--text-sm)',
      pointerEvents: 'none',
    };

    const inputStyles: React.CSSProperties = {
      width: '100%',
      padding: '0.75rem 1rem',
      paddingLeft: '2.5rem',
      fontSize: 'var(--text-sm)',
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      backgroundColor: error ? 'rgba(239, 68, 68, 0.1)' : 'var(--color-bg)',
      color: 'var(--color-text-primary)',
      border: `2px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      transition: 'border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease',
      ...style,
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
          <span style={prefixStyles}>{currency}</span>
          <input
            ref={ref}
            type="text"
            id={inputId}
            style={inputStyles}
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder="0,00"
            inputMode="numeric"
            {...props}
          />
        </div>
        {(error || helperText) && <span style={helperStyles}>{error || helperText}</span>}
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';
