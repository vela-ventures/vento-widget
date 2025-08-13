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
import TokenSelector from "./TokenSelector";
import ConfirmSwapModal from "./ConfirmSwapModal";
import { useSwapFlow } from "../hooks/useSwapFlow";

export const ModalContent: React.FC<{ userAddress?: string }> = ({
  userAddress,
}) => {
  const { tokens, error } = useTokens();

  const [sellToken, setSellToken] = React.useState<TokenInfo | undefined>(
    undefined
  );
  const [buyToken, setBuyToken] = React.useState<TokenInfo | undefined>(
    undefined
  );
  React.useEffect(() => {
    if (!sellToken && tokens[0]) setSellToken(tokens[0]);
    if (!buyToken && tokens[2]) setBuyToken(tokens[2]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens]);

  const sellBalanceHook = useTokenBalance(sellToken, userAddress);
  const buyBalanceHook = useTokenBalance(buyToken, userAddress);
  const sellBalance = sellBalanceHook.balance;
  const buyBalance = buyBalanceHook.balance;
  const sellBalanceLoading = sellBalanceHook.loading;
  const buyBalanceLoading = buyBalanceHook.loading;

  const [sellAmount, setSellAmount] = React.useState<string>("");
  const [selecting, setSelecting] = React.useState<null | "sell" | "buy">(null);
  const {
    outputAmount: buyAmount,
    loading: quoteLoading,
    bestRoute,
  } = useSwapQuote({
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
  const { data: pricesData, loading: pricesLoading } =
    useTokenPrices(processIds);

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

  const {
    confirmOpen,
    setConfirmOpen,
    isSwapLoading,
    permaswapMessage,
    selectedRoute,
    setSelectedRoute,
    setPermaswapMessage,
    onSwapClick,
    handleConfirm,
  } = useSwapFlow();

  const handleSwapClick = React.useCallback(() => {
    onSwapClick({
      sellToken,
      buyToken,
      sellAmount,
      buyAmount,
      bestRoute,
      userAddress,
    });
  }, [
    sellToken,
    buyToken,
    sellAmount,
    buyAmount,
    bestRoute,
    userAddress,
    onSwapClick,
  ]);

  const handleConfirmClick = React.useCallback(() => {
    handleConfirm({ sellToken, buyToken, sellAmount, bestRoute, userAddress });
  }, [sellToken, buyToken, sellAmount, bestRoute, userAddress, handleConfirm]);

  return (
    <Card className="w-[380px] backdrop-blur-md border-white/10 shadow-black/40">
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
              onClick={() => {
                sellBalanceHook.refetch();
                buyBalanceHook.refetch();
              }}
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
        {error && <div className="mb-3 text-sm text-red-400">{error}</div>}
        <div className="flex flex-col gap-1">
          <TokenRow
            label="Sell"
            token={sellToken}
            balance={sellBalance}
            amount={sellAmount}
            usd={sellUsd}
            onAmountChange={setSellAmount}
            loadingBalance={!!sellBalanceLoading}
            amountLoading={false}
            onTokenClick={() => setSelecting("sell")}
          />
          <div className="flex items-center justify-center">
            <div className="bg-secondary flex items-center justify-center -m-5 rounded-[8px] w-8 h-8 p-2 z-10 cursor-pointer">
              <ArrowDownUp className="size-4 stroke-primary" />
            </div>
          </div>
          <TokenRow
            label="Buy"
            token={buyToken}
            balance={buyBalance}
            amountLoading={quoteLoading}
            amount={quoteLoading ? "" : formatTokenAmount(buyAmount ?? "0")}
            usd={buyUsd}
            loadingBalance={!!buyBalanceLoading}
            onTokenClick={() => setSelecting("buy")}
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
          disabled={!sellAmount || Number(sellAmount) <= 0 || !buyAmount}
          className="mt-16 w-full h-11 rounded-xl"
          onClick={handleSwapClick}
        >
          {!sellAmount || Number(sellAmount) <= 0 || !buyAmount
            ? "Enter amounts"
            : "Swap"}
        </Button>
      </CardContent>
      {selecting && (
        <div className="absolute inset-0 bg-card">
          <TokenSelector
            tokens={tokens}
            onBack={() => setSelecting(null)}
            onSelect={(t) => {
              if (selecting === "sell") setSellToken(t);
              if (selecting === "buy") setBuyToken(t);
              setSelecting(null);
            }}
          />
        </div>
      )}
      {confirmOpen && (
        <div className="absolute inset-0 bg-card">
          <ConfirmSwapModal
            onBack={() => setConfirmOpen(false)}
            sellToken={sellToken}
            buyToken={buyToken}
            sellAmount={sellAmount}
            buyAmount={buyAmount ?? "0"}
            slippagePercent={1}
            confirmLoading={
              isSwapLoading ||
              (bestRoute?.dex === "permaswap" && !permaswapMessage)
            }
            confirmDisabled={!bestRoute || !sellAmount || !buyAmount}
            onConfirm={handleConfirmClick}
          />
        </div>
      )}
    </Card>
  );
};

export default ModalContent;
