"use client";
import type { PMSFilterState, PMSPageSide } from "@/hooks/use-pms-filters";
import type { PMSListing } from "@/lib/silqhaus-pms/listings";

const FAV_KEY = "silqhaus:pms-favorites:v1";
const SAVED_KEY = "silqhaus:pms-saved-searches:v1";
const EVENT_NAME = "silqhaus:pms-saved-changed";

// Cached snapshots so useSyncExternalStore receives stable identities
// between renders. Caches are invalidated on every write or external
// `storage` event from another tab.
let favCache: FavoriteRef[] | null = null;
let savedCache: PMSSavedSearch[] | null = null;

export type FavoriteSide = PMSPageSide | "vacation";

export interface PMSFavoriteSnapshot {
  kind: "pms";
  listing: PMSListing;
}

export interface VacationFavoriteSnapshot {
  kind: "vacation";
  id: string;
  name: string;
  slug: string;
  city?: string | null;
  state?: string | null;
  imageUrl?: string | null;
  bedroomsNumber?: number | null;
  bathroomsNumber?: number | null;
  personCapacity?: number | null;
}

export type FavoriteSnapshot = PMSFavoriteSnapshot | VacationFavoriteSnapshot;

export interface FavoriteRef {
  id: string;
  side: FavoriteSide;
  savedAt: number;
  snapshot: FavoriteSnapshot;
}

export interface PMSSavedSearch {
  id: string;
  name: string;
  side: PMSPageSide;
  state: PMSFilterState;
  createdAt: number;
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function emit() {
  favCache = null;
  savedCache = null;
  sideCache.clear();
  sideCacheBase = null;
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function readFavorites(): FavoriteRef[] {
  if (typeof window === "undefined") return [];
  if (favCache !== null) return favCache;
  const list = safeParse<FavoriteRef[]>(
    window.localStorage.getItem(FAV_KEY),
    [],
  );
  // Drop legacy entries lacking a snapshot so the favorites surface
  // can always render without an extra network round-trip.
  favCache = Array.isArray(list)
    ? list.filter(
        (f) =>
          f &&
          typeof f.id === "string" &&
          (f.side === "rent" || f.side === "sale" || f.side === "vacation") &&
          f.snapshot != null,
      )
    : [];
  return favCache;
}

function writeFavorites(list: FavoriteRef[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FAV_KEY, JSON.stringify(list));
  favCache = list;
  emit();
}

export function isFavorite(id: string, side: FavoriteSide): boolean {
  return readFavorites().some((f) => f.id === id && f.side === side);
}

export function toggleFavorite(
  id: string,
  side: FavoriteSide,
  snapshot: FavoriteSnapshot,
): boolean {
  const list = readFavorites();
  const existing = list.findIndex((f) => f.id === id && f.side === side);
  if (existing >= 0) {
    const next = list.filter((_, i) => i !== existing);
    writeFavorites(next);
    return false;
  }
  const next: FavoriteRef[] = [
    { id, side, savedAt: Date.now(), snapshot },
    ...list,
  ];
  writeFavorites(next);
  return true;
}

function readAllSaved(): PMSSavedSearch[] {
  if (typeof window === "undefined") return [];
  if (savedCache !== null) return savedCache;
  const list = safeParse<PMSSavedSearch[]>(
    window.localStorage.getItem(SAVED_KEY),
    [],
  );
  savedCache = Array.isArray(list) ? list : [];
  return savedCache;
}

const sideCache = new Map<PMSPageSide | "all", PMSSavedSearch[]>();
let sideCacheBase: PMSSavedSearch[] | null = null;

export function readSavedSearches(side?: PMSPageSide): PMSSavedSearch[] {
  const all = readAllSaved();
  if (sideCacheBase !== all) {
    sideCache.clear();
    sideCacheBase = all;
  }
  const key: PMSPageSide | "all" = side ?? "all";
  const hit = sideCache.get(key);
  if (hit) return hit;
  const computed = side ? all.filter((s) => s.side === side) : all;
  sideCache.set(key, computed);
  return computed;
}

function writeSavedSearches(list: PMSSavedSearch[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SAVED_KEY, JSON.stringify(list));
  savedCache = list;
  sideCache.clear();
  sideCacheBase = null;
  emit();
}

export function addSavedSearch(input: {
  name: string;
  side: PMSPageSide;
  state: PMSFilterState;
}): PMSSavedSearch {
  const entry: PMSSavedSearch = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: input.name.trim(),
    side: input.side,
    state: input.state,
    createdAt: Date.now(),
  };
  const next = [entry, ...readAllSaved()];
  writeSavedSearches(next);
  return entry;
}

export function deleteSavedSearch(id: string) {
  const next = readAllSaved().filter((s) => s.id !== id);
  writeSavedSearches(next);
}

export function renameSavedSearch(id: string, name: string) {
  const trimmed = name.trim();
  if (!trimmed) return;
  const next = readAllSaved().map((s) =>
    s.id === id ? { ...s, name: trimmed } : s,
  );
  writeSavedSearches(next);
}

function invalidateCaches() {
  favCache = null;
  savedCache = null;
  sideCache.clear();
  sideCacheBase = null;
}

export function subscribeSaved(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const storageHandler = (e: StorageEvent) => {
    if (e.key !== null && e.key !== FAV_KEY && e.key !== SAVED_KEY) return;
    invalidateCaches();
    callback();
  };
  const localHandler = () => callback();
  window.addEventListener("storage", storageHandler);
  window.addEventListener(EVENT_NAME, localHandler);
  return () => {
    window.removeEventListener("storage", storageHandler);
    window.removeEventListener(EVENT_NAME, localHandler);
  };
}
