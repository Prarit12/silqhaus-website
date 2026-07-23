"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { createPropertySlug } from "@/lib/slugify";
import { displayPropertyName } from "@/config/property-names";
import { PMSFavoriteButton } from "@/components/pms-favorite-button";
import { useHoverPrefetch } from "@/hooks/use-hover-prefetch";

/** A quote for the property's first bookable minimum stay (no dates chosen). */
export interface FromQuote {
  nights: number;
  total: number;
  avgNightly: number;
  currency: string;
}

export interface PropertyCardProps {
  property: any;
  pricing: any;
  hasDates: boolean;
  isLoadingPrices: boolean;
  searchDates?: { checkIn?: Date | null; checkOut?: Date | null };
  /** Real "from" price for the property's minimum stay, from /api/home-pricing. */
  fromQuote?: FromQuote | null;
  t: any;
  /** "dark" (default) for the ink listing page, "light" for white sections. */
  theme?: "dark" | "light";
}

/** Carrying every photo would mount 80+ images per card; a handful is plenty. */
const MAX_PHOTOS = 8;
/** Airbnb-style dot strip: at most five, sliding to follow the active photo. */
const MAX_DOTS = 5;

function buildPropertyHref(
  property: any,
  searchDates?: { checkIn?: Date | null; checkOut?: Date | null },
): string {
  const slug = createPropertySlug(property.name, property.id);
  const query: Record<string, string> = {};
  if (searchDates?.checkIn) {
    const d = searchDates.checkIn;
    query.checkIn = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  if (searchDates?.checkOut) {
    const d = searchDates.checkOut;
    query.checkOut = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  const qs = new URLSearchParams(query).toString();
  return `/our-property/${slug}${qs ? `?${qs}` : ""}`;
}

export function PropertyCard({
  property,
  pricing,
  hasDates,
  isLoadingPrices,
  searchDates,
  fromQuote,
  t,
  theme = "dark",
}: PropertyCardProps) {
  const light = theme === "light";
  const nameCls = light ? "text-ink" : "text-white";
  const mutedCls = light ? "text-neutral-500" : "text-[#aaa]";

  const photos: string[] = (property.listingImages ?? [])
    .map((img: any) => img?.url)
    .filter(Boolean)
    .slice(0, MAX_PHOTOS);
  const [index, setIndex] = useState(0);

  const isUnavailable =
    hasDates &&
    pricing &&
    (pricing.unavailableDates?.length > 0 ||
      pricing.nights === 0 ||
      (pricing.minimumStay &&
        pricing.nights > 0 &&
        pricing.nights < pricing.minimumStay));

  const href = buildPropertyHref(property, searchDates);
  const prefetchHandlers = useHoverPrefetch()(href);

  // The guest-facing name. Slugs stay on property.name so URLs don't move.
  const title = displayPropertyName(property);

  // Hostaway scores reviews out of 10; guests read stars out of 5.
  const rawRating = Number(property.averageReviewRating);
  const rating =
    Number.isFinite(rawRating) && rawRating > 0
      ? (rawRating > 5 ? rawRating / 2 : rawRating).toFixed(1)
      : null;

  const step = (delta: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => Math.min(Math.max(i + delta, 0), photos.length - 1));
  };

  // Slide the dot window so the active photo always has a dot.
  const dotStart = Math.min(
    Math.max(0, index - Math.floor(MAX_DOTS / 2)),
    Math.max(0, photos.length - MAX_DOTS),
  );
  const dots = Array.from(
    { length: Math.min(photos.length, MAX_DOTS) },
    (_, i) => dotStart + i,
  );

  const arrowCls =
    "absolute top-1/2 -translate-y-1/2 z-20 grid place-items-center w-7 h-7 rounded-full bg-white/90 text-ink shadow-md " +
    "opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity hover:bg-white hover:scale-105 " +
    "disabled:hidden";

  const summary = [
    property.bedroomsNumber
      ? t("bedroomsCount", { count: property.bedroomsNumber })
      : null,
    property.bathroomsNumber
      ? t("bathroomsCount", { count: property.bathroomsNumber })
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  /** "฿135,000 for 3 nights" — a total a guest could actually book. */
  const renderPrice = () => {
    if (hasDates) {
      if (isLoadingPrices) {
        return <span className={mutedCls}>{t("loadingPrices")}</span>;
      }
      const nights = pricing?.nights ?? 0;
      const total = pricing?.totalPrice ?? 0;
      if (!total || !nights) return null;
      return (
        <>
          <span className={`${nameCls} font-semibold`}>
            ฿{Math.round(total).toLocaleString()}
          </span>{" "}
          <span className={mutedCls}>{t("forNights", { count: nights })}</span>
        </>
      );
    }
    if (!fromQuote?.total) return null;
    return (
      <>
        <span className={`${nameCls} font-semibold`}>
          ฿{fromQuote.total.toLocaleString()}
        </span>{" "}
        <span className={mutedCls}>
          {t("forNights", { count: fromQuote.nights })}
        </span>
      </>
    );
  };

  const price = renderPrice();

  return (
    <div
      className="group relative h-full flex flex-col"
      {...prefetchHandlers}
      data-testid={`property-card-${property.id}`}
    >
      {/* Photo carousel */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
        <div
          className="flex h-full w-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {photos.map((url, i) => (
            <div key={`${url}-${i}`} className="relative h-full w-full shrink-0">
              {/* Mount the current photo and its neighbours only. */}
              {Math.abs(i - index) <= 1 && (
                <Image
                  src={url}
                  alt={i === 0 ? title : ""}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
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
              className={`${arrowCls} left-2`}
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={step(1)}
              disabled={index === photos.length - 1}
              aria-label={t("photoNext")}
              className={`${arrowCls} right-2`}
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5"
              aria-hidden="true"
            >
              {dots.map((d) => (
                <span
                  key={d}
                  className={`rounded-full transition-all duration-200 ${
                    d === index
                      ? "w-1.5 h-1.5 bg-white"
                      : "w-1.5 h-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>

            <span className="sr-only" aria-live="polite">
              {t("photoPosition", { current: index + 1, total: photos.length })}
            </span>
          </>
        )}

        {isUnavailable && (
          <span className="absolute top-3 left-3 z-20 rounded-full bg-white/95 text-ink text-[11px] font-medium px-2.5 py-1">
            {t("notAvailable")}
          </span>
        )}

        {/* z-20 keeps the heart above the stretched link. */}
        <PMSFavoriteButton
          listingId={String(property.id)}
          side="vacation"
          positionClass="absolute top-3 right-3 z-20"
          snapshot={{
            kind: "vacation",
            id: String(property.id),
            name: title,
            slug: createPropertySlug(property.name, property.id),
            city: property.city ?? null,
            state: property.state ?? null,
            imageUrl: photos[0] ?? null,
            bedroomsNumber: property.bedroomsNumber ?? null,
            bathroomsNumber: property.bathroomsNumber ?? null,
            personCapacity: property.personCapacity ?? null,
          }}
        />
      </div>

      <div className="mt-3">
        <h3 className="font-semibold text-[15px] leading-snug line-clamp-1">
          {/* Stretched link — the whole card navigates, but the carousel
              buttons above keep their own clicks. The colour has to sit on the
              anchor itself; the global link rule would otherwise paint it white. */}
          <Link
            href={href as any}
            prefetch={false}
            className={`${nameCls} after:absolute after:inset-0 after:z-10`}
          >
            {title}
          </Link>
        </h3>

        {summary && (
          <p className={`${mutedCls} text-[14px] leading-snug mt-0.5`}>
            {summary}
          </p>
        )}

        {price && (
          <p className={`${mutedCls} text-[14px] leading-snug mt-1`}>
            {price}
            {rating && (
              <>
                {" · "}
                <span className={`${nameCls} inline-flex items-baseline gap-0.5`}>
                  <Star
                    className="w-3 h-3 self-center fill-current"
                    aria-hidden="true"
                  />
                  {rating}
                </span>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
