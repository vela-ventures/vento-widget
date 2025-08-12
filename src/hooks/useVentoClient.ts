import { useEffect, useMemo, useState } from "react";
import { VentoClient } from "@vela-ventures/vento-sdk";

export interface UseVentoClientResult {
  client: any | null;
  loading: boolean;
  error: string | null;
}

export function useVentoClient(): UseVentoClientResult {
  const [client, setClient] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const sdkClient = new VentoClient();
      setClient(sdkClient);
      setError(null);
    } catch (err) {
      setError((err as Error).message ?? "Failed to initialize Vento SDK");
    } finally {
      setLoading(false);
    }
  }, []);

  return useMemo(() => ({ client, loading, error }), [client, loading, error]);
}
