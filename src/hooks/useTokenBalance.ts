import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TokenInfo } from "../types";
import { convertFromDenomination } from "../lib/math";
import { dryrun } from "@permaweb/aoconnect";

interface UseTokenBalanceResult {
  balance: string | undefined;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTokenBalance(
  token: TokenInfo | undefined,
  userAddress: string | undefined
): UseTokenBalanceResult {
  const [balance, setBalance] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!token || !userAddress) return;
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);

    try {
      const result = await dryrun({
        process: token.processId,
        tags: [
          { name: "Action", value: "Balance" },
          { name: "Recipient", value: userAddress },
        ],
      });

      const msg = result?.Messages?.[0];
      let raw = 0;
      if (msg?.Data != null) {
        const d: string = msg.Data as string;
        const s = d.startsWith('"') && d.endsWith('"') ? d.slice(1, -1) : d;
        raw = Number(s);
      }
      if (!Number.isFinite(raw)) {
        const tagVal = msg?.Tags?.find(
          (t: { name: string; value: string }) => t.name === "Balance"
        )?.value;
        raw = Number(tagVal ?? 0);
      }
      const human = convertFromDenomination(raw, token.denomination);
      setBalance(human);
    } catch (err) {
      setError((err as Error).message ?? "Failed to fetch balance");
      setBalance(undefined);
    } finally {
      setLoading(false);
    }
  }, [token, userAddress]);

  useEffect(() => {
    fetchBalance();
    return () => abortRef.current?.abort();
  }, [fetchBalance]);

  const refetch = useCallback(() => {
    fetchBalance();
  }, [fetchBalance]);

  return useMemo(
    () => ({ balance, loading, error, refetch }),
    [balance, loading, error, refetch]
  );
}
