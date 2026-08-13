/**
 * Property-facts helpers for the detail page's stat strip.
 *
 * Sizes: neither PMS reliably carries built area (Hostaway squareMeters is
 * empty; Guesty's areaSquareFeet is filled sporadically — and in m², e.g.
 * Zcape1 = 43). Enter known sizes here, keyed by `${source}:${id}`; the PMS
 * value is the fallback. The size cell renders only when a value exists.
 */
export const PROPERTY_SIZES_SQM: Record<string, number> = {
  // "guesty:6a02a27b5c3a4200114e2fec": 320,  // PUM5 - Liva Villa
  // "hostaway:383434": 650,                  // BS Villa Phuket
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
