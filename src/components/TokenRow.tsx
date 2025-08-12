import { ChevronDown, Wallet } from "lucide-react";
import { Input } from "./ui/input";
import type { TokenInfo } from "../types";
import { formatTokenAmount } from "../lib/format";

const TokenRow: React.FC<{
  label: string;
  token: TokenInfo | undefined;
  balance?: string;
  amount?: string;
  usd?: string;
  onAmountChange?: (value: string) => void;
}> = ({
  label,
  token,
  balance,
  amount = "",
  usd = "$0.00",
  onAmountChange,
}) => {
  return (
    <div className="rounded-2xl border border-solid border-secondary px-5 py-4">
      <div className="text-base text-secondary-foreground mb-3 text-left">
        {label} {amount}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-[30px] rounded-full bg-muted/30 grid place-items-center">
            {token?.logo ? (
              <img
                src={`https://arweave.net/${token.logo}`}
                alt={token?.ticker ?? "token"}
                className="size-full rounded-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="size-5 rounded-full bg-muted" />
            )}
          </div>
          <div className="inline-flex items-center gap-1.5 h-9 text-sm">
            <span className="text-xl">{token?.ticker ?? ""}</span>
            <ChevronDown className="size-[14px] stroke-current" />
          </div>
        </div>
        <Input
          className="text-3xl pr-0 tabular-nums font-semibold border-none text-right ring-0 focus-visible:ring-0"
          inputMode="numeric"
          value={amount}
          placeholder="0"
          onChange={(e) => onAmountChange?.(e.target.value)}
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-secondary-foreground">
        <div className="flex items-center gap-2">
          <Wallet className="size-4 stroke-current" />
          <span>{formatTokenAmount(balance) ?? "-"}</span>
        </div>
        <span>≈ {usd}</span>
      </div>
    </div>
  );
};

export default TokenRow;
