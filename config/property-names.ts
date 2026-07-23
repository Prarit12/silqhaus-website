/**
 * Guest-facing property names.
 *
 * The PMSes hold two names and neither is quite right on its own:
 *   - Guesty `title` is the OTA marketing headline
 *     ("ZcapeX2 | Pool View & Best Location in Bangtao")
 *   - Guesty `nickname` is an internal ops code ("SL2 - ZcapeX2 (94/17)")
 * Hostaway's `name` is already clean ("BS Villa Phuket") and needs nothing.
 *
 * So: this map is the source of truth for what a guest reads on a card.
 * Edit it here — it is deliberately hand-written rather than derived, because
 * two units in the same building need names a guest can tell apart, and no
 * rule can invent that.
 */

/** Keyed by `${source}:${id}`. Leave a key out to fall back to the PMS name. */
export const PROPERTY_DISPLAY_NAMES: Record<string, string> = {
  // Hostaway already reads well; listed so every property is accounted for.
  "hostaway:383434": "BS Villa Phuket",
  "hostaway:435922": "Hilltop Villa",

  "guesty:6a02a27b5c3a4200114e2fec": "Liva Villa", // P5 - Liva Villa
  "guesty:6a0175064a70d1001383d640": "Niva Villa", // P7 - Niva Villa (IB)
  "guesty:6a02a284e723650015726389": "Sava Villa", // P4 - Sava Villa
  "guesty:6a0174b54ea32b00142e80f4": "Zire Wongamat", // SL4 - Zire Wongamat
  "guesty:6a0174e3108752001d16b0c5": "The Base Pattaya", // SL5 - The Base (848)
  "guesty:6a0174f287c1380015830ab6": "Zcape 1 Bangtao", // SL3 - Zcape1
  // Two near-identical units in the same building. Distinguished by their real
  // unit numbers rather than an invented label — rename if you have better ones.
  "guesty:6a0174c80e158b001306fe18": "ZcapeX2 Bangtao 94/17", // SL2 (94/17)
  "guesty:6a01749a91fba40014e8fcb7": "ZcapeX2 Bangtao 94/18", // SL1 (94/18)
};

/** "SL2 - ZcapeX2 (94/17)" -> "ZcapeX2". Used only when a listing is new and
 *  has not been added to the map above yet. */
function cleanNickname(nickname: string): string {
  return nickname
    .replace(/^[A-Za-z]+\d*\s*-\s*/, "") // drop the "SL2 - " unit prefix
    .replace(/\s*\([^)]*\)\s*$/, "") // drop a trailing "(94/17)" / "(IB)"
    .trim();
}

/**
 * What a guest should read. Falls back to the cleaned-up nickname, then to
 * whatever the PMS calls it, so a newly added listing is never nameless.
 */
export function displayPropertyName(property: {
  id: string | number;
  source?: string;
  name?: string;
  nickname?: string;
}): string {
  const key = `${property.source ?? "hostaway"}:${property.id}`;
  const mapped = PROPERTY_DISPLAY_NAMES[key];
  if (mapped) return mapped;

  if (property.nickname) {
    const cleaned = cleanNickname(property.nickname);
    if (cleaned) return cleaned;
  }
  return property.name ?? "";
}
