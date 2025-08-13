import React from "react";
import { FloatingButtonProps } from "../types";
import { Logo } from "./Logo";

export const FloatingButton = React.forwardRef<
  HTMLButtonElement,
  FloatingButtonProps
>(
  (
    { onClick, position, className = "", disabled = false, children, isOpen },
    ref
  ) => {
    const positionClasses = position ? "" : "bottom-6 right-6";

    const positionStyles = position ? position : {};

    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={`
          fixed z-50 h-12 w-12 rounded-full 
          bg-card text-white border border-white/10 backdrop-blur-md
          shadow-xl shadow-black/40
          transition-all duration-200 ease-in-out hover:scale-105 
          active:scale-95 
          focus:outline-none
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          flex items-center justify-center
          ${positionClasses}
          ${className}
        `}
        style={positionStyles}
        aria-label="Open widget"
        type="button"
      >
        {children || (
          <span
            className={`grid place-items-center transition-all duration-150 ${
              isOpen ? "rotate-90 scale-110" : "rotate-0"
            }`}
          >
            {isOpen ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            ) : (
              <div className="flex items-center justify-center size-5">
                <Logo />
              </div>
            )}
          </span>
        )}
      </button>
    );
  }
);

FloatingButton.displayName = "FloatingButton";
