import { useState, useRef, useEffect } from 'react';

export interface TooltipProps {
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  children: React.ReactElement;
}

export const Tooltip = ({
  content,
  position = 'top',
  delay = 200,
  children,
  ...props
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const gap = 8;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - gap;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + gap;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - gap;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + gap;
        break;
    }

    // Clamp to viewport
    const padding = 8;
    left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding));
    top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding));

    setCoords({ top, left });
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
    }
  }, [isVisible, position]);

  const showTooltip = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const tooltipStyles: React.CSSProperties = {
    position: 'fixed',
    top: coords.top,
    left: coords.left,
    zIndex: 'var(--z-tooltip)',
    padding: 'var(--spacing-2) var(--spacing-3)',
    backgroundColor: 'var(--color-slate-900)',
    color: 'var(--color-slate-100)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-lg)',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'scale(1)' : 'scale(0.95)',
    transition: 'opacity 150ms ease, transform 150ms ease',
  };

  const arrowStyles: React.CSSProperties = {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    ...(position === 'top' && {
      bottom: '-4px',
      left: '50%',
      transform: 'translateX(-50%)',
      borderWidth: '4px 4px 0 4px',
      borderColor: 'var(--color-slate-900) transparent transparent transparent',
    }),
    ...(position === 'bottom' && {
      top: '-4px',
      left: '50%',
      transform: 'translateX(-50%)',
      borderWidth: '0 4px 4px 4px',
      borderColor: 'transparent transparent var(--color-slate-900) transparent',
    }),
    ...(position === 'left' && {
      right: '-4px',
      top: '50%',
      transform: 'translateY(-50%)',
      borderWidth: '4px 0 4px 4px',
      borderColor: 'transparent transparent transparent var(--color-slate-900)',
    }),
    ...(position === 'right' && {
      left: '-4px',
      top: '50%',
      transform: 'translateY(-50%)',
      borderWidth: '4px 4px 4px 0',
      borderColor: 'transparent var(--color-slate-900) transparent transparent',
    }),
  };

  return (
    <>
      <div
        ref={triggerRef}
        style={{ display: 'inline-block' }}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      {isVisible && (
        <div ref={tooltipRef} style={tooltipStyles} role="tooltip" {...props}>
          {content}
          <div style={arrowStyles} />
        </div>
      )}
    </>
  );
};

Tooltip.displayName = 'Tooltip';
