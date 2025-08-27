import { useQuery } from "@tanstack/react-query";
import type { TokenInfo } from "../types";
import { convertFromDenomination } from "../lib/math";
import { dryrun } from "@permaweb/aoconnect";

const fetchTokenBalance = async (
  processId: string,
  userAddress: string,
  denomination: number
): Promise<string | undefined> => {
  const result = await dryrun({
    process: processId,
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

  if (!Number.isFinite(raw)) return undefined;

  const human = convertFromDenomination(raw, denomination);
  return human;
};

interface UseTokenBalanceResult {
  balance: string | undefined;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTokenBalance(
  token: TokenInfo | undefined,
  userAddress: string | undefined,
  options?: { pollMs?: number }
): UseTokenBalanceResult {
  const {
    data: balance,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["token-balance", token?.processId, userAddress],
    queryFn: () => {
      if (!token || !userAddress)
        throw new Error("Missing token or user address");
      return fetchTokenBalance(
        token.processId,
        userAddress,
        token.denomination
      );
    },
    enabled: !!token && !!userAddress,
    refetchInterval: options?.pollMs ?? 0,
    staleTime: 10000, // 10 seconds
    refetchOnWindowFocus: false,
    retry: 1,
    gcTime: 300000, // 5 minutes
  });

  return {
    balance,
    loading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}
