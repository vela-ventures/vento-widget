import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import TokenRow from "./TokenRow";
import { ArrowDownUp, Clock, RefreshCcw, Settings } from "lucide-react";
import { Logo } from "./Logo";
import { useTokens } from "../hooks/useTokens";
import { useTokenBalance } from "../hooks/useTokenBalance";
import type { TokenInfo } from "../types";
import { useSwapQuote } from "../hooks/useSwapQuote";
import { useTokenPrices } from "../hooks/useTokenPrices";
import { formatTokenAmount, formatUsd } from "../lib/format";

export const ModalContent: React.FC<{ userAddress?: string }> = ({
  userAddress,
}) => {
  const { tokens, isLoading, error, refresh } = useTokens();

  const sellToken: TokenInfo | undefined = tokens[0];
  const buyToken: TokenInfo | undefined = tokens[2];

  const { balance: sellBalance } = useTokenBalance(sellToken, userAddress);
  const { balance: buyBalance } = useTokenBalance(buyToken, userAddress);

  const [sellAmount, setSellAmount] = React.useState<string>("");
  const { outputAmount: buyAmount, loading: quoteLoading } = useSwapQuote({
    fromToken: sellToken,
    toToken: buyToken,
    amount: sellAmount,
    userAddress,
  });

  const processIds = React.useMemo(() => {
    const ids = new Set<string>();
    if (sellToken?.processId) ids.add(sellToken.processId);
    if (buyToken?.processId) ids.add(buyToken.processId);
    return Array.from(ids);
  }, [sellToken?.processId, buyToken?.processId]);
  const { data: pricesData } = useTokenPrices(processIds);

  const sellUsd = React.useMemo(() => {
    if (!pricesData || !sellToken) return "$0.00";
    const entry = pricesData.prices.processes.find(
      (p) => p.id === sellToken.processId
    );
    const price = entry?.price ?? 0;
    const value = Number(sellAmount || "0") * price;
    return formatUsd(value);
  }, [pricesData, sellToken?.processId, sellAmount]);

  const buyUsd = React.useMemo(() => {
    if (!pricesData || !buyToken) return "$0.00";
    const entry = pricesData.prices.processes.find(
      (p) => p.id === buyToken.processId
    );
    const price = entry?.price ?? 0;
    const value = Number(buyAmount || "0") * price;
    return formatUsd(value);
  }, [pricesData, buyToken?.processId, buyAmount]);

  return (
    <Card className="w-[380px] bg-background backdrop-blur-md border-white/10 shadow-black/40">
      <CardHeader className="pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <CardTitle className="text-2xl text-white m-0">Vento</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-[8px] h-8 w-8"
              onClick={refresh}
            >
              <RefreshCcw className="size-4 stroke-[#E9ECEF]" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-[8px] h-8 w-8"
            >
              <Settings className="size-4 stroke-[#E9ECEF]" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="">
        {isLoading && (
          <div className="mb-3 text-sm text-secondary-foreground">
            Loading tokens…
          </div>
        )}
        {error && <div className="mb-3 text-sm text-red-400">{error}</div>}
        <div className="flex flex-col gap-1">
          <TokenRow
            label="Sell"
            token={sellToken}
            balance={sellBalance}
            amount={sellAmount ? formatTokenAmount(sellAmount) : ""}
            usd={sellUsd}
            onAmountChange={setSellAmount}
          />
          <div className="flex items-center justify-center">
            <div className="bg-background -m-5 rounded-[8px] w-10 h-10 p-2 z-10 cursor-pointer">
              <ArrowDownUp className="size-6 stroke-[#25292D]" />
            </div>
          </div>
          <TokenRow
            label="Buy"
            token={buyToken}
            balance={buyBalance}
            amount={formatTokenAmount(buyAmount ?? "0")}
            usd={buyUsd}
          />
        </div>

        <div className="mt-4 flex items-center justify-between text-[13px] text-secondary-foreground">
          <span>Average time to swap</span>
          <div className="flex items-center gap-2">
            <Clock className="size-[14px]" />
            <span>1 min 32 sec</span>
          </div>
        </div>

        <Button
          disabled
          className="mt-16 w-full h-11 rounded-xl bg-white/10 text-white/70 hover:bg-white/10"
        >
          Enter amounts
        </Button>
      </CardContent>
    </Card>
  );
};

export default ModalContent;
