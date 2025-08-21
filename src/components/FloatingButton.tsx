import React from "react";
import { FloatingButtonProps } from "../types";
import { Logo } from "./Logo";

export const FloatingButton = React.forwardRef<
  HTMLButtonElement,
  FloatingButtonProps
>(
  (
    {
      onClick,
      position,
      className = "",
      disabled = false,
      children,
      isOpen,
      draggable = true,
    },
    ref
  ) => {
    const positionClasses = position ? "" : "bottom-6 right-6";

    const positionStyles = position ? position : {};

    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    const [dragPos, setDragPos] = React.useState<{
      left: number;
      top: number;
    } | null>(null);
    const dragState = React.useRef<{
      startX: number;
      startY: number;
      offsetX: number;
      offsetY: number;
    } | null>(null);

    React.useEffect(() => {
      if (dragPos !== null) return;
      if (typeof window === "undefined") return;
      const el = buttonRef.current;
      const btnW = el ? el.offsetWidth : 48;
      const btnH = el ? el.offsetHeight : 48;
      let left: number | null = null;
      let top: number | null = null;
      if (position) {
        if (position.left) left = parseInt(position.left, 10);
        if (position.top) top = parseInt(position.top, 10);
        if (left === null && position.right)
          left = window.innerWidth - parseInt(position.right, 10) - btnW;
        if (top === null && position.bottom)
          top = window.innerHeight - parseInt(position.bottom, 10) - btnH;
      }
      if (left === null) left = window.innerWidth - btnW - 24; // 24px margin
      if (top === null) top = window.innerHeight - btnH - 24;
      setDragPos({ left: Math.max(0, left), top: Math.max(0, top) });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position]);

    React.useEffect(() => {
      if (typeof window === "undefined") return;
      const onResize = () => {
        setDragPos((prev) => {
          if (!prev) return prev;
          const el = buttonRef.current;
          const btnW = el ? el.offsetWidth : 48;
          const btnH = el ? el.offsetHeight : 48;
          return {
            left: Math.min(Math.max(0, prev.left), window.innerWidth - btnW),
            top: Math.min(Math.max(0, prev.top), window.innerHeight - btnH),
          };
        });
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, []);

    const startDrag = (clientX: number, clientY: number) => {
      const el = buttonRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      dragState.current = {
        startX: clientX,
        startY: clientY,
        offsetX: clientX - rect.left,
        offsetY: clientY - rect.top,
      };
      if (dragPos === null) {
        setDragPos({ left: rect.left, top: rect.top });
      }
    };

    const onMouseDown: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      if (!draggable) return;
      startDrag(e.clientX, e.clientY);
      const onMove = (ev: MouseEvent) => {
        if (!dragState.current) return;
        const el = buttonRef.current;
        const btnW = el ? el.offsetWidth : 48;
        const btnH = el ? el.offsetHeight : 48;
        const left = Math.min(
          Math.max(0, ev.clientX - dragState.current.offsetX),
          window.innerWidth - btnW
        );
        const top = Math.min(
          Math.max(0, ev.clientY - dragState.current.offsetY),
          window.innerHeight - btnH
        );
        setDragPos({ left, top });
      };
      const onUp = () => {
        dragState.current = null;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    };

    const onTouchStart: React.TouchEventHandler<HTMLButtonElement> = (e) => {
      if (!draggable) return;
      const t = e.touches[0];
      if (!t) return;
      startDrag(t.clientX, t.clientY);
      const onMove = (ev: TouchEvent) => {
        const tt = ev.touches[0];
        if (!tt || !dragState.current) return;
        const el = buttonRef.current;
        const btnW = el ? el.offsetWidth : 48;
        const btnH = el ? el.offsetHeight : 48;
        const left = Math.min(
          Math.max(0, tt.clientX - dragState.current.offsetX),
          window.innerWidth - btnW
        );
        const top = Math.min(
          Math.max(0, tt.clientY - dragState.current.offsetY),
          window.innerHeight - btnH
        );
        setDragPos({ left, top });
      };
      const onEnd = () => {
        dragState.current = null;
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", onEnd);
      };
      window.addEventListener("touchmove", onMove, { passive: false });
      window.addEventListener("touchend", onEnd);
    };

    return (
      <button
        ref={(node) => {
          if (typeof ref === "function") ref(node as HTMLButtonElement);
          // @ts-ignore
          else if (ref)
            (ref as React.MutableRefObject<HTMLButtonElement | null>).current =
              node;
          buttonRef.current = node;
        }}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
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
          ${dragPos ? "" : positionClasses}
          ${className}
        `}
        style={
          dragPos ? { left: dragPos.left, top: dragPos.top } : positionStyles
        }
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
              <div className="flex items-center justify-center size-8">
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
