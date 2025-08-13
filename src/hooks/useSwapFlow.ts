import { useCallback, useMemo, useState } from "react";
import { message, createDataItemSigner } from "@permaweb/aoconnect";
import type { TokenInfo } from "../types";
import { useVentoClient } from "./useVentoClient";
import { convertToDenomination } from "../lib/math";

export interface SwapClickParams {
  sellToken?: TokenInfo;
  buyToken?: TokenInfo;
  sellAmount?: string;
  buyAmount?: string | null;
  bestRoute?: any | null;
  userAddress?: string;
}

export interface ConfirmParams {
  sellToken?: TokenInfo;
  buyToken?: TokenInfo;
  sellAmount?: string;
  bestRoute?: any | null;
  userAddress?: string;
}

export function useSwapFlow() {
  const { client } = useVentoClient();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSwapLoading, setIsSwapLoading] = useState(false);
  const [permaswapMessage, setPermaswapMessage] = useState<any | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null);
  const [swapId, setSwapId] = useState<string | null>(null);

  const onSwapClick = useCallback(
    async (params: SwapClickParams) => {
      const {
        sellToken,
        buyToken,
        sellAmount,
        buyAmount,
        bestRoute,
        userAddress,
      } = params;
      if (!sellToken || !buyToken || !sellAmount || !buyAmount) return;
      try {
        setIsSwapLoading(true);
        setSelectedRoute(bestRoute ?? null);
        setConfirmOpen(true);
        setPermaswapMessage(null);
        if (bestRoute?.dex === "permaswap" && client) {
          const rawAmount = convertToDenomination(
            sellAmount,
            sellToken.denomination
          );
          const minAmount = String(bestRoute.estimatedOutput ?? "0");
          const prepared = await (client as any).prepareSwapMessage({
            route: bestRoute,
            fromTokenId: sellToken.processId,
            toTokenId: buyToken.processId,
            amount: rawAmount,
            minAmount,
            userAddress,
          });
          setPermaswapMessage(prepared);
        }
      } finally {
        setIsSwapLoading(false);
      }
    },
    [client]
  );

  const handleConfirm = useCallback(
    async (params: ConfirmParams) => {
      const { sellToken, buyToken, sellAmount, bestRoute, userAddress } =
        params;
      if (
        !sellToken ||
        !buyToken ||
        !sellAmount ||
        !bestRoute ||
        !client ||
        !userAddress
      )
        return;
      let messageId: string | undefined;
      if (bestRoute?.dex === "botega") {
        const rawAmount = convertToDenomination(
          sellAmount,
          sellToken.denomination
        );
        const minAmount = String(bestRoute.estimatedOutput ?? "0");
        const result = await (client as any).executeSwap(
          bestRoute,
          sellToken.processId,
          buyToken.processId,
          rawAmount,
          minAmount,
          userAddress
        );
        messageId = result?.messageId;
      } else if (bestRoute?.dex === "permaswap" && permaswapMessage) {
        const res = await message({
          process: permaswapMessage?.unsignedMessage.process,
          signer: createDataItemSigner((window as any).arweaveWallet),
          tags: permaswapMessage?.unsignedMessage.tags,
        });
        messageId = res;
      }
      if (messageId) {
        setSwapId(messageId);
      }
    },
    [client, permaswapMessage]
  );

  return useMemo(
    () => ({
      confirmOpen,
      setConfirmOpen,
      isSwapLoading,
      permaswapMessage,
      selectedRoute,
      setSelectedRoute,
      setPermaswapMessage,
      swapId,
      onSwapClick,
      handleConfirm,
    }),
    [
      confirmOpen,
      isSwapLoading,
      permaswapMessage,
      selectedRoute,
      swapId,
      onSwapClick,
      handleConfirm,
    ]
  );
}
