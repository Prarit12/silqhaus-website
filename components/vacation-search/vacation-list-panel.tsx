"use client";
import { useEffect, useRef } from "react";
import { PropertyCard } from "@/components/property-card";
import type { SearchItem } from "./types";

interface VacationListPanelProps {
  items: SearchItem[];
  isLoading: boolean;
  isLoadingPrices: boolean;
  searchDates?: { checkIn?: Date | null; checkOut?: Date | null };
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (key: string) => void;
  onHoverEnd: () => void;
  onClearFilters: () => void;
  t: any;
}

function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square rounded-2xl bg-neutral-200" />
      <div className="mt-3 h-4 w-2/3 rounded bg-neutral-200" />
      <div className="mt-2 h-3 w-1/2 rounded bg-neutral-200" />
      <div className="mt-2 h-3 w-1/3 rounded bg-neutral-200" />
    </div>
  );
}

/**
 * Left half of the search page: count heading + a 3-column Airbnb-style grid.
 * Each cell mirrors the map for hover/selection so the two panes stay in sync.
 */
export function VacationListPanel({
  items,
  isLoading,
  isLoadingPrices,
  searchDates,
  hoveredId,
  selectedId,
  onHover,
  onHoverEnd,
  onClearFilters,
  t,
}: VacationListPanelProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // Pin click → scroll that card into view.
  useEffect(() => {
    if (!selectedId || !listRef.current) return;
    const el = listRef.current.querySelector(
      `[data-key="${CSS.escape(selectedId)}"]`,
    );
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedId]);

  const count = items.length;
  const heading = `${count} ${
    count === 1 ? t("filters.property") : t("filters.properties")
  } ${t("filters.found")}`;

  return (
    <div className="px-4 sm:px-6 py-5">
      <h1 className="text-ink font-gilroy text-xl sm:text-2xl font-bold tracking-tight mb-5">
        {isLoading ? t("loading") : heading}
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : count === 0 ? (
        <div className="py-20 text-center">
          <p className="text-neutral-500 font-poppins text-[15px] mb-5">
            {t("noResults")}
          </p>
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center rounded-full bg-ink text-white px-6 py-2.5 text-[13px] font-semibold hover:bg-neutral-800"
          >
            {t("filters.clearAll")}
          </button>
        </div>
      ) : (
        <div
          ref={listRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8"
        >
          {items.map((item) => {
            const isSelected = item.key === selectedId;
            return (
              <div
                key={item.key}
                data-key={item.key}
                onMouseEnter={() => onHover(item.key)}
                onMouseLeave={onHoverEnd}
                onFocus={() => onHover(item.key)}
                onBlur={onHoverEnd}
                className={`rounded-2xl transition-shadow ${
                  isSelected ? "ring-2 ring-ink ring-offset-2" : ""
                }`}
              >
                <PropertyCard
                  property={item.property}
                  pricing={item.cardPricing}
                  hasDates={item.hasDates}
                  isLoadingPrices={isLoadingPrices}
                  searchDates={searchDates}
                  fromQuote={item.fromQuote}
                  t={t}
                  theme="light"
                  detailed
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
