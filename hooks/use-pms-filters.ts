"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PMSListing } from "@/lib/silqhaus-pms/listings";

export type PMSPageSide = "rent" | "sale";
export type PMSRentTerm = "monthly" | "midterm" | "yearly";
export type PMSSortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "bedrooms-desc"
  | "area-desc";

export const PMS_SORT_OPTIONS: PMSSortOption[] = [
  "newest",
  "price-asc",
  "price-desc",
  "bedrooms-desc",
  "area-desc",
];

export interface PMSFilterState {
  propertyTypes: string[];
  minBedrooms: number;
  minBathrooms: number;
  priceMin: number | null;
  priceMax: number | null;
  rentTerm: PMSRentTerm;
  areaMin: number | null;
  areaMax: number | null;
  yearBuiltMin: number | null;
  yearBuiltMax: number | null;
  city: string;
  subdistrict: string;
  features: string[];
  sort: PMSSortOption;
}

export interface NumericBounds {
  min: number;
  max: number;
}

export interface PMSFilterOptions {
  propertyTypes: string[];
  cities: string[];
  subdistricts: string[];
  features: string[];
  priceBounds: NumericBounds;
  areaBounds: NumericBounds;
  yearBuiltBounds: NumericBounds;
}

interface UsePMSFiltersArgs {
  listings: PMSListing[];
  side: PMSPageSide;
}

const FALLBACK_PRICE_BOUNDS: NumericBounds = { min: 0, max: 1_000_000 };
const FALLBACK_AREA_BOUNDS: NumericBounds = { min: 0, max: 1000 };
const FALLBACK_YEAR_BOUNDS: NumericBounds = {
  min: 1990,
  max: new Date().getFullYear(),
};

function emptyState(): PMSFilterState {
  return {
    propertyTypes: [],
    minBedrooms: 0,
    minBathrooms: 0,
    priceMin: null,
    priceMax: null,
    rentTerm: "monthly",
    areaMin: null,
    areaMax: null,
    yearBuiltMin: null,
    yearBuiltMax: null,
    city: "",
    subdistrict: "",
    features: [],
    sort: "newest",
  };
}

function readSortParam(qs: URLSearchParams): PMSSortOption {
  const v = qs.get("sort");
  if (
    v === "price-asc" ||
    v === "price-desc" ||
    v === "bedrooms-desc" ||
    v === "area-desc" ||
    v === "newest"
  ) {
    return v;
  }
  return "newest";
}

function readParam(qs: URLSearchParams, key: string): string | null {
  const v = qs.get(key);
  return v && v.length > 0 ? v : null;
}

function readNumberParam(qs: URLSearchParams, key: string): number | null {
  const raw = readParam(qs, key);
  if (raw === null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function readIntParam(qs: URLSearchParams, key: string, fallback = 0): number {
  const raw = readParam(qs, key);
  if (raw === null) return fallback;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function readListParam(qs: URLSearchParams, key: string): string[] {
  const raw = readParam(qs, key);
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function readRentTermParam(qs: URLSearchParams): PMSRentTerm {
  const v = readParam(qs, "term");
  if (v === "yearly" || v === "midterm" || v === "monthly") return v;
  return "monthly";
}

function hydrateFromUrl(side: PMSPageSide): PMSFilterState {
  if (typeof window === "undefined") return emptyState();
  const qs = new URLSearchParams(window.location.search);
  return {
    propertyTypes: readListParam(qs, "types"),
    minBedrooms: readIntParam(qs, "beds"),
    minBathrooms: readIntParam(qs, "baths"),
    priceMin: readNumberParam(qs, "priceMin"),
    priceMax: readNumberParam(qs, "priceMax"),
    // rentTerm has no effect on sale pages; ignore it during hydration
    // so the URL state stays consistent with the visible controls.
    rentTerm: side === "sale" ? "monthly" : readRentTermParam(qs),
    areaMin: readNumberParam(qs, "areaMin"),
    areaMax: readNumberParam(qs, "areaMax"),
    yearBuiltMin: readNumberParam(qs, "yearMin"),
    yearBuiltMax: readNumberParam(qs, "yearMax"),
    city: readParam(qs, "city") ?? "",
    subdistrict: readParam(qs, "subdistrict") ?? "",
    features: readListParam(qs, "features"),
    sort: readSortParam(qs),
  };
}

function writeToUrl(state: PMSFilterState, side: PMSPageSide): void {
  if (typeof window === "undefined") return;
  const qs = new URLSearchParams();
  if (state.propertyTypes.length)
    qs.set("types", state.propertyTypes.join(","));
  if (state.minBedrooms > 0) qs.set("beds", String(state.minBedrooms));
  if (state.minBathrooms > 0) qs.set("baths", String(state.minBathrooms));
  if (state.priceMin != null) qs.set("priceMin", String(state.priceMin));
  if (state.priceMax != null) qs.set("priceMax", String(state.priceMax));
  if (side === "rent" && state.rentTerm !== "monthly")
    qs.set("term", state.rentTerm);
  if (state.areaMin != null) qs.set("areaMin", String(state.areaMin));
  if (state.areaMax != null) qs.set("areaMax", String(state.areaMax));
  if (state.yearBuiltMin != null) qs.set("yearMin", String(state.yearBuiltMin));
  if (state.yearBuiltMax != null) qs.set("yearMax", String(state.yearBuiltMax));
  if (state.city) qs.set("city", state.city);
  if (state.subdistrict) qs.set("subdistrict", state.subdistrict);
  if (state.features.length) qs.set("features", state.features.join(","));
  if (state.sort !== "newest") qs.set("sort", state.sort);

  const search = qs.toString();
  const base = window.location.pathname;
  const next = search ? `${base}?${search}` : base;
  const currentSearch = window.location.search;
  const nextSearch = search ? `?${search}` : "";
  if (currentSearch === nextSearch) return;
  // Use pushState so browser back/forward steps through filter changes.
  window.history.pushState(null, "", next);
}

function uniqueSorted(values: (string | null | undefined)[]): string[] {
  const set = new Set<string>();
  for (const v of values) {
    if (typeof v === "string" && v.trim()) set.add(v.trim());
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

function minMax(values: number[]): NumericBounds | null {
  if (values.length === 0) return null;
  let min = values[0];
  let max = values[0];
  for (let i = 1; i < values.length; i++) {
    const v = values[i];
    if (v < min) min = v;
    if (v > max) max = v;
  }
  return { min, max };
}

function getRentPriceForTerm(
  listing: PMSListing,
  term: PMSRentTerm,
): number | null {
  // Prefer the term-specific field, fall back to the legacy `rentPrice`
  // so listings still using the legacy single-price field stay filterable
  // (mirrors the display fallback used in getPMSPrimaryPriceLine).
  if (term === "yearly")
    return listing.rentPriceYearly ?? listing.rentPrice ?? null;
  if (term === "midterm")
    return listing.rentPriceMidterm ?? listing.rentPrice ?? null;
  return listing.rentPriceMonthly ?? listing.rentPrice ?? null;
}

function getFilterPrice(
  listing: PMSListing,
  side: PMSPageSide,
  term: PMSRentTerm,
): number | null {
  if (side === "sale") return listing.salePrice ?? null;
  return getRentPriceForTerm(listing, term);
}

export function usePMSFilters({ listings, side }: UsePMSFiltersArgs) {
  const [state, setState] = useState<PMSFilterState>(emptyState);
  const [isHydrated, setIsHydrated] = useState(false);
  // Set whenever a state change comes from a popstate event so the persist
  // effect does NOT push a redundant history entry for it.
  const fromPopStateRef = useRef(false);

  // Hydrate from URL on first mount (avoids SSR/hydration mismatch).
  // Both setState calls are batched so the next commit has the hydrated
  // state AND the hydrated flag together — preventing the persist effect
  // from running once with empty state and clobbering the URL params.
  useEffect(() => {
    setState(hydrateFromUrl(side));
    setIsHydrated(true);
  }, [side]);

  // Persist to URL after hydration. Debounced so a rapid burst of changes
  // (e.g. typing in a number input) becomes a single history entry.
  useEffect(() => {
    if (!isHydrated) return;
    if (fromPopStateRef.current) {
      fromPopStateRef.current = false;
      return;
    }
    const handle = setTimeout(() => writeToUrl(state, side), 250);
    return () => clearTimeout(handle);
  }, [state, side, isHydrated]);

  // Respond to browser back/forward.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => {
      fromPopStateRef.current = true;
      setState(hydrateFromUrl(side));
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const options: PMSFilterOptions = useMemo(() => {
    const propertyTypes = uniqueSorted(listings.map((l) => l.propertyType));
    const cities = uniqueSorted(listings.map((l) => l.city));
    const allSubdistricts = uniqueSorted(listings.map((l) => l.subdistrict));
    const subdistricts = state.city
      ? uniqueSorted(
          listings
            .filter((l) => l.city === state.city)
            .map((l) => l.subdistrict),
        )
      : allSubdistricts;
    const features = uniqueSorted(listings.flatMap((l) => l.features ?? []));

    const priceValues = listings
      .map((l) => getFilterPrice(l, side, state.rentTerm))
      .filter((v): v is number => v != null);
    const priceBounds = minMax(priceValues) ?? FALLBACK_PRICE_BOUNDS;

    const areaValues = listings
      .map((l) => l.areaSqm)
      .filter((v): v is number => v != null);
    const areaBounds = minMax(areaValues) ?? FALLBACK_AREA_BOUNDS;

    const yearValues = listings
      .map((l) => l.yearBuilt)
      .filter((v): v is number => v != null);
    const yearBuiltBounds = minMax(yearValues) ?? FALLBACK_YEAR_BOUNDS;

    return {
      propertyTypes,
      cities,
      subdistricts,
      features,
      priceBounds,
      areaBounds,
      yearBuiltBounds,
    };
  }, [listings, state.city, state.rentTerm, side]);

  const filteredListings = useMemo(() => {
    const filtered = listings.filter((l) => {
      if (
        state.propertyTypes.length > 0 &&
        (!l.propertyType || !state.propertyTypes.includes(l.propertyType))
      ) {
        return false;
      }
      if (state.minBedrooms > 0 && (l.bedrooms ?? 0) < state.minBedrooms)
        return false;
      if (state.minBathrooms > 0 && (l.bathrooms ?? 0) < state.minBathrooms)
        return false;

      if (state.priceMin != null || state.priceMax != null) {
        const p = getFilterPrice(l, side, state.rentTerm);
        if (p == null) return false;
        if (state.priceMin != null && p < state.priceMin) return false;
        if (state.priceMax != null && p > state.priceMax) return false;
      }

      if (state.areaMin != null || state.areaMax != null) {
        const a = l.areaSqm;
        if (a == null) return false;
        if (state.areaMin != null && a < state.areaMin) return false;
        if (state.areaMax != null && a > state.areaMax) return false;
      }

      if (state.yearBuiltMin != null || state.yearBuiltMax != null) {
        const y = l.yearBuilt;
        if (y == null) return false;
        if (state.yearBuiltMin != null && y < state.yearBuiltMin) return false;
        if (state.yearBuiltMax != null && y > state.yearBuiltMax) return false;
      }

      if (state.city && l.city !== state.city) return false;
      if (state.subdistrict && l.subdistrict !== state.subdistrict)
        return false;

      if (state.features.length > 0) {
        const f = l.features ?? [];
        if (!state.features.every((feat) => f.includes(feat))) return false;
      }

      return true;
    });

    // Stable sort. Listings missing the sort dimension are pushed to the end.
    const getSortValue = (l: PMSListing): number | null => {
      switch (state.sort) {
        case "price-asc":
        case "price-desc":
          return getFilterPrice(l, side, state.rentTerm);
        case "bedrooms-desc":
          return l.bedrooms ?? null;
        case "area-desc":
          return l.areaSqm ?? null;
        case "newest":
        default:
          return l.publishedAt ? new Date(l.publishedAt).getTime() : null;
      }
    };
    const direction: 1 | -1 = state.sort === "price-asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = getSortValue(a);
      const bv = getSortValue(b);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return direction * (av - bv);
    });
  }, [listings, state, side]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (state.propertyTypes.length) n++;
    if (state.minBedrooms > 0) n++;
    if (state.minBathrooms > 0) n++;
    if (state.priceMin != null || state.priceMax != null) n++;
    if (state.areaMin != null || state.areaMax != null) n++;
    if (state.yearBuiltMin != null || state.yearBuiltMax != null) n++;
    if (state.city) n++;
    if (state.subdistrict) n++;
    if (state.features.length) n++;
    return n;
  }, [state]);

  const hasActiveFilters = activeFilterCount > 0;

  const update = useCallback(
    <K extends keyof PMSFilterState>(key: K, value: PMSFilterState[K]) => {
      setState((prev) => {
        const next: PMSFilterState = { ...prev, [key]: value };
        // When city changes, clear subdistrict since options are scoped by city.
        if (key === "city") next.subdistrict = "";
        return next;
      });
    },
    [],
  );

  const togglePropertyType = useCallback((type: string) => {
    setState((prev) => {
      const has = prev.propertyTypes.includes(type);
      const next = has
        ? prev.propertyTypes.filter((t) => t !== type)
        : [...prev.propertyTypes, type];
      return { ...prev, propertyTypes: next };
    });
  }, []);

  const toggleFeature = useCallback((feat: string) => {
    setState((prev) => {
      const has = prev.features.includes(feat);
      const next = has
        ? prev.features.filter((f) => f !== feat)
        : [...prev.features, feat];
      return { ...prev, features: next };
    });
  }, []);

  const clearAll = useCallback(() => {
    // Preserve the active sort — "Clear all" only clears filter dimensions.
    setState((prev) => ({ ...emptyState(), sort: prev.sort }));
  }, []);

  const applyState = useCallback((next: PMSFilterState) => {
    setState(next);
  }, []);

  return {
    state,
    update,
    togglePropertyType,
    toggleFeature,
    clearAll,
    applyState,
    filteredListings,
    options,
    activeFilterCount,
    hasActiveFilters,
  };
}

export type UsePMSFiltersReturn = ReturnType<typeof usePMSFilters>;
