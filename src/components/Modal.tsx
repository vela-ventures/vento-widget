import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ModalProps } from '../types';

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  position,
  children,
  backdrop = true,
  className = '',
}) => {
  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const modalPositionClasses = position 
    ? '' 
    : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';

  const modalContent = (
    <>
      {/* Backdrop */}
      {backdrop && (
        <div 
          className="fixed inset-0 z-40 pointer-events-auto bg-transparent"
          onClick={handleBackdropClick}
          data-state="open"
        />
      )}
      
      {/* Modal */}
      <div
        className={`
          fixed z-50 bg-neutral-950/90 text-foreground border border-white/10 rounded-2xl shadow-2xl
          w-[380px] max-h-[85vh] overflow-hidden
          data-[state=open]:animate-in data-[state=closed]:animate-out 
          data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 
          data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 
          data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] 
          data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]
          ${modalPositionClasses}
          ${className}
        `}
        style={position}
        role="dialog"
        aria-modal="true"
        data-state="open"
      >
        {/* Modal content */}
        <div>
          {children}
        </div>
      </div>
    </>
  );
  // Render modal in a portal to ensure proper stacking
  return createPortal(modalContent, document.getElementsByClassName("vento-widget")[0]);
};