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
  draggable?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  position?: ModalPosition;
  children?: React.ReactNode;
  backdrop?: boolean;
  className?: string;
  container?: HTMLElement | null;
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
  wallet?: any;
  draggable?: boolean;
  isWalletConnected?: boolean;
  walletAddress?: string;
  onConnectWallet?: () => void;
}

export interface TokenInfo {
  name: string;
  ticker: string;
  denomination: number;
  logo: string;
  processId: string;
}

export interface TokenWithBalance extends TokenInfo {
  balance?: string; // human-readable, already converted from denomination
}
