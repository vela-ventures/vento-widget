import { Button } from "./ui/button";
import { ChevronLeft, Clock } from "lucide-react";

import React from "react";
import type { TokenInfo } from "../types";
import { formatTokenAmount, formatUsd } from "../lib/format";

interface ConfirmSwapPageProps {
  onBack: () => void;
  sellToken: TokenInfo | undefined;
  buyToken: TokenInfo | undefined;
  sellAmount: string;
  buyAmount: string;
  exchangeText?: string;
  slippagePercent?: number;
  minReceivedText?: string;
  swapFeeText?: string;
  confirmDisabled?: boolean;
  confirmLoading?: boolean;
  onConfirm: () => Promise<void> | void;
}

export const ConfirmSwapModal: React.FC<ConfirmSwapPageProps> = ({
  onBack,
  sellToken,
  buyToken,
  sellAmount,
  buyAmount,
  exchangeText,
  slippagePercent = 1,
  minReceivedText,
  swapFeeText,
  confirmDisabled,
  confirmLoading,
  onConfirm,
}) => {
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

      <div className="rounded-2xl border border-solid border-secondary px-5 py-4 mb-3">
        <div className="text-sm text-secondary-foreground mb-2">Sell</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-[30px] rounded-full bg-muted/30 grid place-items-center" />
            <div className="inline-flex items-center gap-1.5 h-9 text-sm">
              <span className="text-xl">{sellToken?.ticker}</span>
            </div>
          </div>
          <div className="text-2xl font-semibold">
            {formatTokenAmount(sellAmount)}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-secondary-foreground">
          <div className="flex items-center gap-2" />
          <span>≈ {formatUsd(0)}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-solid border-secondary px-5 py-4 mb-4">
        <div className="text-sm text-secondary-foreground mb-2">Buy</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-[30px] rounded-full bg-muted/30 grid place-items-center" />
            <div className="inline-flex items-center gap-1.5 h-9 text-sm">
              <span className="text-xl">{buyToken?.ticker}</span>
            </div>
          </div>
          <div className="text-2xl font-semibold">
            {formatTokenAmount(buyAmount)}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-secondary-foreground">
          <div className="flex items-center gap-2" />
          <span>≈ {formatUsd(0)}</span>
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

      <Button
        className="mt-auto w-full h-11 rounded-xl"
        disabled={!!confirmDisabled || confirmLoading}
        onClick={() => onConfirm()}
      >
        {confirmLoading ? "Preparing…" : "Confirm and swap"}
      </Button>
    </div>
  );
};

export default ConfirmSwapModal;
