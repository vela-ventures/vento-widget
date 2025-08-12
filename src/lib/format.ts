// Format token amounts and USD values with sensible trimming rules

export function formatTokenAmount(
  amount: string | null | undefined,
  opts?: { maxFrac?: number; minSig?: number }
): string {
  if (!amount) return "0";
  const maxFrac = opts?.maxFrac ?? 6;
  const minSig = opts?.minSig ?? 2; // keep at least this many significant digits after leading zeros

  const s = String(amount);
  if (!s.includes(".")) {
    // Large integers: insert thin spaces every 3 digits for readability? Keep simple for now
    return s;
  }
  const [whole, fracRaw] = s.split(".");
  // If whole part is non-zero, cap fractional length to maxFrac
  if (/^0+$/.test(whole) === false) {
    const frac = (fracRaw || "").slice(0, maxFrac);
    const trimmed = `${whole}.${frac}`.replace(/\.?0+$/, "");
    return trimmed.length === 0 ? "0" : trimmed;
  }

  // Leading zeros in fraction: keep at least minSig non-zero significant digits
  const match = (fracRaw || "").match(/^(0*)(\d*)(.*)$/);
  const leadingZeros = match?.[1] ?? "";
  const digits = match?.[2] ?? "";
  const tail = match?.[3] ?? "";
  let keep = Math.max(minSig, Math.min(maxFrac, digits.length));
  const significant = digits.slice(0, keep);
  const formatted = `0.${leadingZeros}${significant}`.replace(/\.?0+$/, "");
  return formatted.length === 0 ? "0" : formatted;
}

export function formatUsd(amount: number | null | undefined): string {
  if (!amount || !isFinite(amount)) return "$0.00";
  // Clamp extreme values for display
  if (amount >= 1)
    return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  return `$${amount.toLocaleString(undefined, {
    maximumSignificantDigits: 4,
  })}`;
}
