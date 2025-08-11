export interface ModalPosition {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

export interface FloatingButtonProps {
  onClick: () => void;
  position?: ModalPosition;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  /** Controls icon swap (logo when closed, X when open) */
  isOpen?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  position?: ModalPosition;
  children?: React.ReactNode;
  backdrop?: boolean;
  className?: string;
}

export interface VentoWidgetProps {
  /**
   * Position of the floating button
   */
  position?: ModalPosition;
  
  /**
   * Custom className for the floating button
   */
  buttonClassName?: string;
  
  /**
   * Custom className for the modal
   */
  modalClassName?: string;
  
  /**
   * Whether to show backdrop when modal is open
   */
  showBackdrop?: boolean;
  
  /**
   * Whether the widget is disabled
   */
  disabled?: boolean;
  
  /**
   * Custom content for the floating button
   */
  buttonContent?: React.ReactNode;
  
  /**
   * Custom content for the modal (your swap interface goes here)
   */
  children?: React.ReactNode;
  
  /**
   * Callback when button is clicked
   */
  onButtonClick?: () => void;
  
  /**
   * Callback when modal is closed
   */
  onModalClose?: () => void;
  
  /**
   * Theme for the widget
   */
  theme?: 'light' | 'dark';
}