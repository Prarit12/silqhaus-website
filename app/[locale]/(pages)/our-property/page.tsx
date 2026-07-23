"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { OTASection } from "@/components/ota-section";
import BookingSearchBar from "@/components/booking-search-bar";
import { PropertyCard } from "@/components/property-card";
import { useTranslations } from "next-intl";
import { usePropertyFilters } from "@/hooks/use-property-filters";
import { calculateSilqhausPrice } from "@/config/ota-markups";

export default function OurProperty() {
  const t = useTranslations("ourProperty");

  // "From" prices for the minimum stay, shown until the guest picks dates.
  const fromQuotes = useQuery<Record<string, any>>({
    queryKey: ["home-pricing"],
    queryFn: async () => {
      const res = await fetch("/api/home-pricing");
      if (!res.ok) throw new Error("Failed to fetch pricing");
      return res.json();
    },
    staleTime: 60 * 60 * 1000,
  });

  const {
    filters,
    searchDates,
    showAvailableOnly,
    setShowAvailableOnly,
    priceRange,
    setPriceRange,
    priceFilterActive,
    setPriceFilterActive,
    minBedrooms,
    setMinBedrooms,
    bedroomsFilterActive,
    setBedroomsFilterActive,
    minGuests,
    setMinGuests,
    allProperties,
    isLoading,
    isError,
    calendarData,
    isLoadingPrices,
    maxBedrooms,
    filteredProperties,
    handleSearchDates,
    handleClearAllFilters,
  } = usePropertyFilters();

  if (isError) {
    return (
      <div className="min-h-screen bg-ink">
        <section className="py-24 text-center text-red-400">
          {t("error")}
        </section>
      </div>
    );
  }

  return (
    <>
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

        <div className="bg-black py-6">
          <BookingSearchBar
            onSearch={handleSearchDates}
            onClearAll={handleClearAllFilters}
            minBedrooms={minBedrooms}
            maxBedrooms={maxBedrooms}
            onMinBedroomsChange={(val) => {
              setMinBedrooms(val);
              setBedroomsFilterActive(val > 1);
            }}
            showAvailableOnly={showAvailableOnly}
            onShowAvailableOnlyChange={setShowAvailableOnly}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            priceFilterActive={priceFilterActive}
            onPriceFilterActiveChange={setPriceFilterActive}
            onGuestsChange={setMinGuests}
            initialLocation={filters.location}
            initialCheckIn={searchDates.checkIn}
            initialCheckOut={searchDates.checkOut}
            initialGuests={minGuests > 1 ? minGuests : undefined}
          />
        </div>

        <section className="bg-[#000000] py-8 min-h-[80vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <p className="text-mist/70 font-poppins text-[13px]">
                {filteredProperties.length}{" "}
                {filteredProperties.length === 1
                  ? t("filters.property")
                  : t("filters.properties")}{" "}
                {t("filters.found")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {isLoading && allProperties.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <p className="text-mist font-poppins text-lg">
                    {t("loading")}
                  </p>
                </div>
              ) : !filteredProperties?.length ? (
                <div className="col-span-full text-center py-20">
                  <p className="text-mist font-poppins text-lg">
                    {t("noResults")}
                  </p>
                </div>
              ) : (
                [...filteredProperties!]
                  .map((property: any) => {
                    const pricing = calendarData?.[property.id];
                    const hasDates =
                      !!searchDates.checkIn && !!searchDates.checkOut;
                    const isUnavail =
                      hasDates &&
                      pricing &&
                      (pricing.unavailableDates?.length > 0 ||
                        pricing.nights === 0 ||
                        (pricing.minimumStay &&
                          pricing.nights > 0 &&
                          pricing.nights < pricing.minimumStay));
                    return { property, pricing, hasDates, isUnavail };
                  })
                  .filter(({ isUnavail }) => !showAvailableOnly || !isUnavail)
                  .sort((a, b) => {
                    if (!a.hasDates || !calendarData) return 0;
                    if (a.isUnavail && !b.isUnavail) return 1;
                    if (!a.isUnavail && b.isUnavail) return -1;
                    return 0;
                  })
                  .map(({ property, pricing, hasDates }) => {
                    let cardPricing = pricing;
                    if (
                      property.source === "guesty" &&
                      pricing &&
                      pricing.pricedNights > 0
                    ) {
                      const fee =
                        typeof property.cleaningFee === "number" &&
                        property.cleaningFee > 0
                          ? property.cleaningFee
                          : 0;
                      const silqhausTotal = calculateSilqhausPrice(
                        pricing.pricedTotalPrice,
                        0,
                        fee,
                        "guesty",
                      );
                      cardPricing = {
                        ...pricing,
                        // The card shows a total, so mark that up too — not
                        // just the nightly average.
                        totalPrice: silqhausTotal,
                        nights: pricing.pricedNights,
                        averageNightlyRate: Math.round(
                          silqhausTotal / pricing.pricedNights,
                        ),
                      };
                    } else if (
                      property.source !== "guesty" &&
                      pricing &&
                      pricing.nights > 0 &&
                      pricing.totalPrice > 0
                    ) {
                      const fee =
                        typeof property.cleaningFee === "number" &&
                        property.cleaningFee > 0
                          ? property.cleaningFee
                          : 0;
                      const silqhausTotal = calculateSilqhausPrice(
                        pricing.totalPrice,
                        0,
                        fee,
                        "hostaway",
                      );
                      cardPricing = {
                        ...pricing,
                        totalPrice: silqhausTotal,
                        averageNightlyRate: Math.round(
                          silqhausTotal / pricing.nights,
                        ),
                      };
                    }
                    return (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        pricing={cardPricing}
                        hasDates={hasDates}
                        isLoadingPrices={isLoadingPrices}
                        searchDates={searchDates}
                        fromQuote={
                          fromQuotes.data?.[
                            `${property.source ?? "hostaway"}:${property.id}`
                          ] ?? null
                        }
                        t={t}
                      />
                    );
                  })
              )}
            </div>
          </div>
        </section>
        <OTASection />
      </div>
    </>
  );
}
