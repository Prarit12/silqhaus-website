"use client";
import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import type {
  PMSPageSide,
  PMSRentTerm,
  PMSSortOption,
  UsePMSFiltersReturn,
} from "@/hooks/use-pms-filters";
import { PMS_SORT_OPTIONS } from "@/hooks/use-pms-filters";
import { PMSSavedSearches } from "@/components/pms-saved-searches";

interface PMSFilterBarProps {
  filters: UsePMSFiltersReturn;
  side: PMSPageSide;
}

const BED_OPTIONS = [0, 1, 2, 3, 4, 5];
const BATH_OPTIONS = [0, 1, 2, 3, 4];
const RENT_TERMS: PMSRentTerm[] = ["monthly", "midterm", "yearly"];

function sortOptionLabel(
  t: ReturnType<typeof useTranslations>,
  opt: PMSSortOption,
): string {
  switch (opt) {
    case "price-asc":
      return t("sortPriceAsc");
    case "price-desc":
      return t("sortPriceDesc");
    case "bedrooms-desc":
      return t("sortBedroomsDesc");
    case "area-desc":
      return t("sortAreaDesc");
    case "newest":
    default:
      return t("sortNewest");
  }
}

function parseNumberInput(value: string): number | null {
  if (value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = () => setIsDesktop(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

interface FilterPanelContentProps {
  filters: UsePMSFiltersReturn;
  side: PMSPageSide;
  onApply: () => void;
}

function FilterPanelContent({
  filters,
  side,
  onApply,
}: FilterPanelContentProps) {
  const t = useTranslations("pmsFilters");
  const {
    state,
    update,
    toggleFeature,
    clearAll,
    options,
    activeFilterCount,
    hasActiveFilters,
  } = filters;
  const showRentTerm = side === "rent";

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-white/10 shrink-0">
        <h2 className="text-lg font-gilroy font-semibold tracking-wide text-white">
          {t("title")}
          {activeFilterCount > 0 && (
            <span className="ml-2 text-[12px] text-[#c9a14a] font-poppins font-normal">
              {t("activeCount", { count: activeFilterCount })}
            </span>
          )}
        </h2>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-5 space-y-6">
        {/* Price + rent term */}
        <section>
          <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
            <h3 className="text-[12px] uppercase tracking-wider text-white/60 font-poppins font-medium">
              {t("priceRange")}
            </h3>
            {showRentTerm && (
              <div
                className="flex items-center gap-1 rounded-full border border-white/15 p-0.5"
                role="group"
                aria-label={t("rentTerm")}
              >
                {RENT_TERMS.map((term) => {
                  const isActive = state.rentTerm === term;
                  const label =
                    term === "monthly"
                      ? t("rentTermMonthly")
                      : term === "midterm"
                        ? t("rentTermMidterm")
                        : t("rentTermYearly");
                  return (
                    <button
                      key={term}
                      type="button"
                      onClick={() => update("rentTerm", term)}
                      aria-pressed={isActive}
                      className={`text-[11px] font-poppins font-medium px-3 py-1 rounded-full transition-colors ${
                        isActive
                          ? "bg-[#7e6725] text-white"
                          : "text-white/70 hover:text-white"
                      }`}
                      data-testid={`pms-filter-rent-term-${term}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder={`${t("minPrice")} (${options.priceBounds.min.toLocaleString()})`}
              value={state.priceMin ?? ""}
              onChange={(e) =>
                update("priceMin", parseNumberInput(e.target.value))
              }
              className="bg-black border border-white/15 rounded-md px-3 py-2 text-[13px] font-poppins text-white placeholder-white/40 focus:outline-none focus:border-[#7e6725]"
              data-testid="pms-filter-price-min"
            />
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder={`${t("maxPrice")} (${options.priceBounds.max.toLocaleString()})`}
              value={state.priceMax ?? ""}
              onChange={(e) =>
                update("priceMax", parseNumberInput(e.target.value))
              }
              className="bg-black border border-white/15 rounded-md px-3 py-2 text-[13px] font-poppins text-white placeholder-white/40 focus:outline-none focus:border-[#7e6725]"
              data-testid="pms-filter-price-max"
            />
          </div>
        </section>

        {/* Area */}
        <section>
          <h3 className="text-[12px] uppercase tracking-wider text-white/60 font-poppins font-medium mb-2">
            {t("areaRange")}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder={`${t("minArea")} (${options.areaBounds.min})`}
              value={state.areaMin ?? ""}
              onChange={(e) =>
                update("areaMin", parseNumberInput(e.target.value))
              }
              className="bg-black border border-white/15 rounded-md px-3 py-2 text-[13px] font-poppins text-white placeholder-white/40 focus:outline-none focus:border-[#7e6725]"
              data-testid="pms-filter-area-min"
            />
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder={`${t("maxArea")} (${options.areaBounds.max})`}
              value={state.areaMax ?? ""}
              onChange={(e) =>
                update("areaMax", parseNumberInput(e.target.value))
              }
              className="bg-black border border-white/15 rounded-md px-3 py-2 text-[13px] font-poppins text-white placeholder-white/40 focus:outline-none focus:border-[#7e6725]"
              data-testid="pms-filter-area-max"
            />
          </div>
        </section>

        {/* Year built */}
        <section>
          <h3 className="text-[12px] uppercase tracking-wider text-white/60 font-poppins font-medium mb-2">
            {t("yearBuilt")}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder={`${t("minYear")} (${options.yearBuiltBounds.min})`}
              value={state.yearBuiltMin ?? ""}
              onChange={(e) =>
                update("yearBuiltMin", parseNumberInput(e.target.value))
              }
              className="bg-black border border-white/15 rounded-md px-3 py-2 text-[13px] font-poppins text-white placeholder-white/40 focus:outline-none focus:border-[#7e6725]"
              data-testid="pms-filter-year-min"
            />
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder={`${t("maxYear")} (${options.yearBuiltBounds.max})`}
              value={state.yearBuiltMax ?? ""}
              onChange={(e) =>
                update("yearBuiltMax", parseNumberInput(e.target.value))
              }
              className="bg-black border border-white/15 rounded-md px-3 py-2 text-[13px] font-poppins text-white placeholder-white/40 focus:outline-none focus:border-[#7e6725]"
              data-testid="pms-filter-year-max"
            />
          </div>
        </section>

        {/* Bathrooms */}
        <section>
          <h3 className="text-[12px] uppercase tracking-wider text-white/60 font-poppins font-medium mb-2">
            {t("bathrooms")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {BATH_OPTIONS.map((n) => {
              const isActive = state.minBathrooms === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => update("minBathrooms", n)}
                  aria-pressed={isActive}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-poppins border transition-colors ${
                    isActive
                      ? "bg-[#7e6725] border-[#7e6725] text-white"
                      : "border-white/15 text-white/80 hover:border-[#7e6725]/70 hover:text-white"
                  }`}
                  data-testid={`pms-filter-baths-${n}`}
                >
                  {n === 0
                    ? t("anyBathrooms")
                    : t("bathroomsPlus", { count: n })}
                </button>
              );
            })}
          </div>
        </section>

        {/* City + Subdistrict */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[12px] uppercase tracking-wider text-white/60 font-poppins font-medium mb-2">
              {t("city")}
            </label>
            <select
              value={state.city}
              onChange={(e) => update("city", e.target.value)}
              className="w-full bg-black border border-white/15 rounded-md px-3 py-2 text-[13px] font-poppins text-white focus:outline-none focus:border-[#7e6725]"
              data-testid="pms-filter-city"
            >
              <option value="">{t("anyCity")}</option>
              {options.cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[12px] uppercase tracking-wider text-white/60 font-poppins font-medium mb-2">
              {t("subdistrict")}
            </label>
            <select
              value={state.subdistrict}
              onChange={(e) => update("subdistrict", e.target.value)}
              disabled={options.subdistricts.length === 0}
              className="w-full bg-black border border-white/15 rounded-md px-3 py-2 text-[13px] font-poppins text-white focus:outline-none focus:border-[#7e6725] disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="pms-filter-subdistrict"
            >
              <option value="">{t("anySubdistrict")}</option>
              {options.subdistricts.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Features */}
        {options.features.length > 0 && (
          <section>
            <h3 className="text-[12px] uppercase tracking-wider text-white/60 font-poppins font-medium mb-2">
              {t("features")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {options.features.map((feat) => {
                const isActive = state.features.includes(feat);
                return (
                  <button
                    key={feat}
                    type="button"
                    onClick={() => toggleFeature(feat)}
                    aria-pressed={isActive}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-poppins border transition-colors ${
                      isActive
                        ? "bg-[#7e6725] border-[#7e6725] text-white"
                        : "border-white/15 text-white/80 hover:border-[#7e6725]/70 hover:text-white"
                    }`}
                    data-testid={`pms-filter-feature-${feat}`}
                  >
                    {feat}
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-white/10 bg-[#0a0a0a] shrink-0">
        <button
          type="button"
          onClick={clearAll}
          disabled={!hasActiveFilters}
          className="text-[13px] font-poppins text-white/70 hover:text-white underline-offset-2 hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
          data-testid="pms-filter-drawer-clear"
        >
          {t("clearAll")}
        </button>
        <button
          type="button"
          onClick={onApply}
          className="bg-[#7e6725] hover:bg-[#8c7429] text-white text-[13px] font-poppins font-medium uppercase tracking-wide px-6 py-2.5 rounded-full transition-colors"
          data-testid="pms-filter-drawer-apply"
        >
          {t("apply")}
        </button>
      </div>
    </div>
  );
}

export function PMSFilterBar({ filters, side }: PMSFilterBarProps) {
  const t = useTranslations("pmsFilters");
  const [open, setOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const {
    state,
    update,
    togglePropertyType,
    clearAll,
    options,
    activeFilterCount,
    hasActiveFilters,
  } = filters;

  return (
    <div className="bg-[#000000] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          {options.propertyTypes.length > 0 && (
            <div
              className="flex flex-wrap items-center gap-2 flex-1 min-w-0"
              role="group"
              aria-label={t("propertyType")}
            >
              {options.propertyTypes.map((type) => {
                const isActive = state.propertyTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => togglePropertyType(type)}
                    aria-pressed={isActive}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-poppins font-medium uppercase tracking-wide transition-colors whitespace-nowrap border ${
                      isActive
                        ? "bg-[#7e6725] text-white border-[#7e6725]"
                        : "bg-transparent text-white/80 border-white/15 hover:border-[#7e6725]/70 hover:text-white"
                    }`}
                    data-testid={`pms-filter-chip-type-${type}`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 lg:ml-auto lg:shrink-0">
            <label className="relative">
              <span className="sr-only">{t("bedrooms")}</span>
              <select
                value={state.minBedrooms}
                onChange={(e) =>
                  update("minBedrooms", parseInt(e.target.value, 10) || 0)
                }
                className="appearance-none bg-transparent text-white text-[12px] font-poppins font-medium border border-white/15 rounded-full pl-3 pr-8 py-1.5 hover:border-[#7e6725]/70 focus:outline-none focus:border-[#7e6725] cursor-pointer"
                data-testid="pms-filter-beds"
              >
                {BED_OPTIONS.map((n) => (
                  <option key={n} value={n} className="bg-[#0a0a0a]">
                    {n === 0
                      ? t("anyBedrooms")
                      : t("bedroomsPlus", { count: n })}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60 text-[10px]">
                ▾
              </span>
            </label>

            <label className="relative">
              <span className="sr-only">{t("sort")}</span>
              <select
                value={state.sort}
                onChange={(e) =>
                  update("sort", e.target.value as PMSSortOption)
                }
                className="appearance-none bg-transparent text-white text-[12px] font-poppins font-medium border border-white/15 rounded-full pl-3 pr-8 py-1.5 hover:border-[#7e6725]/70 focus:outline-none focus:border-[#7e6725] cursor-pointer"
                data-testid="pms-filter-sort"
              >
                {PMS_SORT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#0a0a0a]">
                    {sortOptionLabel(t, opt)}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60 text-[10px]">
                ▾
              </span>
            </label>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 text-[12px] font-poppins font-medium px-3 py-1.5 rounded-full border border-white/15 text-white hover:border-[#7e6725]/70 transition-colors"
              data-testid="pms-filter-open-more"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{t("moreFilters")}</span>
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#7e6725] text-white text-[10px] font-bold leading-none">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <PMSSavedSearches side={side} filters={filters} />

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="text-[12px] font-poppins text-white/70 hover:text-white underline-offset-2 hover:underline"
                data-testid="pms-filter-clear-all"
              >
                {t("clearAll")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reuses the same vaul Drawer primitive for both breakpoints:
          right-side sheet on desktop, bottom drawer on mobile. */}
      <Drawer
        open={open}
        onOpenChange={setOpen}
        direction={isDesktop ? "right" : "bottom"}
      >
        <DrawerContent
          className={
            isDesktop
              ? "bg-[#0a0a0a] border-white/10 text-white"
              : "bg-[#0a0a0a] border-white/10 text-white max-h-[90vh]"
          }
        >
          <DrawerTitle className="sr-only">{t("title")}</DrawerTitle>
          <DrawerClose
            className="absolute right-4 top-4 z-10 rounded-full p-1 text-white/70 hover:text-white"
            aria-label={t("close")}
          >
            <X className="w-5 h-5" />
          </DrawerClose>
          <div
            className={
              isDesktop
                ? "w-full flex flex-col flex-1 min-h-0"
                : "mx-auto w-full max-w-3xl flex flex-col flex-1 min-h-0"
            }
          >
            <FilterPanelContent
              filters={filters}
              side={side}
              onApply={() => setOpen(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
