/**
 * Property-facts helpers for the detail page's stat strip.
 *
 * Sizes: neither PMS reliably carries built area (Hostaway squareMeters is
 * empty; Guesty's areaSquareFeet is filled sporadically — and in m², e.g.
 * Zcape1 = 43). Enter known sizes here, keyed by `${source}:${id}`; the PMS
 * value is the fallback. The size cell renders only when a value exists.
 */
export const PROPERTY_SIZES_SQM: Record<string, number> = {
  // Sourced from the listings' own descriptions.
  "hostaway:435922": 657, // Hilltop Villa — "657 square meters"
  "guesty:6a0174e3108752001d16b0c5": 32, // SL5 - The Base (848) — "32 sqm"
  "guesty:6a0174c80e158b001306fe18": 32, // SL2 - ZcapeX2 (94/17) — "32 sqm"
  "guesty:6a01749a91fba40014e8fcb7": 32, // SL1 - ZcapeX2 (94/18) — same unit type
  // Missing — add when known:
  // "hostaway:383434": 0,                  // BS Villa Phuket
  // "guesty:6a02a27b5c3a4200114e2fec": 0,  // PUM5 - Liva Villa
  // "guesty:6a0175064a70d1001383d640": 0,  // PUM7 - Niva Villa
  // "guesty:6a02a284e723650015726389": 0,  // PUM4 - Sava Villa
  // "guesty:6a76c5b5c91ae40014c0024e": 0,  // PUM8 - Treva Villa
  // "guesty:6a0174b54ea32b00142e80f4": 0,  // SL4 - Zire Wongamat
};

export function propertySizeSqm(property: {
  id: string | number;
  source?: string;
  areaSqm?: number | null;
}): number | null {
  const key = `${property.source ?? "hostaway"}:${property.id}`;
  const mapped = PROPERTY_SIZES_SQM[key];
  if (mapped && mapped > 0) return mapped;
  const fromPms = Number(property.areaSqm);
  return Number.isFinite(fromPms) && fromPms > 0 ? fromPms : null;
}

/**
 * Guest-facing property-type key, translated in the UI (facts.typeNames.*).
 * Hostaway only exposes a numeric propertyTypeId (8 = villa on this account);
 * Guesty types map into the site's Villa/Apartment vocabulary.
 */
export function propertyTypeKey(property: {
  propertyType?: string | null;
  propertyTypeId?: number | null;
}): string | null {
  const guesty = (property.propertyType || "").toLowerCase();
  if (guesty) {
    if (guesty.includes("villa") || guesty === "house") return "villa";
    if (guesty.includes("condo") || guesty.includes("apartment"))
      return "apartment";
    if (guesty.includes("townhouse")) return "townhouse";
    return null;
  }
  if (property.propertyTypeId === 8) return "villa";
  return null;
}
