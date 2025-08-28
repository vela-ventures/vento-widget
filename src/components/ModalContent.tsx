import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import TokenRow from "./TokenRow";
import {
  ArrowDownUp,
  Clock,
  RefreshCcw,
  Settings,
  Loader2,
} from "lucide-react";
import { Logo } from "./Logo";
import { useTokens } from "../hooks/useTokens";
import { useTokenBalance } from "../hooks/useTokenBalance";
import type { TokenInfo } from "../types";
import { useSwapQuote } from "../hooks/useSwapQuote";
import { useTokenPrices } from "../hooks/useTokenPrices";
import { formatTokenAmount, formatUsd } from "../lib/format";
import { convertFromDenomination } from "../lib/math";
import TokenSelector from "./TokenSelector";
import ConfirmSwapModal from "./ConfirmSwapModal";
import { useSwapFlow } from "../hooks/useSwapFlow";
import { useVentoClient } from "../hooks/useVentoClient";
import { useSwapStatus } from "../hooks/useSwapStatus";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";

export const ModalContent: React.FC<{
  wallet?: any;
  isWalletConnected?: boolean;
  walletAddress?: string;
  onConnectWallet?: () => void;
  isOpen?: boolean;
  isInDrawer?: boolean;
}> = ({
  wallet,
  isWalletConnected,
  walletAddress,
  onConnectWallet,
  isOpen,
  isInDrawer = false,
}) => {
  const { tokens, error } = useTokens();

  const { hasSigner, userAddress, refreshAddress } = useVentoClient(wallet);

  const finalHasSigner =
    isWalletConnected !== undefined ? isWalletConnected : hasSigner;
  const finalUserAddress =
    walletAddress !== undefined ? walletAddress : userAddress;

  React.useEffect(() => {
    if (!finalHasSigner || finalUserAddress) return;

    let retryCount = 0;
    const maxRetries = 3;
    const retryInterval = 3000;

    const retryGetAddress = async () => {
      try {
        await refreshAddress();
      } catch {
        // ignore
      }
    };

    const interval = setInterval(() => {
      retryCount++;
      retryGetAddress();

      if (retryCount >= maxRetries) {
        clearInterval(interval);
      }
    }, retryInterval);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (isOpen && finalHasSigner && !finalUserAddress) {
      const getAddress = async () => {
        try {
          await refreshAddress();
        } catch {
          // ignore
        }
      };
      getAddress();
    }
  }, [isOpen]);

  const showWalletUI = finalHasSigner && finalUserAddress;

  const [sellToken, setSellToken] = React.useState<TokenInfo | undefined>(
    undefined
  );
  const [buyToken, setBuyToken] = React.useState<TokenInfo | undefined>(
    undefined
  );
  React.useEffect(() => {
    if (!sellToken && tokens[0]) setSellToken(tokens[0]);
    if (!buyToken && tokens[1]) setBuyToken(tokens[1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens]);

  const balancePollMs = isOpen ? 30000 : 120000;

  const sellBalanceHook = useTokenBalance(
    sellToken,
    finalUserAddress ?? undefined,
    {
      pollMs: balancePollMs,
    }
  );
  const buyBalanceHook = useTokenBalance(
    buyToken,
    finalUserAddress ?? undefined,
    {
      pollMs: balancePollMs,
    }
  );
  const sellBalance = sellBalanceHook.balance;
  const buyBalance = buyBalanceHook.balance;
  const sellBalanceLoading = sellBalanceHook.loading;
  const buyBalanceLoading = buyBalanceHook.loading;

  const [sellAmount, setSellAmount] = React.useState<string>("");
  const [buyAmount, setBuyAmount] = React.useState<string>("");
  const [selecting, setSelecting] = React.useState<null | "sell" | "buy">(null);
  const {
    outputAmount: quoteBuyAmount,
    loading: quoteLoading,
    bestRoute,
    error: quoteError,
    rawQuote,
    refetch: refetchQuote,
  } = useSwapQuote({
    fromToken: sellToken,
    toToken: buyToken,
    amount: sellAmount,
    userAddress: finalUserAddress ?? undefined,
  });

  const processIds = React.useMemo(() => {
    const ids = new Set<string>();
    if (sellToken?.processId) ids.add(sellToken.processId);
    if (buyToken?.processId) ids.add(buyToken.processId);
    return Array.from(ids);
  }, [sellToken?.processId, buyToken?.processId]);
  const pricesPollMs = isOpen ? 60000 : 90000;

  const { data: pricesData, loading: pricesLoading } = useTokenPrices(
    processIds,
    pricesPollMs
  );

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

  const noRoutes = React.useMemo(() => {
    return (
      !quoteLoading &&
      !quoteError &&
      !bestRoute &&
      rawQuote?.totalRoutesFound === 0
    );
  }, [quoteLoading, quoteError, bestRoute, rawQuote?.totalRoutesFound]);

  const estimateFailed = React.useMemo(() => {
    return (
      !quoteLoading &&
      !quoteError &&
      !bestRoute &&
      (rawQuote?.totalRoutesFound ?? 0) > 0
    );
  }, [quoteLoading, quoteError, bestRoute, rawQuote?.totalRoutesFound]);

  const buyDisplayAmount = React.useMemo(() => {
    if (quoteLoading) return "";
    if (quoteError || noRoutes || estimateFailed) return "";
    if (!buyAmount) return "";
    return formatTokenAmount(buyAmount);
  }, [quoteLoading, quoteError, noRoutes, estimateFailed, buyAmount]);

  const isSellAmountValid = React.useMemo(() => {
    if (sellAmount === "") return true;
    const amtNum = Number(sellAmount);
    if (!Number.isFinite(amtNum) || amtNum < 0) return false;
    const bal = sellBalance;
    if (bal == null || bal === "") return true;
    const balNum = Number(bal);
    if (!Number.isFinite(balNum)) return true;
    return amtNum <= balNum;
  }, [sellBalance, sellAmount]);

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
    swapId,
  } = useSwapFlow(wallet);

  const handleSwapClick = React.useCallback(() => {
    setSelecting(null);
    onSwapClick({
      sellToken,
      buyToken,
      sellAmount,
      buyAmount,
      bestRoute,
      userAddress: finalUserAddress ?? undefined,
    });
  }, [
    sellToken,
    buyToken,
    sellAmount,
    buyAmount,
    bestRoute,
    finalUserAddress,
    onSwapClick,
  ]);

  const handleConfirmClick = React.useCallback(() => {
    handleConfirm({
      sellToken,
      buyToken,
      sellAmount,
      bestRoute,
      userAddress: finalUserAddress ?? undefined,
    });
  }, [
    sellToken,
    buyToken,
    sellAmount,
    bestRoute,
    finalUserAddress,
    handleConfirm,
  ]);

  const flipTokens = React.useCallback(() => {
    if (!sellToken || !buyToken) return;
    setSellAmount("");
    setBuyAmount("");
    setSellToken((prevSell) => {
      const newSell = buyToken;
      setBuyToken(prevSell);
      return newSell;
    });
  }, [buyToken, sellToken]);

  const {
    status,
    loading: statusLoading,
    isCompleted,
  } = useSwapStatus(swapId ?? null, true);

  React.useEffect(() => {
    if (isCompleted) {
      sellBalanceHook.refetch();
      buyBalanceHook.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCompleted]);

  React.useEffect(() => {
    if (quoteBuyAmount && !quoteLoading && !quoteError) {
      setBuyAmount(quoteBuyAmount);
    }
  }, [quoteBuyAmount, quoteLoading, quoteError]);

  const exchangeText = React.useMemo(() => {
    if (!sellToken || !buyToken) return undefined;
    const s = Number(sellAmount || "0");
    const b = Number(buyAmount || "0");
    if (!Number.isFinite(s) || s <= 0 || !Number.isFinite(b) || b <= 0)
      return undefined;
    const rate = b / s;
    return `1 ${sellToken.ticker} ≈ ${rate.toFixed(6)} ${buyToken.ticker}`;
  }, [sellToken?.ticker, buyToken?.ticker, sellAmount, buyAmount]);

  const swapFeeText = React.useMemo(() => {
    if (
      !sellAmount ||
      Number(sellAmount) <= 0 ||
      quoteLoading ||
      quoteError ||
      noRoutes ||
      estimateFailed
    ) {
      return undefined;
    }
    const route: any = bestRoute as any;
    if (!route || !sellToken || !buyToken) return undefined;
    if (route?.dex === "botega" && Number(route?.hops) >= 2) {
      const intermediateToken = tokens.find(
        (t) => t.processId === route?.intermediateTokenId
      );
      const parts: string[] = [];
      const interFeeRaw: string | undefined = route?.intermediateEstimatedFee;
      if (interFeeRaw) {
        const interHuman = convertFromDenomination(
          interFeeRaw,
          sellToken.denomination
        );
        if (interHuman) {
          parts.push(`${formatTokenAmount(interHuman)} ${sellToken.ticker}`);
        }
      }
      const estFeeRaw: string | undefined = route?.estimatedFee;
      if (estFeeRaw && intermediateToken) {
        const estHuman = convertFromDenomination(
          estFeeRaw,
          intermediateToken.denomination
        );
        if (estHuman) {
          parts.push(
            `${formatTokenAmount(estHuman)} ${intermediateToken.ticker}`
          );
        }
      }
      if (parts.length > 0) return parts.join(" + ");
    }
    const estimatedFeeRaw: string | undefined = route.estimatedFee;
    if (!estimatedFeeRaw) return undefined;
    const isPermaswap = route?.dex === "permaswap";
    const token = isPermaswap ? buyToken : sellToken;
    const human = convertFromDenomination(estimatedFeeRaw, token.denomination);
    if (!human) return undefined;
    return `${formatTokenAmount(human)} ${token.ticker}`;
  }, [
    sellAmount,
    quoteLoading,
    quoteError,
    noRoutes,
    estimateFailed,
    bestRoute,
    sellToken?.denomination,
    sellToken?.ticker,
    buyToken?.denomination,
    buyToken?.ticker,
    tokens,
  ]);

  return (
    <Card
      className={`w-full backdrop-blur-md border-border ${
        isInDrawer ? "shadow-none border-0 bg-transparent" : "shadow-black/40 max-w-[380px]"
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <CardTitle className="text-2xl text-foreground m-0 font-maven">
              Vento
            </CardTitle>
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
              <RefreshCcw className="size-4 stroke-secondary-foreground" />
            </Button>
            {/* <Button
              variant="secondary"
              size="icon"
              className="rounded-[8px] h-8 w-8"
            >
              <Settings className="size-4 stroke-secondary-foreground" />
            </Button> */}
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
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
            invalid={!isSellAmountValid}
          />
          <div className="flex items-center justify-center">
            <div
              className="bg-secondary text-primary flex items-center justify-center -m-5 rounded-[8px] w-8 h-8 p-2 z-10 cursor-pointer"
              onClick={flipTokens}
              role="button"
              aria-label="Flip tokens"
            >
              <ArrowDownUp className="size-4 stroke-current" />
            </div>
          </div>
          <TokenRow
            label="Buy"
            token={buyToken}
            balance={buyBalance}
            amountLoading={quoteLoading}
            amount={buyAmount}
            usd={buyUsd}
            loadingBalance={!!buyBalanceLoading}
            onAmountChange={setBuyAmount}
            onTokenClick={() => setSelecting("buy")}
          />
        </div>

        <Accordion type="single" collapsible className="mt-2">
          <AccordionItem value="info">
            <AccordionTrigger
              type="reset"
              className="text-[13px] text-secondary-foreground bg-transparent no-underline p-0 outline-none border-none hover:no-underline m-0"
            >
              Details
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1 text-sm text-secondary-foreground">
                <div className="flex items-center justify-between">
                  <span>Exchange rate</span>
                  <span>{exchangeText ?? "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Max. slippage</span>
                  <span>1%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Swap fee</span>
                  <span>{swapFeeText ?? "-"}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {(() => {
          const invalidSell =
            !sellAmount || Number(sellAmount) <= 0 || !isSellAmountValid;
          const noRoutesFound =
            !quoteLoading &&
            !quoteError &&
            !bestRoute &&
            rawQuote?.totalRoutesFound === 0;
          const estimateFailed =
            !quoteLoading &&
            !bestRoute &&
            (rawQuote?.totalRoutesFound ?? 0) > 0;
          const hasValidQuote =
            !!bestRoute &&
            !quoteLoading &&
            !quoteError &&
            !noRoutesFound &&
            !estimateFailed;

          const disabled =
            quoteLoading ||
            invalidSell ||
            noRoutesFound ||
            (!hasValidQuote && !quoteError && !estimateFailed);
          const onClick =
            quoteError || estimateFailed
              ? () => refetchQuote()
              : hasValidQuote
              ? handleSwapClick
              : undefined;

          let label: React.ReactNode;
          if (quoteLoading) {
            label = (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
              </span>
            );
          } else if (invalidSell) {
            label = "Enter amounts";
          } else if (quoteError || estimateFailed) {
            label = "Retry";
          } else if (noRoutesFound) {
            label = "No routes found";
          } else if (hasValidQuote) {
            label = "Swap";
          } else {
            label = "Enter amounts";
          }

          return (
            <Button
              disabled={disabled}
              className="mt-6 w-full h-11 rounded-xl border-none"
              onClick={onClick}
            >
              {label}
            </Button>
          );
        })()}
      </CardContent>
      {selecting && (
        <div className="absolute inset-0 bg-card">
          <TokenSelector
            tokens={tokens}
            onBack={() => setSelecting(null)}
            onSelect={(t) => {
              if (selecting === "sell") {
                if (t.processId === buyToken?.processId) {
                  flipTokens();
                } else {
                  setSellToken(t);
                }
              }
              if (selecting === "buy") {
                if (t.processId === sellToken?.processId) {
                  flipTokens();
                } else {
                  setBuyToken(t);
                }
              }
              setSelecting(null);
            }}
          />
        </div>
      )}
      {confirmOpen && (
        <div className="absolute inset-0 bg-card">
          <ConfirmSwapModal
            onBack={() => {
              setConfirmOpen(false);
              if (isCompleted) {
                setSellAmount("");
                setBuyAmount("");
              }
            }}
            sellToken={sellToken}
            buyToken={buyToken}
            sellAmount={sellAmount}
            buyAmount={buyAmount}
            sellBalance={sellBalance}
            buyBalance={buyBalance}
            sellBalanceLoading={!!sellBalanceLoading}
            buyBalanceLoading={!!buyBalanceLoading}
            sellUsd={sellUsd}
            buyUsd={buyUsd}
            slippagePercent={1}
            swapFeeText={swapFeeText}
            confirmLoading={
              isSwapLoading ||
              (bestRoute?.dex === "permaswap" && !permaswapMessage)
            }
            confirmDisabled={!bestRoute || !sellAmount || !buyAmount}
            onConfirm={handleConfirmClick}
            swapId={swapId}
            status={status?.status}
            isCompleted={isCompleted}
          />
        </div>
      )}

      {!showWalletUI && (
        <div className="absolute backdrop-blur-sm inset-0 z-10 flex items-center justify-center bg-card/95">
          <div className="text-center">
            <div className="text-base text-secondary-foreground mb-4">
              Wallet is not connected.
            </div>
            {onConnectWallet && (
              <Button onClick={onConnectWallet} className="rounded-xl">
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default React.memo(ModalContent);
