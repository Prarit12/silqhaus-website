import type { PropertyListItem } from "@/hooks/use-property-filters";

/**
 * Pure geometry/identity helpers for the vacation search page.
 * Leaflet-agnostic on purpose — everything that needs the map takes a
 * projection callback, so these stay unit-testable.
 */

/** Canonical property key — the exact format /api/home-pricing returns. */
export function keyOf(p: PropertyListItem): string {
  return `${p.source ?? "hostaway"}:${p.id}`;
}

export interface LatLng {
  lat: number;
  lng: number;
}

/** Coerce only real numbers and non-blank numeric strings; blank/null/space
 *  must become NaN, not 0 — Number("") === 0 would drop a pin off West Africa. */
function toCoord(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "") return Number(v);
  return NaN;
}

/** Finite coordinates or nothing — a property without them stays in the grid
 *  but gets no map pill. */
export function getLatLng(p: PropertyListItem): LatLng | null {
  const lat = toCoord(p.lat);
  const lng = toCoord(p.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

export type Region = "phuket" | "pattaya";

/** Everything we list is Phuket or the Pattaya coast (state "Chon Buri"). */
export function regionOf(p: PropertyListItem): Region {
  const s = `${p.state ?? ""} ${p.city ?? ""}`.toLowerCase();
  return s.includes("phuket") ? "phuket" : "pattaya";
}

/**
 * Two units in one building share identical PMS coordinates (ZcapeX2 94/17 and
 * 94/18). Spread exact-duplicate points on a small circle (~13 m) so both
 * pills exist and separate at deep zoom. Sorted by key so the offset is
 * deterministic across renders.
 */
export function spreadDuplicateCoords<T extends { key: string; latLng: LatLng }>(
  items: T[],
): T[] {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const k = `${item.latLng.lat.toFixed(6)},${item.latLng.lng.toFixed(6)}`;
    const g = groups.get(k);
    if (g) g.push(item);
    else groups.set(k, [item]);
  }

  const out: T[] = [];
  for (const group of groups.values()) {
    if (group.length === 1) {
      out.push(group[0]);
      continue;
    }
    const sorted = [...group].sort((a, b) => a.key.localeCompare(b.key));
    const radius = 0.00012;
    sorted.forEach((item, i) => {
      const angle = (i * 2 * Math.PI) / sorted.length;
      out.push({
        ...item,
        latLng: {
          lat: item.latLng.lat + radius * Math.sin(angle),
          lng: item.latLng.lng + radius * Math.cos(angle),
        },
      });
    });
  }
  return out;
}

export interface Cluster<T> {
  /** Centroid of the members — where the badge/pill sits. */
  latLng: LatLng;
  members: T[];
}

/**
 * Greedy pixel-distance clustering. Points whose projected positions fall
 * within `radiusPx` of a cluster seed join it; a group of one renders as a
 * price pill, a group of many as a count badge. Recompute on zoom (pixel
 * distances only change with zoom, not pan). Deterministic: seeds are taken
 * in input order, so pass a stably-sorted list.
 */
export function clusterByPixelDistance<T extends { key: string; latLng: LatLng }>(
  items: T[],
  project: (latLng: LatLng) => { x: number; y: number },
  radiusPx = 56,
): Cluster<T>[] {
  const pts = items.map((item) => ({ item, px: project(item.latLng) }));
  const used = new Array(pts.length).fill(false);
  const clusters: Cluster<T>[] = [];

  for (let i = 0; i < pts.length; i++) {
    if (used[i]) continue;
    used[i] = true;
    const members = [pts[i].item];
    for (let j = i + 1; j < pts.length; j++) {
      if (used[j]) continue;
      const dx = pts[i].px.x - pts[j].px.x;
      const dy = pts[i].px.y - pts[j].px.y;
      if (Math.hypot(dx, dy) <= radiusPx) {
        used[j] = true;
        members.push(pts[j].item);
      }
    }
    const lat = members.reduce((s, m) => s + m.latLng.lat, 0) / members.length;
    const lng = members.reduce((s, m) => s + m.latLng.lng, 0) / members.length;
    clusters.push({ latLng: { lat, lng }, members });
  }
  return clusters;
}

export interface PillPoint {
  key: string;
  latLng: LatLng;
  /** Approximate rendered pill width in px (varies with the price text). */
  width: number;
  height: number;
  /** Higher wins a collision. */
  priority: number;
}

/**
 * Airbnb-style declutter: at the current zoom, hide any pill whose rectangle
 * overlaps one that has already been kept (kept in priority order — selected >
 * hovered > cheapest). Hidden pills reappear as the map zooms in. Returns the
 * set of visible keys.
 */
export function declutterPills(
  pills: PillPoint[],
  project: (latLng: LatLng) => { x: number; y: number },
  gapPx = 6,
): Set<string> {
  const placed: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  const visible = new Set<string>();

  const ordered = [...pills].sort((a, b) => b.priority - a.priority);
  for (const pill of ordered) {
    const c = project(pill.latLng);
    const rect = {
      x1: c.x - pill.width / 2 - gapPx,
      y1: c.y - pill.height / 2 - gapPx,
      x2: c.x + pill.width / 2 + gapPx,
      y2: c.y + pill.height / 2 + gapPx,
    };
    const collides = placed.some(
      (r) => rect.x1 < r.x2 && rect.x2 > r.x1 && rect.y1 < r.y2 && rect.y2 > r.y1,
    );
    if (!collides) {
      placed.push(rect);
      visible.add(pill.key);
    }
  }
  return visible;
}
