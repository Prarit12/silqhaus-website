"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { fetchReviewsWithCount } from "@/lib/api/hostaway";
import { ReviewCard } from "@/components/review-card";
import { getOTAListingUrl } from "@/config/ota-channels";

interface PropertyReviewsProps {
  propertyId: string;
  property: {
    name?: string;
    airbnbListingUrl?: string;
    vrboListingUrl?: string;
    bookingcomListingUrl?: string;
    googleVrListingUrl?: string;
    expediaListingUrl?: string;
  };
  averageReviewRating?: number;
}

export function PropertyReviews({
  propertyId,
  property,
  averageReviewRating,
}: PropertyReviewsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/hostaway/reviews", propertyId, "withCount"],
    queryFn: () => fetchReviewsWithCount(propertyId),
    enabled: !!propertyId,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
    },
    [
      Autoplay({
        delay: 5000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );

  // console.log("PropertyReviews - data from useQuery:", data);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (isLoading) {
    return (
      <section className="py-4">
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  // console.log("Fetched reviews data:", data);

  if (!data) return null;

  const { reviews: allReviews, totalCount } = data;

  const displayReviews = allReviews
    .filter((r) => r.publicReview && r.publicReview.trim() !== "")
    .sort(
      (a, b) =>
        new Date(b.insertedOn).getTime() - new Date(a.insertedOn).getTime(),
    );

  if (displayReviews.length === 0 && totalCount === 0) return null;

  const formattedRating =
    averageReviewRating != null ? averageReviewRating.toFixed(1) : null;

  return (
    <section className="py-4">
      <h2 className="text-[#e3e1d8] mb-6 font-gilroy text-2xl font-bold">
        Guest Reviews ({totalCount})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-8">
        {formattedRating && (
          <div className="flex flex-col items-center justify-center bg-[#6e5d41] border border-white/10 rounded-xl p-6 md:p-8 md:min-w-[200px]">
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              </div>
              <span className="text-5xl md:text-6xl font-bold text-white font-gilroy leading-none">
                {formattedRating}
              </span>
            </div>
            <span className="text-white text-sm font-poppins mt-2 text-center">
              Average Guest Rating
            </span>
          </div>
        )}
        {displayReviews.length > 0 && (
          <div className="relative min-w-0">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {displayReviews.map((review, i) => (
                  <div
                    key={`${review.channelId}-${review.insertedOn}-${i}`}
                    className="flex-shrink-0 basis-full px-1"
                  >
                    <ReviewCard
                      review={{ ...review, listingName: property.name }}
                      variant="property"
                      otaUrl={getOTAListingUrl(
                        review.channelId,
                        property as Record<string, unknown>,
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
            {canScrollPrev && (
              <button
                onClick={() => emblaApi?.scrollPrev()}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-8 h-8 bg-black/80 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black transition-colors z-10"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {canScrollNext && (
              <button
                onClick={() => emblaApi?.scrollNext()}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-8 h-8 bg-black/80 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black transition-colors z-10"
                aria-label="Next review"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
