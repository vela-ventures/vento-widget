import { useEffect, useMemo, useState } from "react";
import { VentoClient } from "@vela-ventures/vento-sdk";
import { createDataItemSigner } from "@permaweb/aoconnect";
import type { VentoWidgetProps } from "../types";

export interface UseVentoClientResult {
  client: any | null;
  loading: boolean;
  error: string | null;
}

export function useVentoClient(
  externalSigner?: VentoWidgetProps["signer"]
): UseVentoClientResult {
  const [client, setClient] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      let signerInput = externalSigner;
      if (
        !signerInput &&
        typeof window !== "undefined" &&
        (window as any).arweaveWallet
      ) {
        signerInput = (window as any).arweaveWallet;
      }
      const signer = signerInput
        ? createDataItemSigner(signerInput)
        : undefined;
      const sdkClient = signer
        ? new VentoClient({ signer })
        : new VentoClient();
      setClient(sdkClient);
      setError(null);
    } catch (err) {
      setError((err as Error).message ?? "Failed to initialize Vento SDK");
    } finally {
      setLoading(false);
    }
  }, [externalSigner]);

  return useMemo(() => ({ client, loading, error }), [client, loading, error]);
}
