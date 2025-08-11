import { useState, useEffect, useCallback, useRef } from 'react';
import { ModalPosition } from '../types';

export function useModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [modalPosition, setModalPosition] = useState<ModalPosition>({});
  const buttonRef = useRef<HTMLButtonElement>(null);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Calculate modal position relative to button
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Modal dimensions (approximate)
      const modalWidth = 384; // max-w-md (24rem = 384px)
      const modalHeight = 400; // max-h-96 (24rem = 384px, but we use 400 for safety)
      
      let position: ModalPosition = {};
      
      // Determine horizontal position
      if (buttonRect.right + modalWidth + 16 <= viewportWidth) {
        // Place to the right of button
        position.left = `${buttonRect.right + 8}px`;
      } else if (buttonRect.left - modalWidth - 16 >= 0) {
        // Place to the left of button
        position.right = `${viewportWidth - buttonRect.left + 8}px`;
      } else {
        // Center horizontally with some margin
        position.left = `${Math.max(16, (viewportWidth - modalWidth) / 2)}px`;
      }
      
      // Determine vertical position
      if (buttonRect.top + modalHeight + 16 <= viewportHeight) {
        // Place below button
        position.top = `${buttonRect.bottom + 8}px`;
      } else if (buttonRect.bottom - modalHeight - 16 >= 0) {
        // Place above button
        position.bottom = `${viewportHeight - buttonRect.top + 8}px`;
      } else {
        // Center vertically with some margin
        position.top = `${Math.max(16, (viewportHeight - modalHeight) / 2)}px`;
      }
      
      setModalPosition(position);
    }
  }, [isOpen]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, close]);

  return {
    isOpen,
    open,
    close,
    toggle,
    modalPosition,
    buttonRef,
  };
}