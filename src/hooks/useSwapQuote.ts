import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useVentoClient } from "./useVentoClient";
import type { TokenInfo } from "../types";
import { convertFromDenomination, convertToDenomination } from "../lib/math";

interface UseSwapQuoteParams {
  fromToken?: TokenInfo;
  toToken?: TokenInfo;
  amount?: string;
  userAddress?: string;
}

export interface UseSwapQuoteResult {
  outputAmount: string | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  bestRoute: any | null;
  rawQuote: any | null;
}

export function useSwapQuote(
  params: UseSwapQuoteParams,
  debounceMs = 400
): UseSwapQuoteResult {
  const { client } = useVentoClient();
  const [outputAmount, setOutputAmount] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);
  const [bestRoute, setBestRoute] = useState<any | null>(null);
  const [rawQuote, setRawQuote] = useState<any | null>(null);

  const valid =
    !!client &&
    !!params.fromToken &&
    !!params.toToken &&
    !!params.amount &&
    Number(params.amount) > 0;

  const fetchQuote = useCallback(async () => {
    if (!valid) {
      setOutputAmount(null);
      setError(null);
      return;
    }
    const myId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const rawAmount = convertToDenomination(
        params.amount!,
        params.fromToken!.denomination
      );
      const result: any = await (client as any).getSwapQuote({
        fromTokenId: params.fromToken!.processId,
        toTokenId: params.toToken!.processId,
        amount: rawAmount,
        userAddress: params.userAddress,
      });
      if (myId !== requestIdRef.current) return;
      setRawQuote(result ?? null);
      const route = result?.bestRoute ?? null;
      setBestRoute(route);
      const estimated = route?.estimatedOutput as string | undefined;
      if (typeof estimated === "string") {
        const human = convertFromDenomination(
          estimated,
          params.toToken!.denomination
        );
        setOutputAmount(human);
      } else {
        setOutputAmount(null);
      }
    } catch (err) {
      if (requestIdRef.current !== myId) return;
      setError((err as Error).message ?? "Failed to get quote");
      setOutputAmount(null);
      setBestRoute(null);
      setRawQuote(null);
    } finally {
      if (requestIdRef.current === myId) setLoading(false);
    }
  }, [client, params.amount, params.fromToken, params.toToken, valid]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    requestIdRef.current++;
    timerRef.current = setTimeout(() => {
      fetchQuote();
    }, debounceMs);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    fetchQuote,
    debounceMs,
    params.amount,
    params.fromToken?.processId,
    params.toToken?.processId,
    params.userAddress,
  ]);

  const refetch = useCallback(() => {
    fetchQuote();
  }, [fetchQuote]);

  return useMemo(
    () => ({ outputAmount, loading, error, refetch, bestRoute, rawQuote }),
    [outputAmount, loading, error, refetch, bestRoute, rawQuote]
  );
}
