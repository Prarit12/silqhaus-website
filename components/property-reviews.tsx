"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useTranslations } from "next-intl";
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
  source?: "hostaway" | "guesty";
}

/** The fields the carousel below actually renders, shared by both sources. */
interface DisplayableReview {
  publicReview?: string;
  reviewerName?: string | null;
  insertedOn: string;
  channelId: number;
  rating?: number;
  listingMapId?: number;
}

export function PropertyReviews({
  propertyId,
  property,
  averageReviewRating,
  source = "hostaway",
}: PropertyReviewsProps) {
  const t = useTranslations("propertyDetail");
  const { data, isLoading } = useQuery<{
    reviews: DisplayableReview[];
    totalCount: number;
  }>({
    queryKey: ["property-reviews", source, propertyId],
    queryFn: async () => {
      if (source === "guesty") {
        const res = await fetch(
          `/api/guesty/reviews/${encodeURIComponent(propertyId)}`,
        );
        if (!res.ok) throw new Error("Failed to fetch Guesty reviews");
        return res.json();
      }
      return fetchReviewsWithCount(propertyId);
    },
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
      <section className="py-8">
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
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

  // One convention everywhere: Hostaway's 10-scale becomes the same 5-star
  // number the title meta line shows (9.8 → 4.9); Guesty is 5-scale already.
  const formattedRating =
    averageReviewRating != null && averageReviewRating > 0
      ? (averageReviewRating > 5
          ? averageReviewRating / 2
          : averageReviewRating
        ).toFixed(1)
      : null;

  return (
    <section className="py-8 border-b border-neutral-200">
      <h2 className="text-ink mb-6 text-xl font-semibold normal-case tracking-normal">
        {t("guestReviews", { count: totalCount })}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-8">
        {formattedRating && (
          <div className="flex flex-col items-center justify-center border border-neutral-200 rounded-2xl p-6 md:p-8 md:min-w-[200px]">
            <div className="flex items-center gap-2">
              <Star
                className="w-8 h-8 text-ink fill-ink"
                aria-hidden="true"
              />
              <span className="text-5xl md:text-6xl font-bold text-ink leading-none">
                {formattedRating}
              </span>
            </div>
            <span className="text-neutral-600 text-sm mt-3 text-center">
              {t("averageGuestRating")}
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
                      review={{
                        ...review,
                        reviewerName: review.reviewerName ?? "",
                        publicReview: review.publicReview ?? "",
                        rating: review.rating ?? 0,
                        listingMapId: review.listingMapId ?? 0,
                        listingName: property.name,
                      }}
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
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-8 h-8 bg-white border border-neutral-200 rounded-full flex items-center justify-center text-ink shadow-md hover:bg-neutral-100 transition-colors z-10"
                aria-label={t("previousReview")}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {canScrollNext && (
              <button
                onClick={() => emblaApi?.scrollNext()}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-8 h-8 bg-white border border-neutral-200 rounded-full flex items-center justify-center text-ink shadow-md hover:bg-neutral-100 transition-colors z-10"
                aria-label={t("nextReview")}
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
