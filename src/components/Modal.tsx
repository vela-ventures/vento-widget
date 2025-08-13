import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { ModalProps } from "../types";

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  position,
  children,
  backdrop = true,
  className = "",
  container,
}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  const modalPositionClasses = position
    ? ""
    : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";

  const modalContent = (
    <>
      {backdrop && isOpen && (
        <div
          className="fixed inset-0 z-40 pointer-events-auto bg-transparent"
          onClick={handleBackdropClick}
          data-state={isOpen ? "open" : "closed"}
        />
      )}
      <div
        className={`
          fixed z-50 bg-card text-foreground border border-white/10 rounded-2xl shadow-2xl
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
        aria-modal={isOpen ? "true" : undefined}
        data-state={isOpen ? "open" : "closed"}
        hidden={!isOpen}
      >
        <div>{children}</div>
      </div>
    </>
  );
  const target =
    container ??
    document.getElementsByClassName("vento-widget")[0] ??
    document.body;
  return createPortal(modalContent, target);
};
