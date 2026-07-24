"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Search, SlidersHorizontal, Map as MapIcon, List } from "lucide-react";
import { usePropertyFilters } from "@/hooks/use-property-filters";
import { useIsLargeScreen } from "@/hooks/use-is-large-screen";
import { calculateSilqhausPrice } from "@/config/ota-markups";
import { displayPropertyName } from "@/config/property-names";
import type { FromQuote } from "@/components/property-card";
import { VacationListPanel } from "./vacation-list-panel";
import { VacationFilterPopover } from "./vacation-filter-popover";
import { VacationMapCard } from "./vacation-map-card";
import { getLatLng, keyOf, regionOf } from "./geo";
import type { SearchItem } from "./types";

const VacationMap = dynamic(() => import("./vacation-map"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-neutral-100" />,
});

const DEACTIVATE_DELAY_MS = 120;
/** Slider ceiling that means "no upper limit". */
const PRICE_MAX = 100000;
type Region = "all" | "phuket" | "pattaya";

export function VacationSearch() {
  const t = useTranslations("ourProperty");
  const isLargeScreen = useIsLargeScreen();

  const {
    searchDates,
    minBedrooms,
    setMinBedrooms,
    setBedroomsFilterActive,
    minGuests,
    setMinGuests,
    showAvailableOnly,
    setShowAvailableOnly,
    allProperties,
    isLoading,
    isError,
    calendarData,
    isLoadingPrices,
    maxBedrooms,
    filteredProperties,
    updateFilter,
    handleSearchDates,
    handleClearAllFilters,
  } = usePropertyFilters();

  const fromQuotes = useQuery<Record<string, any>>({
    queryKey: ["home-pricing"],
    queryFn: async () => {
      const res = await fetch("/api/home-pricing");
      if (!res.ok) throw new Error("Failed to fetch pricing");
      return res.json();
    },
    staleTime: 60 * 60 * 1000,
  });

  // UI state
  const [searchText, setSearchText] = useState("");
  const [debouncedText, setDebouncedText] = useState("");
  const [region, setRegion] = useState<Region>("all");
  // Price ceiling applied to the displayed nightly, in the items memo below.
  const [priceCeiling, setPriceCeiling] = useState(PRICE_MAX);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  // Debounce the free-text search (matches name + city + state below).
  useEffect(() => {
    const id = setTimeout(() => setDebouncedText(searchText.trim()), 250);
    return () => clearTimeout(id);
  }, [searchText]);

  // Hover sync with a short deactivate delay (marker ↔ card).
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelClear = useCallback(() => {
    if (clearTimer.current) {
      clearTimeout(clearTimer.current);
      clearTimer.current = null;
    }
  }, []);
  const handleHover = useCallback(
    (key: string) => {
      cancelClear();
      setHoveredId(key);
    },
    [cancelClear],
  );
  const handleHoverEnd = useCallback(() => {
    cancelClear();
    clearTimer.current = setTimeout(
      () => setHoveredId(null),
      DEACTIVATE_DELAY_MS,
    );
  }, [cancelClear]);
  useEffect(() => () => cancelClear(), [cancelClear]);

  const hasDates = !!searchDates.checkIn && !!searchDates.checkOut;

  // The single source of truth for every price on the page: markup applied
  // once, here, so grid / pill / popup can never disagree.
  const items = useMemo<SearchItem[]>(() => {
    const text = debouncedText.toLowerCase();
    return (filteredProperties ?? [])
      .filter((property: any) => {
        if (text) {
          const name = displayPropertyName(property).toLowerCase();
          const hay = `${name} ${property.city ?? ""} ${property.state ?? ""}`
            .toLowerCase();
          if (!hay.includes(text)) return false;
        }
        if (region !== "all" && regionOf(property) !== region) return false;
        return true;
      })
      .map((property: any) => {
        const key = keyOf(property);
        const raw = calendarData?.[property.id];
        let cardPricing = raw;

        if (property.source === "guesty" && raw && raw.pricedNights > 0) {
          const fee =
            typeof property.cleaningFee === "number" && property.cleaningFee > 0
              ? property.cleaningFee
              : 0;
          const total = calculateSilqhausPrice(
            raw.pricedTotalPrice,
            0,
            fee,
            "guesty",
          );
          cardPricing = {
            ...raw,
            totalPrice: total,
            nights: raw.pricedNights,
            averageNightlyRate: Math.round(total / raw.pricedNights),
          };
        } else if (
          property.source !== "guesty" &&
          raw &&
          raw.nights > 0 &&
          raw.totalPrice > 0
        ) {
          const fee =
            typeof property.cleaningFee === "number" && property.cleaningFee > 0
              ? property.cleaningFee
              : 0;
          const total = calculateSilqhausPrice(
            raw.totalPrice,
            0,
            fee,
            "hostaway",
          );
          cardPricing = {
            ...raw,
            totalPrice: total,
            averageNightlyRate: Math.round(total / raw.nights),
          };
        }

        const isUnavailable = Boolean(
          hasDates &&
            raw &&
            (raw.unavailableDates?.length > 0 ||
              raw.nights === 0 ||
              (raw.minimumStay &&
                raw.nights > 0 &&
                raw.nights < raw.minimumStay)),
        );

        const fromQuote: FromQuote | null =
          (fromQuotes.data?.[key] as FromQuote) ?? null;

        const nightly =
          hasDates && !isUnavailable && cardPricing?.averageNightlyRate
            ? cardPricing.averageNightlyRate
            : (fromQuote?.avgNightly ?? null);

        return {
          key,
          property,
          cardPricing,
          fromQuote,
          hasDates,
          isUnavailable,
          latLng: getLatLng(property),
          region: regionOf(property),
          nightly,
        } satisfies SearchItem;
      })
      .sort((a, b) => {
        // Unavailable (for the chosen dates) sink to the bottom.
        if (a.isUnavailable !== b.isUnavailable) return a.isUnavailable ? 1 : -1;
        return 0;
      })
      .filter((it) => {
        if (showAvailableOnly && it.isUnavailable) return false;
        // Filter on the DISPLAYED nightly (marked-up, always present via the
        // from-quote) rather than the raw calendar price the hook would use —
        // and it works without dates, unlike the hook's price filter.
        if (
          priceCeiling < PRICE_MAX &&
          it.nightly != null &&
          it.nightly > priceCeiling
        )
          return false;
        return true;
      });
  }, [
    filteredProperties,
    debouncedText,
    region,
    calendarData,
    fromQuotes.data,
    hasDates,
    showAvailableOnly,
    priceCeiling,
  ]);

  // Drop a stale selection/hover when it leaves the visible set.
  useEffect(() => {
    const keys = new Set(items.map((i) => i.key));
    if (selectedId && !keys.has(selectedId)) setSelectedId(null);
    if (hoveredId && !keys.has(hoveredId)) setHoveredId(null);
  }, [items, selectedId, hoveredId]);

  const handleSelect = useCallback((key: string) => setSelectedId(key), []);
  const clearSelection = useCallback(() => setSelectedId(null), []);

  // Reset every filter surface — the hook's (dates/guests/bedrooms) and the
  // orchestrator-local ones (region chip, search text, price ceiling).
  const clearAll = useCallback(() => {
    setPriceCeiling(PRICE_MAX);
    setRegion("all");
    setSearchText("");
    handleClearAllFilters();
  }, [handleClearAllFilters]);

  const selectedItem = selectedId
    ? (items.find((i) => i.key === selectedId) ?? null)
    : null;

  if (isError) {
    return (
      <div className="min-h-screen bg-white grid place-items-center">
        <p className="text-red-600 font-poppins">{t("error")}</p>
      </div>
    );
  }

  const chips: { id: Region; label: string }[] = [
    { id: "all", label: t("chips.all") },
    { id: "phuket", label: t("chips.phuket") },
    { id: "pattaya", label: t("chips.pattaya") },
  ];

  const datesLabel =
    searchDates.checkIn && searchDates.checkOut
      ? `${searchDates.checkIn.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${searchDates.checkOut.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
      : t("search.addDates");

  return (
    <div className="mt-14 md:mt-16 bg-white md:h-[calc(100dvh-4rem)] md:flex md:flex-col md:overflow-hidden">
      {/* Top bar */}
      <div className="shrink-0 border-b border-neutral-200 bg-white px-4 sm:px-6 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={t("search.placeholder")}
              className="w-full h-11 rounded-full border border-neutral-200 bg-white pl-10 pr-4 text-[14px] text-ink placeholder:text-neutral-400 focus:outline-none focus:border-ink"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="inline-flex items-center gap-2 h-11 rounded-full border border-neutral-200 bg-white px-4 text-[14px] text-ink hover:border-ink"
            >
              <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">{datesLabel}</span>
              <span className="hidden sm:inline text-neutral-300">·</span>
              {t("filters.filter")}
            </button>
            {filtersOpen && (
              <div className="absolute left-0 top-full mt-2 z-[1200]">
                <VacationFilterPopover
                  initialDates={searchDates}
                  initialGuests={minGuests}
                  initialBedrooms={minBedrooms}
                  initialPrice={[0, priceCeiling]}
                  initialAvailableOnly={showAvailableOnly}
                  maxBedrooms={maxBedrooms}
                  onApply={(v) => {
                    handleSearchDates({
                      location: "",
                      checkIn: v.checkIn,
                      checkOut: v.checkOut,
                      guests: v.guests,
                    });
                    setMinGuests(v.guests);
                    setMinBedrooms(v.bedrooms);
                    setBedroomsFilterActive(v.bedrooms > 1);
                    // Price is filtered here (on the displayed nightly), not in
                    // the hook — leave the hook's raw-price filter off.
                    setPriceCeiling(v.price[1]);
                    setShowAvailableOnly(v.availableOnly);
                  }}
                  onClear={clearAll}
                  onClose={() => setFiltersOpen(false)}
                  t={t}
                />
              </div>
            )}
          </div>

          {/* Region chips */}
          <div className="flex items-center gap-2">
            {chips.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setRegion(c.id)}
                className={`rounded-full px-4 h-9 text-[13px] font-medium border transition-colors ${
                  region === c.id
                    ? "bg-ink text-white border-ink"
                    : "bg-white text-ink border-neutral-200 hover:border-ink"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Split body */}
      <div className="md:flex md:flex-1 md:min-h-0">
        {/* List (hidden on mobile when map is showing) */}
        <div
          className={`md:w-1/2 md:h-full md:overflow-y-auto ${
            mobileView === "map" ? "hidden md:block" : ""
          }`}
        >
          <VacationListPanel
            items={items}
            isLoading={isLoading && (allProperties?.length ?? 0) === 0}
            isLoadingPrices={isLoadingPrices}
            searchDates={searchDates}
            hoveredId={hoveredId}
            selectedId={selectedId}
            onHover={handleHover}
            onHoverEnd={handleHoverEnd}
            onClearFilters={clearAll}
            t={t}
          />
        </div>

        {/* Map — desktop pane */}
        {isLargeScreen && (
          <div className="hidden md:block md:w-1/2 md:h-full">
            <VacationMap
              items={items}
              hoveredId={hoveredId}
              selectedId={selectedId}
              onHover={handleHover}
              onHoverEnd={handleHoverEnd}
              onSelect={handleSelect}
              onClearSelection={clearSelection}
              searchDates={searchDates}
              t={t}
            />
          </div>
        )}
      </div>

      {/* Mobile: full-screen map overlay */}
      {!isLargeScreen && mobileView === "map" && (
        <div className="fixed inset-x-0 top-14 bottom-0 z-40 bg-white md:hidden">
          <VacationMap
            items={items}
            hoveredId={hoveredId}
            selectedId={selectedId}
            onHover={handleHover}
            onHoverEnd={handleHoverEnd}
            onSelect={handleSelect}
            onClearSelection={clearSelection}
            searchDates={searchDates}
            showSelectedCard={false}
            t={t}
          />
          {/* Mobile selected → bottom sheet */}
          {selectedItem && (
            <div className="absolute inset-x-0 bottom-24 px-4 z-50">
              <VacationMapCard
                item={selectedItem}
                searchDates={searchDates}
                t={t}
                onClose={clearSelection}
                variant="sheet"
              />
            </div>
          )}
        </div>
      )}

      {/* Mobile: list ↔ map toggle */}
      <button
        type="button"
        onClick={() =>
          setMobileView((v) => (v === "list" ? "map" : "list"))
        }
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] inline-flex items-center gap-2 rounded-full bg-ink text-white px-5 py-3 text-[14px] font-semibold shadow-lg"
      >
        {mobileView === "list" ? (
          <>
            <MapIcon className="w-4 h-4" aria-hidden="true" />
            {t("map.showMap")}
          </>
        ) : (
          <>
            <List className="w-4 h-4" aria-hidden="true" />
            {t("map.showList")}
          </>
        )}
      </button>
    </div>
  );
}
