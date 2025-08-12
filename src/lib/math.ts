export function convertFromDenomination(
  value: number | string,
  denomination: number
): string {
  const v = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(v)) return "0";
  if (denomination <= 0) return String(v);
  const factor = 10 ** denomination;
  const result = v / factor;
  return result.toString();
}

export function convertToDenomination(
  value: number | string,
  denomination: number
): string {
  const v = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(v)) return "0";
  if (denomination <= 0) return String(Math.trunc(v));
  const factor = 10 ** denomination;
  const result = Math.round(v * factor);
  return String(result);
}
