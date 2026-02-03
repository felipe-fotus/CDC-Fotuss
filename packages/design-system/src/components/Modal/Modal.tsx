import type { HTMLAttributes } from 'react';
import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  children,
  style,
  ...props
}: ModalProps) => {
  const handleEscKey = useCallback(
    (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEsc, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscKey]);

  if (!isOpen) return null;

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-4)',
    zIndex: 'var(--z-modal-backdrop)',
    animation: 'fadeIn 150ms ease',
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { maxWidth: '400px', width: '100%' },
    md: { maxWidth: '500px', width: '100%' },
    lg: { maxWidth: '700px', width: '100%' },
    xl: { maxWidth: '900px', width: '100%' },
    full: { maxWidth: 'calc(100vw - 2rem)', width: '100%', maxHeight: 'calc(100vh - 2rem)' },
  };

  const modalStyles: React.CSSProperties = {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-xl)',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 'calc(100vh - 4rem)',
    zIndex: 'var(--z-modal)',
    animation: 'slideUp 200ms ease',
    ...sizeStyles[size],
    ...style,
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-4)',
    borderBottom: '1px solid var(--color-border-subtle)',
    flexShrink: 0,
  };

  const titleStyles: React.CSSProperties = {
    margin: 0,
    fontSize: 'var(--text-lg)',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
  };

  const closeButtonStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    padding: 0,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
    transition: 'var(--transition-fast)',
  };

  const bodyStyles: React.CSSProperties = {
    padding: 'var(--spacing-4)',
    overflowY: 'auto',
    flex: 1,
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div style={overlayStyles} onClick={handleOverlayClick}>
      <div style={modalStyles} role="dialog" aria-modal="true" {...props}>
        {(title || showCloseButton) && (
          <div style={headerStyles}>
            {title && <h2 style={titleStyles}>{title}</h2>}
            {showCloseButton && (
              <button
                type="button"
                style={closeButtonStyles}
                onClick={onClose}
                aria-label="Fechar"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div style={bodyStyles}>{children}</div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
};

Modal.displayName = 'Modal';

// Modal Footer
export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ModalFooter = ({ children, style, ...props }: ModalFooterProps) => {
  const footerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-4)',
    borderTop: '1px solid var(--color-border-subtle)',
    flexShrink: 0,
    ...style,
  };

  return (
    <div style={footerStyles} {...props}>
      {children}
    </div>
  );
};

ModalFooter.displayName = 'ModalFooter';
