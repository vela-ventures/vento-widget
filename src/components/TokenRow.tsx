import { ChevronDown, Wallet } from "lucide-react";
import { Input } from "./ui/input";
import type { TokenInfo } from "../types";

const TokenRow: React.FC<{
  label: string;
  token: TokenInfo | undefined;
  balance?: string;
  amount?: string;
  usd?: string;
}> = ({ label, token, balance, amount = "0", usd = "$0.00" }) => {
  return (
    <div className="rounded-2xl border border-solid border-secondary px-5 py-4">
      <div className="text-base text-secondary-foreground mb-3 text-left">
        {label}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-muted/30 grid place-items-center">
            {token?.logo ? (
              <img
                src={`https://arweave.net/${token.logo}`}
                alt={token?.ticker ?? "token"}
                className="size-5 rounded-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="size-5 rounded-full bg-muted" />
            )}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 h-9 text-sm">
            <span className="font-medium">{token?.ticker ?? ""}</span>
            <ChevronDown className="size-[14px] stroke-current" />
          </div>
        </div>
        <Input
          className="text-3xl pr-0 tabular-nums font-semibold border-none text-right ring-0 focus-visible:ring-0"
          inputMode="numeric"
          value={amount}
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-secondary-foreground">
        <div className="flex items-center gap-2">
          <Wallet className="size-4 stroke-current" />
          <span>{balance ?? "-"}</span>
        </div>
        <span>≈ {usd}</span>
      </div>
    </div>
  );
};

export default TokenRow;
