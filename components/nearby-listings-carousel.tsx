"use client";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useState, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { createPropertySlug } from "@/lib/slugify";
import { useTranslations } from "next-intl";
import { useHoverPrefetch } from "@/hooks/use-hover-prefetch";

interface NearbyListing {
  id: number | string;
  source?: "hostaway" | "guesty";
  name: string;
  city?: string;
  state?: string;
  price?: number;
  priceBase?: number;
  currencyCode?: string;
  personCapacity?: number;
  bedroomsNumber?: number;
  bathroomsNumber?: number;
  listingImages?: { url: string; caption?: string }[];
  images?: { url: string; caption?: string }[];
}

interface NearbyListingsCarouselProps {
  city: string;
  currentPropertyId: number | string;
  currentSource?: "hostaway" | "guesty";
  className?: string;
}

export default function NearbyListingsCarousel({
  city,
  currentPropertyId,
  currentSource = "hostaway",
  className = "",
}: NearbyListingsCarouselProps) {
  const t = useTranslations("nearbyListings");
  const buildHoverHandlers = useHoverPrefetch();
  const [currentListing, setCurrentListing] = useState(0);
  const listingsContainerRef = useRef<HTMLDivElement>(null);
  const [containerGap] = useState(16);

  const hostawayQuery = useQuery<NearbyListing[]>({
    queryKey: ["hostaway", "listings"],
    queryFn: async () => {
      const res = await fetch("/api/hostaway/listings");
      if (!res.ok) throw new Error("Failed to fetch hostaway listings");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!city,
  });

  const guestyQuery = useQuery<NearbyListing[]>({
    queryKey: ["guesty", "listings"],
    queryFn: async () => {
      const res = await fetch("/api/guesty/listings");
      if (!res.ok) throw new Error("Failed to fetch guesty listings");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!city,
  });

  const isLoading = hostawayQuery.isLoading || guestyQuery.isLoading;

  const listings = useMemo<NearbyListing[]>(() => {
    const ha = (hostawayQuery.data ?? []).map((l) => ({
      ...l,
      source: l.source ?? "hostaway",
    }));
    const gu = (guestyQuery.data ?? []).map((l) => ({
      ...l,
      source: l.source ?? "guesty",
    }));
    const merged = [...ha, ...gu];
    const seen = new Set<string>();
    const deduped: NearbyListing[] = [];
    for (const l of merged) {
      const key = `${l.source ?? "hostaway"}:${l.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(l);
    }
    return deduped.filter(
      (listing) =>
        listing.city?.toLowerCase() === city.toLowerCase() &&
        !(
          String(listing.id) === String(currentPropertyId) &&
          (listing.source ?? "hostaway") === currentSource
        ),
    );
  }, [
    hostawayQuery.data,
    guestyQuery.data,
    city,
    currentPropertyId,
    currentSource,
  ]);

  const maxListings = Math.max(0, listings.length - 1);

  const handleListingsScroll = (direction: "left" | "right") => {
    if (!listingsContainerRef.current) return;

    const newListing =
      direction === "left"
        ? Math.max(0, currentListing - 1)
        : Math.min(maxListings, currentListing + 1);

    setCurrentListing(newListing);

    const cardWidth =
      listingsContainerRef.current.children[0]?.getBoundingClientRect().width ||
      0;

    const scrollPosition = newListing * (cardWidth + containerGap);

    listingsContainerRef.current.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
  };

  const handleDotClick = (index: number) => {
    setCurrentListing(index);
    if (!listingsContainerRef.current) return;

    const cardWidth =
      listingsContainerRef.current.children[0]?.getBoundingClientRect().width ||
      0;

    const scrollPosition = index * (cardWidth + containerGap);

    listingsContainerRef.current.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <section className={`py-8 ${className}`}>
        <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-wider text-white uppercase text-left font-gilroy font-medium">
          {t("moreProperties", { city })}
        </h2>
        <div className="flex gap-3 sm:gap-4 md:gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-none w-64 sm:w-72 md:w-80 h-80 bg-white/5 animate-pulse rounded-lg"
            />
          ))}
        </div>
      </section>
    );
  }

  if (listings.length === 0) {
    return null;
  }

  return (
    <section className={`py-8 ${className}`}>
      <div className="mb-6 sm:mb-8 md:mb-10">
        <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-wider text-white uppercase text-left font-gilroy font-medium">
          {t("moreProperties", { city })}
        </h2>
      </div>

      <div className="relative group mb-6 sm:mb-8">
        {maxListings > 0 && (
          <>
            <button
              onClick={() => handleListingsScroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-2 z-30 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-[#7e6725] disabled:opacity-30 disabled:cursor-not-allowed text-black hover:text-white rounded-full shadow-lg border border-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7e6725] focus:ring-offset-2"
              aria-label={t("previousListings")}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
            </button>

            <button
              onClick={() => handleListingsScroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-2 z-30 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-[#7e6725] disabled:opacity-30 disabled:cursor-not-allowed text-black hover:text-white rounded-full shadow-lg border border-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7e6725] focus:ring-offset-2"
              aria-label={t("nextListings")}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
            </button>
          </>
        )}

        <div
          ref={listingsContainerRef}
          className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto scrollbar-hide px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {listings.map((listing) => {
            const href = `/our-property/${createPropertySlug(listing.name, listing.id)}`;
            return (
              <Link
                key={listing.id}
                href={href}
                prefetch={false}
                {...buildHoverHandlers(href)}
                className="flex-none w-64 sm:w-72 md:w-80 lg:w-72 xl:w-80 2xl:w-96 group cursor-pointer rounded-lg overflow-hidden relative border border-white/10 hover:border-[#7e6725]/40 focus:outline-none focus:ring-2 focus:ring-[#7e6725]/20 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="aspect-[3/4] relative">
                  {listing.listingImages?.[0] || listing.images?.[0] ? (
                    <Image
                      src={
                        (listing.listingImages?.[0] || listing.images?.[0])
                          ?.url || ""
                      }
                      alt={listing.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/10 flex items-center justify-center">
                      <Home className="w-12 h-12 text-white/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                    <h3 className="text-sm sm:text-base font-poppins font-semibold text-left mb-1">
                      {listing.name}
                    </h3>
                    <p className="text-xs text-white/60 font-poppins text-left mb-1">
                      {t("bedrooms", { count: listing.bedroomsNumber ?? 0 })} •{" "}
                      {listing.city}
                      {listing.state ? `, ${listing.state}` : ""}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {maxListings > 0 && (
        <div className="flex justify-center space-x-2 mb-6 sm:mb-8">
          {Array.from({ length: maxListings + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7e6725]/40 focus:ring-offset-2 focus:ring-offset-black ${
                currentListing === index
                  ? "bg-[#7e6725] w-6 sm:w-7"
                  : "bg-white/30 hover:bg-white/60"
              }`}
              aria-label={t("goToSlide", { index: index + 1 })}
            />
          ))}
        </div>
      )}
    </section>
  );
}
