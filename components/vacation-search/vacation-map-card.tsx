"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { displayPropertyName } from "@/config/property-names";
import { buildPropertyHref } from "@/components/property-card";
import type { SearchItem } from "./types";

const MAX_PHOTOS = 5;

/**
 * The card that pops up when a map pill is clicked. Floating above the pin on
 * desktop, a bottom sheet on mobile. Mirrors the grid card's price/rating logic
 * so the two never disagree.
 */
export function VacationMapCard({
  item,
  searchDates,
  t,
  onClose,
  variant = "floating",
}: {
  item: SearchItem;
  searchDates?: { checkIn?: Date | null; checkOut?: Date | null };
  t: any;
  onClose: () => void;
  variant?: "floating" | "sheet";
}) {
  const { property, cardPricing, fromQuote, hasDates, isUnavailable } = item;
  const photos: string[] = (property.listingImages ?? [])
    .map((img: any) => img?.url)
    .filter(Boolean)
    .slice(0, MAX_PHOTOS);
  const [index, setIndex] = useState(0);

  const title = displayPropertyName(property);
  const href = buildPropertyHref(property, searchDates);
  const location = [property.city, property.state].filter(Boolean).join(", ");

  const rawRating = Number(property.averageReviewRating);
  const rating =
    Number.isFinite(rawRating) && rawRating > 0
      ? (rawRating > 5 ? rawRating / 2 : rawRating).toFixed(1)
      : null;

  const summary = [
    property.bedroomsNumber
      ? t("bedroomsCount", { count: property.bedroomsNumber })
      : null,
    property.bathroomsNumber
      ? t("bathroomsCount", { count: property.bathroomsNumber })
      : null,
    property.personCapacity
      ? t("guestsCount", { count: property.personCapacity })
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const step = (delta: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => Math.min(Math.max(i + delta, 0), photos.length - 1));
  };

  const priceLine = () => {
    if (hasDates) {
      const nights = cardPricing?.nights ?? 0;
      const total = cardPricing?.totalPrice ?? 0;
      if (isUnavailable || !total || !nights) return null;
      return (
        <>
          <span className="text-ink font-semibold">
            ฿{Math.round(total).toLocaleString()}
          </span>{" "}
          <span className="text-neutral-500">
            {t("forNights", { count: nights })}
          </span>
        </>
      );
    }
    if (!fromQuote?.total) return null;
    return (
      <>
        <span className="text-ink font-semibold">
          ฿{fromQuote.total.toLocaleString()}
        </span>{" "}
        <span className="text-neutral-500">
          {t("forNights", { count: fromQuote.nights })}
        </span>
      </>
    );
  };

  const shell =
    variant === "sheet"
      ? "w-full rounded-t-2xl"
      : "w-[300px] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.18)]";

  return (
    <div
      className={`group relative overflow-hidden bg-white border border-neutral-200 ${shell}`}
      data-testid={`vacation-map-card-${property.id}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        <div
          className="flex h-full w-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {photos.map((url, i) => (
            <div key={`${url}-${i}`} className="relative h-full w-full shrink-0">
              {Math.abs(i - index) <= 1 && (
                <Image
                  src={url}
                  alt={i === 0 ? title : ""}
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              )}
            </div>
          ))}
        </div>

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={step(-1)}
              disabled={index === 0}
              aria-label={t("photoPrev")}
              className="absolute top-1/2 left-2 -translate-y-1/2 z-20 grid place-items-center w-7 h-7 rounded-full bg-white/90 text-ink shadow-md hover:bg-white disabled:hidden"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={step(1)}
              disabled={index === photos.length - 1}
              aria-label={t("photoNext")}
              className="absolute top-1/2 right-2 -translate-y-1/2 z-20 grid place-items-center w-7 h-7 rounded-full bg-white/90 text-ink shadow-md hover:bg-white disabled:hidden"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          aria-label={t("mapCard.close")}
          className="absolute top-2 right-2 z-30 grid place-items-center w-7 h-7 rounded-full bg-white/95 text-ink shadow-md hover:bg-white"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        {isUnavailable && (
          <span className="absolute top-2 left-2 z-20 rounded-full bg-white/95 text-ink text-[11px] font-medium px-2.5 py-1">
            {t("notAvailable")}
          </span>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-[15px] leading-snug line-clamp-1">
          <Link
            href={href as any}
            prefetch={false}
            className="text-ink hover:text-ink after:absolute after:inset-0 after:z-10"
          >
            {title}
          </Link>
        </h3>
        {location && (
          <p className="text-neutral-500 text-[13px] leading-snug mt-0.5">
            {location}
          </p>
        )}
        {(rating || summary) && (
          <p className="text-neutral-500 text-[13px] leading-snug mt-0.5 flex flex-wrap items-baseline gap-x-1">
            {rating && (
              <span className="text-ink inline-flex items-baseline gap-0.5">
                <Star
                  className="w-3 h-3 self-center fill-current"
                  aria-hidden="true"
                />
                {rating}
              </span>
            )}
            {rating && summary && <span aria-hidden="true">·</span>}
            {summary && <span>{summary}</span>}
          </p>
        )}
        {priceLine() && (
          <p className="text-[13px] leading-snug mt-1">{priceLine()}</p>
        )}
      </div>
    </div>
  );
}
