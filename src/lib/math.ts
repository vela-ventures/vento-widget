function stripNonDigitChars(input: string): string {
  return input.replace(/[^0-9]/g, "");
}

function normalizeIntegerString(input: string): string {
  const s = input.replace(/^0+(?=\d)/, "");
  return s.length === 0 ? "0" : s;
}

export function convertFromDenomination(
  value: number | string,
  denomination: number
): string {
  let raw =
    typeof value === "number" ? Math.trunc(value).toString() : String(value);
  raw = stripNonDigitChars(raw);
  raw = normalizeIntegerString(raw);
  if (denomination <= 0) return raw;

  const len = raw.length;
  if (len === 0) return "0";
  if (len <= denomination) {
    const zeros = "0".repeat(denomination - len);
    const val = `0.${zeros}${raw}`;
    return val.replace(/\.?0+$/, "");
  }
  const intPart = raw.slice(0, len - denomination);
  const fracPart = raw.slice(len - denomination);
  const result = `${intPart}.${fracPart}`;
  return result.replace(/\.?0+$/, "");
}

export function convertToDenomination(
  value: number | string,
  denomination: number
): string {
  let s = String(value).trim();
  if (s === "" || s === ".") return "0";
  const negative = s.startsWith("-");
  if (negative) s = s.slice(1);
  const parts = s.split(".");
  const whole = stripNonDigitChars(parts[0] || "0");
  const frac = stripNonDigitChars(parts[1] || "");
  const fracNeeded = Math.max(denomination - frac.length, 0);
  const paddedFrac = frac + "0".repeat(fracNeeded);
  const usedFrac = paddedFrac.slice(0, denomination);
  const combined = normalizeIntegerString(`${whole}${usedFrac}`);
  return negative ? `-${combined}` : combined;
}
