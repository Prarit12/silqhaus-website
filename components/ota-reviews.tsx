"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchReviews, fetchPublicListings } from "@/lib/api/hostaway";
import { ReviewCard, type ReviewData } from "@/components/review-card";
import { buildListingNameMap } from "@/config/ota-channels";

export function OTAReviews() {
  const { data: listings } = useQuery<Array<{ id: number; name: string }>>({
    queryKey: ["/api/hostaway/listings"],
    queryFn: () => fetchPublicListings(),
  });

  const listingNames = listings ? buildListingNameMap(listings) : {};

  const { data: reviews, isLoading } = useQuery<ReviewData[]>({
    queryKey: ["/api/hostaway/reviews"],
    queryFn: () => fetchReviews(),
  });

  const displayReviews = (reviews || [])
    .filter((r) => r.publicReview && r.publicReview.trim() !== "")
    .slice(0, 90)
    .map((r) => ({
      ...r,
      listingName: listingNames[r.listingMapId] || undefined,
    }));

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "center",
      loop: true,
      slidesToScroll: 1,
    },
    [
      Autoplay({
        delay: 5000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
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
      <div className="flex justify-center py-8">
        <div className="w-6 h-6 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (displayReviews.length === 0) return null;

  return (
    <div className="w-full mt-10 relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex items-stretch">
          {displayReviews.map((review, i) => (
            <div
              key={`${review.listingMapId}-${review.channelId}-${i}`}
              className={`flex-shrink-0 px-2.5 basis-[86%] sm:basis-[58%] lg:basis-[42%] flex transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
                i === selectedIndex
                  ? "opacity-100 scale-100"
                  : "opacity-35 scale-[0.94]"
              }`}
            >
              <ReviewCard review={review} variant="homepage" />
            </div>
          ))}
        </div>
      </div>
      {canScrollPrev && (
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-8 h-8 bg-black/80 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black transition-colors z-10"
          aria-label="Previous reviews"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      {canScrollNext && (
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-8 h-8 bg-black/80 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black transition-colors z-10"
          aria-label="Next reviews"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
