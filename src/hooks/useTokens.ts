import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TokenInfo } from "../types";

const TOKENS_URL = "https://api.ventoswap.com/app-config/tokens" as const;

export interface UseTokensResult {
  tokens: TokenInfo[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useTokens(): UseTokensResult {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchTokens = useCallback(async () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(TOKENS_URL, {
        method: "GET",
        signal: controller.signal,
        headers: {
          accept: "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to load tokens: ${response.status}`);
      }
      const json = (await response.json()) as unknown;

      // Minimal runtime validation
      const parsed: TokenInfo[] = Array.isArray(json)
        ? json
            .filter(
              (x) =>
                x &&
                typeof x === "object" &&
                typeof (x as any).name === "string" &&
                typeof (x as any).ticker === "string" &&
                typeof (x as any).denomination === "number" &&
                typeof (x as any).logo === "string" &&
                typeof (x as any).processId === "string"
            )
            .map((x) => x as TokenInfo)
        : [];

      setTokens(parsed);
    } catch (err) {
      if ((err as any)?.name === "AbortError") return;
      setError((err as Error).message ?? "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTokens();
    return () => abortRef.current?.abort();
  }, [fetchTokens]);

  const refresh = useCallback(() => {
    fetchTokens();
  }, [fetchTokens]);

  return useMemo(
    () => ({ tokens, isLoading, error, refresh }),
    [tokens, isLoading, error, refresh]
  );
}
