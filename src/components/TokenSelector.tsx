import React from "react";
import type { TokenInfo } from "../types";
import { Input } from "./ui/input";
import { ChevronLeft, Search } from "lucide-react";
import { Button } from "./ui/button";

interface TokenSelectorProps {
  tokens: TokenInfo[];
  onBack: () => void;
  onSelect: (token: TokenInfo) => void;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  tokens,
  onBack,
  onSelect,
}) => {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tokens;
    return tokens.filter(
      (t) =>
        t.ticker.toLowerCase().includes(q) || t.name.toLowerCase().includes(q)
    );
  }, [tokens, query]);

  return (
    <div className="p-4 bg-card relative z-20 min-h-full">
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-[8px] h-8 w-8 bg-card"
          onClick={onBack}
        >
          <ChevronLeft className="size-4 stroke-[#E9ECEF]" />
        </Button>
        <div className="text-base font-medium">Select token</div>
      </div>

      <div className="mb-4 relative">
        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          placeholder="Search token"
          className="pl-9 h-9 rounded-xl bg-secondary border-none placeholder:text-secondary-foreground ring-0 focus-visible:ring-0"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {filtered.map((t) => (
          <button
            key={t.processId}
            type="button"
            onClick={() => onSelect(t)}
            className="w-full flex items-center justify-between px-2 py-2 rounded-lg bg-card border-none hover:border-none hover:bg-muted/10"
          >
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-muted/30 overflow-hidden">
                {t.logo ? (
                  <img
                    src={`https://arweave.net/${t.logo}`}
                    alt={t.ticker}
                    className="size-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                ) : null}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium leading-5">{t.ticker}</div>
                <div className="text-xs text-muted-foreground leading-4">
                  {t.name}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm">
                {/* amount placeholder; can be wired to balances */}
              </div>
              <div className="text-xs text-muted-foreground">
                {/* usd placeholder */}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TokenSelector;
