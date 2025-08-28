import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FloatingButton } from "./FloatingButton";
import { Modal } from "./Modal";
import { MobileDrawer } from "./MobileDrawer";
import { useModal } from "../hooks/useModal";
import { useIsMobile } from "../hooks/useIsMobile";
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
  wallet,
  draggable = true,
  isWalletConnected,
  walletAddress,
  onConnectWallet,
}) => {
  const { isOpen, open, close, modalPosition, buttonRef } = useModal();
  const isMobile = useIsMobile();

  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
    []
  );

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
    <QueryClientProvider client={queryClient}>
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

        {isMobile ? (
          <MobileDrawer
            isOpen={isOpen}
            onClose={handleModalClose}
            wallet={wallet}
            isWalletConnected={isWalletConnected}
            walletAddress={walletAddress}
            onConnectWallet={onConnectWallet}
            container={
              typeof document !== "undefined"
                ? (document.getElementsByClassName(
                    "vento-widget"
                  )[0] as HTMLElement)
                : undefined
            }
          />
        ) : (
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
            <ModalContent
              wallet={wallet}
              isWalletConnected={isWalletConnected}
              walletAddress={walletAddress}
              onConnectWallet={onConnectWallet}
              isOpen={isOpen}
              isInDrawer={false}
            />
          </Modal>
        )}
      </div>
    </QueryClientProvider>
  );
};
