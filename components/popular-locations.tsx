"use client";
import { useState, useRef, useMemo } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { createPropertySlug } from "@/lib/slugify";
import { useHoverPrefetch } from "@/hooks/use-hover-prefetch";

export default function PopularLocations() {
  const t = useTranslations("home.popularLocations");
  const buildHoverHandlers = useHoverPrefetch();

  const listingsContainerRef = useRef<HTMLDivElement>(null);
  const [currentListing, setCurrentListing] = useState(0);

  const hostawayQuery = useQuery<any[]>({
    queryKey: ["hostaway", "listings"],
    queryFn: async () => {
      const res = await fetch("/api/hostaway/listings");
      if (!res.ok) throw new Error("Failed to fetch hostaway listings");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const guestyQuery = useQuery<any[]>({
    queryKey: ["guesty", "listings"],
    queryFn: async () => {
      const res = await fetch("/api/guesty/listings");
      if (!res.ok) throw new Error("Failed to fetch guesty listings");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const isLoading = hostawayQuery.isLoading || guestyQuery.isLoading;
  const error =
    hostawayQuery.error && guestyQuery.error ? hostawayQuery.error : null;

  const villas = useMemo(() => {
    const ha = (hostawayQuery.data ?? []).map((l: any) => ({
      ...l,
      source: l.source ?? "hostaway",
    }));
    const gu = (guestyQuery.data ?? []).map((l: any) => ({
      ...l,
      source: l.source ?? "guesty",
    }));
    const merged = [...ha, ...gu];
    const seen = new Set<string>();
    const deduped: any[] = [];
    for (const l of merged) {
      const key = `${l.source ?? "hostaway"}:${l.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(l);
    }
    return deduped;
  }, [hostawayQuery.data, guestyQuery.data]);

  const containerGap = 16;
  const maxListings = Math.max(0, villas?.length - 1);

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <p className="text-mist font-poppins text-lg">{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-mist font-poppins text-lg">{t("error")}</p>
      </div>
    );
  }

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
  };

  return (
    <section className="py-16 sm:py-20 md:py-28 relative bg-ink flex items-center">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-14 max-w-2xl">
          <span className="eyebrow mb-5">{t("eyebrow")}</span>
          <h2 className="font-display font-light text-white text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight mt-5 normal-case">
            {t("title")}
          </h2>
          <p className="text-white/60 text-left font-poppins font-light text-base sm:text-lg leading-relaxed mt-5">
            {t("description")}
          </p>
        </div>

        {/* Carousel Container */}

        <div className="relative group mb-6 sm:mb-8">
          {/* Navigation Arrows - Only show when navigation is needed */}
          {maxListings > 0 && (
            <>
              <button
                onClick={() => handleListingsScroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-2 z-30 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-[#7e6725] disabled:opacity-30 disabled:cursor-not-allowed text-black hover:text-white rounded-full shadow-lg border border-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7e6725] focus:ring-offset-2"
                aria-label="Previous villas"
                data-testid="button-carousel-prev"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
              </button>

              <button
                onClick={() => handleListingsScroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-2 z-30 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-[#7e6725] disabled:opacity-30 disabled:cursor-not-allowed text-black hover:text-white rounded-full shadow-lg border border-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7e6725] focus:ring-offset-2"
                aria-label="Next villas"
                data-testid="button-carousel-next"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
              </button>
            </>
          )}

          {/* Villa Carousel - Horizontal scroll layout */}
          <div
            ref={listingsContainerRef}
            className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto scrollbar-hide px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {villas?.map((villa: any) => {
              const href = `/our-property/${createPropertySlug(villa.name, villa.id)}`;
              return (
                <Link
                  key={villa.id}
                  href={href as any}
                  prefetch={false}
                  {...buildHoverHandlers(href)}
                  className="flex-none w-64 sm:w-72 md:w-80 lg:w-72 xl:w-80 2xl:w-96 group cursor-pointer rounded-2xl overflow-hidden relative ring-1 ring-line hover:ring-gold-antique/50 focus:outline-none focus:ring-2 focus:ring-gold-antique/40 transition-all duration-500"
                  aria-label={`View ${villa.name} details`}
                  data-testid={`card-villa-${villa.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/--/g, "-")}`}
                >
                  <div className="aspect-[3/4] relative">
                    <Image
                      src={villa.listingImages?.[0]?.url ?? ""}
                      alt={villa.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-105"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-colors duration-500 group-hover:from-black/90"></div>
                    {/* Text overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <p className="text-[0.65rem] text-champagne font-poppins text-left mb-1.5 uppercase tracking-[0.24em]">
                        {villa.city}
                        {villa.state ? `, ${villa.state}` : ""}
                      </p>
                      <h3
                        className="font-display text-xl sm:text-2xl font-light text-left leading-tight"
                        data-testid="text-villa-title"
                      >
                        {villa.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2.5">
                        <span className="h-px w-6 bg-gold-antique/70" />
                        <p className="text-xs text-white/60 font-poppins text-left">
                          {villa.bedroomsNumber} {t("bedrooms")}
                        </p>
                      </div>
                      {/* Price hidden per request */}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Pagination Dots - Only show when navigation is needed */}
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
                aria-label={`Go to slide ${index + 1}`}
                data-testid={`popular-locations-dot-${index}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
