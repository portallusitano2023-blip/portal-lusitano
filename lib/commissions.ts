/**
 * Sales Commission Model for Portal Lusitano
 *
 * Applied when a horse listed on the marketplace is sold.
 * The seller pays a success fee based on the final sale price.
 */

export interface CommissionTier {
  /** Maximum sale price (EUR) for this tier. Infinity for the last tier. */
  upTo: number;
  /** Commission rate as a decimal (0.05 = 5%) */
  rate: number;
}

/**
 * Progressive commission tiers.
 * Lower-priced horses get a lower rate to encourage listings.
 */
export const COMMISSION_TIERS: CommissionTier[] = [
  { upTo: 5_000, rate: 0.05 }, // 5% up to €5k
  { upTo: 15_000, rate: 0.04 }, // 4% from €5k to €15k
  { upTo: 50_000, rate: 0.03 }, // 3% from €15k to €50k
  { upTo: Infinity, rate: 0.02 }, // 2% above €50k
];

/** Minimum commission in EUR cents */
export const MIN_COMMISSION_CENTS = 5000; // €50

/**
 * Calculate the commission for a given sale price.
 * Uses progressive tiers (like income tax brackets).
 *
 * @param salePriceEur - The final sale price in EUR
 * @returns Commission breakdown in cents
 */
export function calculateCommission(salePriceEur: number): {
  /** Commission amount in EUR cents */
  commissionCents: number;
  /** Effective commission rate */
  effectiveRate: number;
  /** Breakdown by tier */
  breakdown: Array<{ tier: CommissionTier; amountCents: number }>;
} {
  if (salePriceEur <= 0) {
    return { commissionCents: 0, effectiveRate: 0, breakdown: [] };
  }

  let remaining = salePriceEur;
  let prevCeiling = 0;
  const breakdown: Array<{ tier: CommissionTier; amountCents: number }> = [];

  for (const tier of COMMISSION_TIERS) {
    if (remaining <= 0) break;

    const bandWidth = tier.upTo === Infinity ? remaining : tier.upTo - prevCeiling;
    const taxable = Math.min(remaining, bandWidth);
    const amountCents = Math.round(taxable * tier.rate * 100);

    breakdown.push({ tier, amountCents });
    remaining -= taxable;
    prevCeiling = tier.upTo;
  }

  const totalCents = breakdown.reduce((sum, b) => sum + b.amountCents, 0);
  const commissionCents = Math.max(totalCents, MIN_COMMISSION_CENTS);
  const effectiveRate = salePriceEur > 0 ? commissionCents / (salePriceEur * 100) : 0;

  return { commissionCents, effectiveRate, breakdown };
}

/**
 * Format commission for display.
 */
export function formatCommission(cents: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}
