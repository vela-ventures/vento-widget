import React from "react";
import { createPortal } from "react-dom";
import { Drawer as DrawerPrimitive } from "vaul";
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

  return createPortal(
    <DrawerPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      container={container}
      shouldScaleBackground={false}
    >
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <DrawerPrimitive.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background max-h-[95vh] px-0 pb-0">
          <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
          <ModalContent
            wallet={wallet}
            isWalletConnected={isWalletConnected}
            walletAddress={walletAddress}
            onConnectWallet={onConnectWallet}
            isOpen={isOpen}
            isInDrawer={true}
          />
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>,
    target
  );
};
