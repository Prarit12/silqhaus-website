"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { PMSListingCard } from "@/components/pms-listing-card";
import { PMSFilterBar } from "@/components/pms-filter-bar";
import { usePMSFilters } from "@/hooks/use-pms-filters";
import { fetchPMSListings } from "@/lib/api/silqhaus-pms";
import type {
  PMSListing,
  PMSListingType,
  PMSListingsResponse,
} from "@/lib/silqhaus-pms/listings";

const PMSListingsMap = dynamic(() => import("./pms-listings-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-2xl border border-white/10 bg-[#0a0a0a]" />
  ),
});

interface PMSListingsWithMapProps {
  listingType: PMSListingType;
  basePath: "properties-for-rent" | "properties-for-sale";
  namespace: "propertiesForRent" | "propertiesForSale";
}

const DEACTIVATE_DELAY_MS = 120;

function useIsLargeScreen(): boolean {
  const [isLg, setIsLg] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = () => setIsLg(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isLg;
}

export function PMSListingsWithMap({
  listingType,
  basePath,
  namespace,
}: PMSListingsWithMapProps) {
  const t = useTranslations(namespace);
  const tFilters = useTranslations("pmsFilters");
  const isLargeScreen = useIsLargeScreen();
  const [activeId, setActiveId] = useState<string | null>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelPendingClear = useCallback(() => {
    if (clearTimerRef.current !== null) {
      clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }
  }, []);

  const handleActivate = useCallback(
    (id: string) => {
      cancelPendingClear();
      setActiveId(id);
    },
    [cancelPendingClear],
  );

  const handleDeactivate = useCallback(() => {
    cancelPendingClear();
    clearTimerRef.current = setTimeout(() => {
      setActiveId(null);
      clearTimerRef.current = null;
    }, DEACTIVATE_DELAY_MS);
  }, [cancelPendingClear]);

  useEffect(() => () => cancelPendingClear(), [cancelPendingClear]);

  const { data, isLoading, isError } = useQuery<PMSListingsResponse>({
    queryKey: ["/api/silqhaus-pms/listings", listingType],
    queryFn: () => fetchPMSListings(listingType),
  });

  const listings: PMSListing[] = useMemo(() => {
    return [...(data?.data ?? [])].sort((a, b) => {
      const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return db - da;
    });
  }, [data?.data]);

  const side = basePath === "properties-for-rent" ? "rent" : "sale";
  const filters = usePMSFilters({ listings, side });
  const { filteredListings, clearAll } = filters;

  const hasGeocodedListings = filteredListings.some(
    (l) => typeof l.latitude === "number" && typeof l.longitude === "number",
  );

  const showFilterBar = !isLoading && !isError && listings.length > 0;
  const showNoMatches =
    !isLoading &&
    !isError &&
    listings.length > 0 &&
    filteredListings.length === 0;

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-24 relative bg-[#000000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-gilroy font-bold mb-6 tracking-wider text-white uppercase">
            {t("hero.title")}
          </h1>
          <p className="md:text-2xl text-mist max-w-4xl mx-auto font-poppins font-light text-[18px]">
            {t("hero.description")}
          </p>
        </div>
      </section>

      {showFilterBar && <PMSFilterBar filters={filters} side={side} />}

      <section className="bg-[#000000] py-8 min-h-[80vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isLoading && !isError && listings.length > 0 && (
            <div className="mb-6">
              <p className="text-mist/70 font-poppins text-[13px]">
                {t(filteredListings.length === 1 ? "countOne" : "countOther", {
                  count: filteredListings.length,
                })}
              </p>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-mist font-poppins text-lg">{t("loading")}</p>
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <p className="text-red-400 font-poppins text-lg">{t("error")}</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-mist font-poppins text-lg">{t("noResults")}</p>
            </div>
          ) : showNoMatches ? (
            <div className="text-center py-20">
              <p className="text-white font-gilroy text-xl font-semibold mb-2">
                {tFilters("noResultsTitle")}
              </p>
              <p className="text-mist font-poppins text-[14px] mb-6">
                {tFilters("noResultsBody")}
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center px-6 py-2.5 rounded-full bg-[#7e6725] hover:bg-[#8c7429] text-white text-[13px] font-poppins font-medium uppercase tracking-wide transition-colors"
                data-testid="pms-filter-no-matches-clear"
              >
                {tFilters("clearFilters")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
              <div
                className={
                  hasGeocodedListings ? "md:col-span-3" : "md:col-span-10"
                }
              >
                <div className="grid grid-cols-1 gap-6">
                  {filteredListings.map((listing) => {
                    return (
                      <div
                        key={listing.id}
                        onMouseEnter={() => handleActivate(listing.id)}
                        onMouseLeave={handleDeactivate}
                        onFocus={() => handleActivate(listing.id)}
                        onBlur={handleDeactivate}
                        data-testid={`pms-listing-card-wrap-${listing.id}`}
                      >
                        <PMSListingCard listing={listing} basePath={basePath} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {hasGeocodedListings && isLargeScreen && (
                <aside className="md:col-span-7" aria-label={t("mapAriaLabel")}>
                  <div className="sticky top-24 h-[calc(100vh-7rem)]">
                    <PMSListingsMap
                      listings={filteredListings}
                      basePath={basePath}
                      activeId={activeId}
                      onActivate={handleActivate}
                      onDeactivate={handleDeactivate}
                    />
                  </div>
                </aside>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
