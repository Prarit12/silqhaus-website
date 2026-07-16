"use client";
import Image from "next/image";
import { Bed, Bath, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { createPropertySlug } from "@/lib/slugify";
import { PMSFavoriteButton } from "@/components/pms-favorite-button";
import { useHoverPrefetch } from "@/hooks/use-hover-prefetch";

export interface PropertyCardProps {
  property: any;
  pricing: any;
  hasDates: boolean;
  isLoadingPrices: boolean;
  searchDates?: { checkIn?: Date | null; checkOut?: Date | null };
  fromPrice?: number;
  t: any;
}

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
  fromPrice,
  t,
}: PropertyCardProps) {
  const isUnavailable =
    hasDates &&
    pricing &&
    (pricing.unavailableDates?.length > 0 ||
      pricing.nights === 0 ||
      (pricing.minimumStay &&
        pricing.nights > 0 &&
        pricing.nights < pricing.minimumStay));
  const avgPrice = pricing?.averageNightlyRate || 0;
  const href = buildPropertyHref(property, searchDates);

  const prefetchHandlers = useHoverPrefetch()(href);

  return (
    <Link
      href={href as any}
      prefetch={false}
      {...prefetchHandlers}
      className={`transition-all duration-300 group cursor-pointer hover:scale-[1.03] h-full flex flex-col`}
      data-testid={`property-card-${property.id}`}
    >
      {/* Image Section */}
      <div className="relative">
        <div className="aspect-square overflow-hidden rounded-2xl relative">
          <Image
            src={property.listingImages[0]?.url}
            alt={property.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {isUnavailable && (
          <div className="absolute top-3 left-0">
            <span className="bg-[#7e6725]/90 text-white text-xs font-poppins font-medium px-3 py-1.5">
              {t("notAvailable")}
            </span>
          </div>
        )}

        <PMSFavoriteButton
          listingId={String(property.id)}
          side="vacation"
          snapshot={{
            kind: "vacation",
            id: String(property.id),
            name: property.name,
            slug: createPropertySlug(property.name, property.id),
            city: property.city ?? null,
            state: property.state ?? null,
            imageUrl: property.listingImages?.[0]?.url ?? null,
            bedroomsNumber: property.bedroomsNumber ?? null,
            bathroomsNumber: property.bathroomsNumber ?? null,
            personCapacity: property.personCapacity ?? null,
          }}
        />

        {/* Pagination dots placeholder */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
          <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
        </div>
      </div>

      {/* Text Section - Directly under image */}
      <div className="mt-3 flex-grow flex flex-col">
        {/* Location */}
        <p className="text-[#aaa] text-[10px] font-poppins uppercase tracking-wide mb-1">
          {property.city}, {property.state}
        </p>

        {/* Property Name */}
        <h3 className="text-white font-poppins font-bold text-[13px] leading-tight mb-1 line-clamp-2">
          {property.name}
        </h3>

        {/* Price and Features Row */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            {hasDates ? (
              isLoadingPrices ? (
                <span className="text-[#aaa] font-poppins text-[11px]">
                  {t("loadingPrices")}
                </span>
              ) : avgPrice > 0 ? (
                <>
                  <span className="text-[#aaa] font-poppins text-[10px] mr-1">
                    {t("avgLabel")}
                  </span>
                  <span className="text-white font-poppins font-bold text-[13px]">
                    ฿{avgPrice.toLocaleString()}
                  </span>
                  <span className="text-[#aaa] font-poppins text-[10px] ml-1">
                    {t("perNight")}
                  </span>
                </>
              ) : null
            ) : fromPrice && fromPrice > 0 ? (
              <>
                <span className="text-[#aaa] font-poppins text-[10px] mr-1">
                  {t("fromLabel")}
                </span>
                <span className="text-white font-poppins font-bold text-[13px]">
                  ฿{fromPrice.toLocaleString()}
                </span>
                <span className="text-[#aaa] font-poppins text-[10px] ml-1">
                  {t("perNight")}
                </span>
              </>
            ) : null}
          </div>

          {/* Property Features Icons */}
          <div className="flex items-center gap-2 text-[#aaa]">
            <div className="flex items-center gap-0.5">
              <Bed size={10} className="text-[#8c7429]" />
              <span className="font-poppins font-normal text-[12px]">
                {property.bedroomsNumber}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <Users size={10} className="text-[#8c7429]" />
              <span className="font-poppins text-[12px]">
                {property.personCapacity}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <Bath size={10} className="text-[#8c7429]" />
              <span className="font-poppins text-[12px]">
                {property.bathroomsNumber}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
