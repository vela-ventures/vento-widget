import "./styles.css"

// Main widget component
export { VentoWidget } from './components/VentoWidget';

// Individual components for advanced usage
export { FloatingButton } from './components/FloatingButton';
export { Modal } from './components/Modal';

// Hooks
export { useModal } from './hooks/useModal';

// Types
export type {
  VentoWidgetProps,
  FloatingButtonProps,
  ModalProps,
  ModalPosition,
} from './types';

// Styles are compiled and included - just import '@vento/widget/styles.css'