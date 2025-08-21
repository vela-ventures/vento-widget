import { Button } from "./ui/button";
import {
  ChevronLeft,
  Clock,
  Wallet,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

import React from "react";
import type { TokenInfo } from "../types";
import { formatTokenAmount, formatUsd } from "../lib/format";

interface ConfirmSwapPageProps {
  onBack: () => void;
  sellToken: TokenInfo | undefined;
  buyToken: TokenInfo | undefined;
  sellAmount: string;
  buyAmount: string;
  sellBalance?: string;
  buyBalance?: string;
  sellBalanceLoading?: boolean;
  buyBalanceLoading?: boolean;
  sellUsd?: string;
  buyUsd?: string;
  exchangeText?: string;
  slippagePercent?: number;
  minReceivedText?: string;
  swapFeeText?: string;
  confirmDisabled?: boolean;
  confirmLoading?: boolean;
  onConfirm: () => Promise<void> | void;
  swapId?: string | null;
  statusText?: string;
  status?: string;
  isCompleted?: boolean;
}

export const ConfirmSwapModal: React.FC<ConfirmSwapPageProps> = ({
  onBack,
  sellToken,
  buyToken,
  sellAmount,
  buyAmount,
  sellBalance,
  buyBalance,
  sellBalanceLoading,
  buyBalanceLoading,
  sellUsd,
  buyUsd,
  exchangeText,
  slippagePercent = 1,
  minReceivedText,
  swapFeeText,
  confirmDisabled,
  confirmLoading,
  onConfirm,
  swapId,
  statusText,
  status,
  isCompleted,
}) => {
  const friendlyStatus = (() => {
    switch (status) {
      case "received":
        return "Order received...";
      case "sent":
        return "Swap submitted...";
      case "hop1-sent":
        return "First hop sent...";
      case "hop2-sent":
        return "Second hop sent...";
      case "completed":
        return "Swap completed";
      case "refunded":
        return "Swap refunded";
      default:
        return statusText ?? (swapId ? "Processing..." : "");
    }
  })();

  const getStatusIcon = () => {
    if (status === "completed") {
      return <CheckCircle className="size-4 text-green-500" />;
    }
    if (status === "refunded") {
      return <XCircle className="size-4 text-red-500" />;
    }
    if (swapId && !isCompleted) {
      return (
        <div className="relative">
          <Loader2 className="size-4 animate-spin text-primary" />
          <div className="absolute inset-0 size-4 border border-primary/30 rounded-full animate-pulse" />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 bg-card relative z-20 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-[8px] h-8 w-8 bg-card"
          onClick={onBack}
        >
          <ChevronLeft className="size-4 stroke-[#E9ECEF]" />
        </Button>
        <div className="text-base font-medium">Confirm and swap</div>
      </div>

      <div className="rounded-2xl border border-solid border-secondary px-5 py-4 mb-2">
        <div className="text-sm text-secondary-foreground mb-2 text-left">
          Sell
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-[30px] rounded-full bg-muted/30 grid place-items-center">
              {sellToken?.logo ? (
                <img
                  src={`https://arweave.net/${sellToken.logo}`}
                  alt={sellToken?.ticker ?? "token"}
                  className="size-full rounded-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              ) : (
                <div className="size-5 rounded-full bg-muted" />
              )}
            </div>
            <div className="inline-flex items-center gap-1.5 h-9 text-sm">
              <span className="text-xl">{sellToken?.ticker}</span>
            </div>
          </div>
          <div className="text-2xl font-semibold">
            {formatTokenAmount(sellAmount)}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-secondary-foreground">
          <div className="flex items-center gap-2">
            <Wallet className="size-4 stroke-current" />
            {sellBalanceLoading ? (
              <div className="h-4 w-14 rounded bg-muted/30 animate-pulse" />
            ) : (
              <span>{formatTokenAmount(sellBalance) ?? "-"}</span>
            )}
          </div>
          <span>≈ {sellUsd ?? formatUsd(0)}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-solid border-secondary px-5 py-4 mb-4">
        <div className="text-sm text-secondary-foreground mb-2 text-left">
          Buy
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-[30px] rounded-full bg-muted/30 grid place-items-center">
              {buyToken?.logo ? (
                <img
                  src={`https://arweave.net/${buyToken.logo}`}
                  alt={buyToken?.ticker ?? "token"}
                  className="size-full rounded-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              ) : (
                <div className="size-5 rounded-full bg-muted" />
              )}
            </div>
            <div className="inline-flex items-center gap-1.5 h-9 text-sm">
              <span className="text-xl">{buyToken?.ticker}</span>
            </div>
          </div>
          <div className="text-2xl font-semibold">
            {formatTokenAmount(buyAmount)}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-secondary-foreground">
          <div className="flex items-center gap-2">
            <Wallet className="size-4 stroke-current" />
            {buyBalanceLoading ? (
              <div className="h-4 w-14 rounded bg-muted/30 animate-pulse" />
            ) : (
              <span>{formatTokenAmount(buyBalance) ?? "-"}</span>
            )}
          </div>
          <span>≈ {buyUsd ?? formatUsd(0)}</span>
        </div>
      </div>

      <div className="space-y-2 text-sm text-secondary-foreground">
        <div className="flex items-center justify-between">
          <span>Average time to swap</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-4" /> 1 min 32 sec
          </span>
        </div>
        {exchangeText && (
          <div className="flex items-center justify-between">
            <span>Exchange rate</span>
            <span>{exchangeText}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span>Max. slippage</span>
          <span>{slippagePercent}%</span>
        </div>
        {minReceivedText && (
          <div className="flex items-center justify-between">
            <span>Min. received</span>
            <span>{minReceivedText}</span>
          </div>
        )}
        {swapFeeText && (
          <div className="flex items-center justify-between">
            <span>Swap fee</span>
            <span>{swapFeeText}</span>
          </div>
        )}
      </div>
      <div className="mt-auto">
        {swapId && (
          <div
            className={`
            mb-4 p-2.5 rounded-lg border border-solid transition-all duration-300 text-left
            ${
              status === "completed" ? "border-green-500/30 bg-green-500/5" : ""
            }
            ${status === "refunded" ? "border-red-500/30 bg-red-500/5" : ""}
            ${
              !isCompleted && status !== "refunded"
                ? "border-muted bg-muted/5"
                : "border-muted"
            }
          `}
          >
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div className="flex-1">
                <div
                  className={`
                  text-sm font-medium transition-colors duration-300 text-primary
                  ${status === "completed" ? "text-green-600" : ""}
                  ${status === "refunded" ? "text-red-600" : ""}
                `}
                >
                  {friendlyStatus}
                </div>
                {swapId && (
                  <div className="text-xs text-secondary-foreground mt-1">
                    Swap ID: {swapId.slice(0, 8)}...{swapId.slice(-8)}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {swapId ? (
          <Button
            className="w-full h-11 rounded-xl border-none"
            onClick={onBack}
          >
            {isCompleted ? "Close" : "Back"}
          </Button>
        ) : (
          <Button
            className="w-full h-11 rounded-xl border-none"
            disabled={!!confirmDisabled || confirmLoading}
            onClick={() => onConfirm()}
          >
            {confirmLoading ? "Preparing…" : "Confirm and swap"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ConfirmSwapModal;
