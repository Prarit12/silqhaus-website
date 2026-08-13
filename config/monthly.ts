/**
 * Monthly-stay pricing policy.
 *
 * The discount comes from the PMS when the property has one configured —
 * Hostaway's monthlyDiscount and Guesty's prices.monthlyPriceFactor are both
 * pay-this-fraction factors (0.8 = 20% off). Properties without a configured
 * factor fall back to the default below; per-property overrides win over
 * everything for quick tuning without touching the PMS.
 */

export const DEFAULT_MONTHLY_DISCOUNT = 0.22;

/** Keyed by `${source}:${id}` — discount as a fraction (0.2 = 20% off). */
export const MONTHLY_DISCOUNT_OVERRIDES: Record<string, number> = {};

export function monthlyDiscountFor(property: {
  id: string | number;
  source?: string;
  /** PMS pay-fraction factor (Hostaway monthlyDiscount / Guesty monthlyPriceFactor). */
  monthlyFactor?: number | null;
}): number {
  const key = `${property.source ?? "hostaway"}:${property.id}`;
  const override = MONTHLY_DISCOUNT_OVERRIDES[key];
  if (override != null && override > 0 && override < 1) return override;
  const factor = Number(property.monthlyFactor);
  if (Number.isFinite(factor) && factor > 0 && factor < 1) return 1 - factor;
  return DEFAULT_MONTHLY_DISCOUNT;
}
