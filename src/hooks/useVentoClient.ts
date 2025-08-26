import { useEffect, useMemo, useState } from "react";
import { VentoClient } from "@vela-ventures/vento-sdk";
import { createDataItemSigner } from "@permaweb/aoconnect";
import type { VentoWidgetProps } from "../types";

export interface UseVentoClientResult {
  client: any | null;
  loading: boolean;
  error: string | null;
  hasSigner: boolean;
  userAddress: string | null;
}

export function useVentoClient(
  externalSigner?: VentoWidgetProps["wallet"]
): UseVentoClientResult {
  const [client, setClient] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSigner, setHasSigner] = useState<boolean>(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        let signerInput = externalSigner;
        if (
          !signerInput &&
          typeof window !== "undefined" &&
          (window as any).arweaveWallet
        ) {
          signerInput = (window as any).arweaveWallet;
        }

        let activeAddress: string | null = null;
        try {
          const maybeWallet: any =
            signerInput ??
            (typeof window !== "undefined"
              ? (window as any).arweaveWallet
              : undefined);
          if (
            maybeWallet &&
            typeof maybeWallet.getActiveAddress === "function"
          ) {
            activeAddress = await maybeWallet.getActiveAddress();
          }
        } catch {
          activeAddress = null;
        }

        const signer = signerInput
          ? createDataItemSigner(signerInput)
          : undefined;
        const sdkClient = signer
          ? new VentoClient({ signer })
          : new VentoClient();

        if (cancelled) return;
        setClient(sdkClient);
        setError(null);
        setUserAddress(activeAddress ?? null);
        setHasSigner(!!signer && !!activeAddress);
      } catch (err) {
        if (cancelled) return;
        setError((err as Error).message ?? "Failed to initialize Vento SDK");
        setHasSigner(false);
        setUserAddress(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    init();
    return () => {
      cancelled = true;
    };
  }, [externalSigner]);

  return useMemo(
    () => ({ client, loading, error, hasSigner, userAddress }),
    [client, loading, error, hasSigner, userAddress]
  );
}
