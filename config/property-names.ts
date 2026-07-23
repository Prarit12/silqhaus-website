/**
 * Guest-facing property names.
 *
 * Names come from the PMS, not from here:
 *   - Hostaway `name` is already clean ("BS Villa Phuket").
 *   - Guesty `nickname` is the real property name behind an ops prefix
 *     ("SL2 - ZcapeX2 (94/17)"), so we strip the prefix and any trailing
 *     parenthetical and use what's left.
 * Guesty `title` is deliberately unused — it's the marketing headline
 * syndicated to Airbnb and Booking, not a property name.
 *
 * PROPERTY_DISPLAY_NAMES below is the override hook: add an entry only to
 * rename a property away from what the PMS calls it.
 */

/** Keyed by `${source}:${id}`. Empty by default — the PMS name wins. */
export const PROPERTY_DISPLAY_NAMES: Record<string, string> = {};

/** "SL2 - ZcapeX2 (94/17)" -> "ZcapeX2". */
function cleanNickname(nickname: string): string {
  return nickname
    .replace(/^[A-Za-z]+\d*\s*-\s*/, "") // drop the "SL2 - " unit prefix
    .replace(/\s*\([^)]*\)\s*$/, "") // drop a trailing "(94/17)" / "(IB)"
    .trim();
}

/** What a guest reads: an override if one exists, else the PMS's own name. */
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
