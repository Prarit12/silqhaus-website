"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { fetchReviewsWithCount } from "@/lib/api/hostaway";

/**
 * Guest reviews, distilled: heading with the rating inline, the three most
 * recent quotes in a row, and the full set expanding in place — guests
 * never leave the site to read reviews. The giant rating box and the
 * one-at-a-time carousel are gone; the title meta already carries the star.
 */

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

/** The fields this section renders, shared by both sources. */
interface DisplayableReview {
  publicReview?: string;
  reviewerName?: string | null;
  insertedOn: string;
  channelId: number;
}

const MAX_REVIEWS = 3;

export function PropertyReviews({
  propertyId,
  property,
  averageReviewRating,
  source = "hostaway",
}: PropertyReviewsProps) {
  const t = useTranslations("propertyDetail");
  const locale = useLocale();
  const [expanded, setExpanded] = useState(false);
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

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="flex justify-center py-6">
          <div className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (!data) return null;

  const { reviews: allReviews, totalCount } = data;

  const textReviews = allReviews
    .filter((r) => r.publicReview && r.publicReview.trim() !== "")
    .sort(
      (a, b) =>
        new Date(b.insertedOn).getTime() - new Date(a.insertedOn).getTime(),
    );
  const displayReviews = expanded
    ? textReviews
    : textReviews.slice(0, MAX_REVIEWS);

  if (displayReviews.length === 0 && totalCount === 0) return null;

  // One convention everywhere: the same 5-star number the title meta shows.
  const rating =
    averageReviewRating != null && averageReviewRating > 0
      ? (averageReviewRating > 5
          ? averageReviewRating / 2
          : averageReviewRating
        ).toFixed(1)
      : null;

  const formatMonthYear = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <section className="py-8 border-b border-neutral-200">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-xl font-semibold normal-case tracking-normal text-ink">
          {t("reviewsTitle")}
        </h2>
        <span className="inline-flex items-baseline gap-x-1.5 text-[15px] text-neutral-600">
          {rating && (
            <span className="inline-flex items-center gap-1 font-medium text-ink">
              <Star
                className="w-3.5 h-3.5 self-center fill-current"
                aria-hidden="true"
              />
              {rating}
            </span>
          )}
          {rating && <span aria-hidden="true">·</span>}
          {t("reviewsCountShort", { count: totalCount })}
        </span>
      </div>

      {displayReviews.length > 0 && (
        <div className="mt-5 grid gap-x-10 gap-y-6 md:grid-cols-3">
          {displayReviews.map((review, i) => (
            <div key={`${review.channelId}-${review.insertedOn}-${i}`}>
              <p className="text-sm text-ink">
                {review.reviewerName && (
                  <span className="font-semibold">{review.reviewerName}</span>
                )}
                {review.reviewerName && (
                  <span className="text-neutral-400" aria-hidden="true">
                    {" · "}
                  </span>
                )}
                <span className="text-neutral-500">
                  {formatMonthYear(review.insertedOn)}
                </span>
              </p>
              <p
                className={`mt-1 text-sm leading-relaxed text-neutral-700 ${
                  expanded ? "" : "line-clamp-3"
                }`}
              >
                {review.publicReview}
              </p>
            </div>
          ))}
        </div>
      )}

      {textReviews.length > MAX_REVIEWS && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-6 inline-flex items-center justify-center h-11 px-5 rounded-lg border border-ink text-[15px] font-semibold text-ink hover:bg-neutral-50 transition-colors"
        >
          {expanded
            ? t("showFewerReviews")
            : t("showAllReviews", { count: textReviews.length })}
        </button>
      )}
    </section>
  );
}
