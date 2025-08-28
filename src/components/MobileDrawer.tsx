import React from "react";
import { createPortal } from "react-dom";
import { ModalContent } from "./ModalContent";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wallet?: any;
  isWalletConnected?: boolean;
  walletAddress?: string;
  onConnectWallet?: () => void;
  container?: HTMLElement;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  wallet,
  isWalletConnected,
  walletAddress,
  onConnectWallet,
  container,
}) => {
  const target =
    container ??
    document.getElementsByClassName("vento-widget")[0] ??
    document.body;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStartY, setDragStartY] = React.useState(0);
  const [currentDragY, setCurrentDragY] = React.useState(0);
  const drawerRef = React.useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setDragStartY(clientY);
    setCurrentDragY(clientY);
  };

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setCurrentDragY(clientY);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const dragDistance = currentDragY - dragStartY;
    const threshold = 100; // pixels to drag down to close

    if (dragDistance > threshold) {
      onClose();
    }

    setCurrentDragY(0);
    setDragStartY(0);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
      document.addEventListener("touchmove", handleDragMove);
      document.addEventListener("touchend", handleDragEnd);

      return () => {
        document.removeEventListener("mousemove", handleDragMove);
        document.removeEventListener("mouseup", handleDragEnd);
        document.removeEventListener("touchmove", handleDragMove);
        document.removeEventListener("touchend", handleDragEnd);
      };
    }
  }, [isDragging, currentDragY, dragStartY]);

  const dragOffset = isDragging ? Math.max(0, currentDragY - dragStartY) : 0;

  const drawerContent = (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/20"
          onClick={handleBackdropClick}
        />
      )}
      <div
        ref={drawerRef}
        className={`
          fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-3xl border bg-background max-h-[95vh] px-0 pb-0
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-y-0" : "translate-y-full"}
        `}
        style={{
          transform: isDragging
            ? `translateY(${dragOffset}px)`
            : isOpen
            ? "translateY(0)"
            : "translateY(100%)",
        }}
        role="dialog"
        aria-modal={isOpen ? "true" : undefined}
        hidden={!isOpen}
      >
        <div
          className="w-full flex justify-center items-center pt-4"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="mx-auto h-2 w-[100px] rounded-full bg-muted cursor-grab active:cursor-grabbing" />
        </div>
        <ModalContent
          wallet={wallet}
          isWalletConnected={isWalletConnected}
          walletAddress={walletAddress}
          onConnectWallet={onConnectWallet}
          isOpen={isOpen}
          isInDrawer={true}
        />
      </div>
    </>
  );

  return createPortal(drawerContent, target);
};
