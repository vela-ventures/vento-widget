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
  position?: ModalPosition;
  buttonClassName?: string;
  modalClassName?: string;
  showBackdrop?: boolean;
  disabled?: boolean;
  buttonContent?: React.ReactNode;
  children?: React.ReactNode;
  onButtonClick?: () => void;
  onModalClose?: () => void;
  theme?: "light" | "dark";
}
