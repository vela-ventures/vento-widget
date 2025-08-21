import React from "react";
import { FloatingButton } from "./FloatingButton";
import { Modal } from "./Modal";
import { useModal } from "../hooks/useModal";
import { VentoWidgetProps } from "../types";
import "../styles.css";
import { ModalContent } from "./ModalContent";

export const VentoWidget: React.FC<VentoWidgetProps> = ({
  position,
  buttonClassName,
  modalClassName,
  showBackdrop = true,
  disabled = false,
  buttonContent,
  children,
  onButtonClick,
  onModalClose,
  theme = "dark",
  userAddress,
  signer,
  draggable = true,
}) => {
  const { isOpen, open, close, modalPosition, buttonRef } = useModal();

  const handleButtonClick = () => {
    if (isOpen) {
      close();
    } else {
      open();
    }

    onButtonClick?.();
  };

  const handleModalClose = () => {
    close();
    onModalClose?.();
  };

  return (
    <div className={`vento-widget ${theme === "dark" ? "dark" : ""}`}>
      <FloatingButton
        ref={buttonRef}
        onClick={handleButtonClick}
        position={position}
        className={buttonClassName}
        disabled={disabled}
        isOpen={isOpen}
        draggable={draggable}
      >
        {buttonContent}
      </FloatingButton>

      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        position={modalPosition}
        backdrop={showBackdrop}
        className={modalClassName}
        container={
          typeof document !== "undefined"
            ? (document.getElementsByClassName(
                "vento-widget"
              )[0] as HTMLElement)
            : undefined
        }
      >
        <ModalContent userAddress={userAddress} signer={signer} />
      </Modal>
    </div>
  );
};
