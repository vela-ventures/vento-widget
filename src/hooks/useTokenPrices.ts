import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface TokenPriceEntry {
  id: string;
  price: number;
  isOutdated: boolean;
}

export interface TokenPricesResponse {
  currency: string;
  prices: {
    ar: number;
    ao: number;
    processes: TokenPriceEntry[];
  };
}

export interface UseTokenPricesResult {
  data: TokenPricesResponse | null;
  loading: boolean;
  error: string | null;
}

const PRICES_BASE = "https://api-eu.beaconwallet.dev/prices" as const;

export function useTokenPrices(
  processIds: string[],
  pollMs = 10000
): UseTokenPricesResult {
  const [data, setData] = useState<TokenPricesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchPrices = useCallback(async () => {
    if (!processIds || processIds.length === 0) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      processIds.forEach((id) => params.append("processes", id));
      const response = await fetch(`${PRICES_BASE}?${params.toString()}`);
      if (!response.ok)
        throw new Error(`Failed to fetch token prices: ${response.status}`);
      const json: TokenPricesResponse = await response.json();
      setData(json);
    } catch (err) {
      setError((err as Error).message ?? "Failed to fetch token prices");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [processIds]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current as unknown as number);
      intervalRef.current = null;
    }
    fetchPrices();
    intervalRef.current = setInterval(() => {
      fetchPrices();
    }, pollMs);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current as unknown as number);
        intervalRef.current = null;
      }
    };
  }, [fetchPrices, pollMs]);

  return useMemo(() => ({ data, loading, error }), [data, loading, error]);
}
