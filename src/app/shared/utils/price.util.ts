const EGP_NUMBER_FORMAT = new Intl.NumberFormat('en-US');

/** Formats a numeric amount with thousand separators (e.g. 28599 → "28,599"). */
export function formatEgpAmount(value: number): string {
  return EGP_NUMBER_FORMAT.format(value);
}

/** Formats a price for display with EGP suffix, or returns a fallback label. */
export function formatEgpPrice(
  value: number | string | null | undefined,
  fallback = 'Check Price',
): string {
  const amount = parsePriceAmount(value);
  if (amount == null) {
    return fallback;
  }
  return `${formatEgpAmount(amount)} EGP`;
}

/** Parses API / specs price values into a finite number, or null. */
export function parsePriceAmount(value: number | string | null | undefined): number | null {
  if (value == null || value === '') {
    return null;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  const parsed = Number(String(value).replace(/,/g, '').trim());
  return Number.isFinite(parsed) ? parsed : null;
}

/** Formats a min/max budget range for display (e.g. "25,000 - 50,000 EGP"). */
export function formatEgpRange(
  min: number,
  max: number | null,
  options?: { prefix?: string; openEndedSuffix?: string },
): string {
  const prefix = options?.prefix ?? '';
  const openEndedSuffix = options?.openEndedSuffix ?? '+';

  if (max == null) {
    return `${prefix}${formatEgpAmount(min)}${openEndedSuffix} EGP`;
  }

  return `${prefix}${formatEgpAmount(min)} - ${formatEgpAmount(max)} EGP`;
}
