import { useEffect, useMemo, useRef, useState } from "react";
import { useVentoClient } from "./useVentoClient";

export interface SwapStatusResponse {
  status: string; // e.g., pending | processing | completed | refunded | failed
  details?: any;
}

export function useSwapStatus(swapId: string | null, enabled = true) {
  const { client } = useVentoClient();
  const [status, setStatus] = useState<SwapStatusResponse | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!client || !swapId || !enabled) return;

    const fetchStatus = async () => {
      try {
        setLoading(true);
        const res = await (client as any).getSwapStatus(swapId);
        setStatus(res);
        setError(null);
      } catch (e) {
        setError((e as Error).message ?? "Failed to fetch swap status");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(async () => {
      await fetchStatus();
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [client, swapId, enabled]);

  const isCompleted = useMemo(() => {
    const s = status?.status;
    return s === "completed" || s === "refunded" || s === "failed";
  }, [status?.status]);

  useEffect(() => {
    if (isCompleted && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isCompleted]);

  return useMemo(
    () => ({ status, loading, error, isCompleted }),
    [status, loading, error, isCompleted]
  );
}
