"use client";
import Image from "next/image";
import { Bed, Bath, Maximize2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { PMSListing } from "@/lib/silqhaus-pms/listings";
import { PMSFavoriteButton } from "@/components/pms-favorite-button";
import {
  getPMSPrimaryPriceLine,
  getPMSCoverImage,
} from "@/lib/api/silqhaus-pms";

interface PMSListingCardProps {
  listing: PMSListing;
  basePath: "properties-for-rent" | "properties-for-sale";
}

export function PMSListingCard({ listing, basePath }: PMSListingCardProps) {
  const t = useTranslations("pmsListingCard");
  const cover = getPMSCoverImage(listing);
  const href = `/${basePath}/${listing.slug}`;
  const priceLine = getPMSPrimaryPriceLine(
    listing,
    basePath === "properties-for-rent" ? "rent" : "sale",
    {
      yearly: t("rentPriceYearly"),
      midterm: t("rentPriceMidterm"),
      monthly: t("rentPriceMonthly"),
      perMonth: t("perMonth"),
    },
  );
  const location = [listing.subdistrict, listing.city, listing.state]
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      href={href}
      className="transition-all duration-300 group cursor-pointer hover:scale-[1.03] block h-full flex flex-col"
      data-testid={`pms-listing-card-${listing.id}`}
    >
      <div className="relative">
        <div className="aspect-square overflow-hidden rounded-2xl relative bg-[#0a0a0a]">
          <Image
            src={cover}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {listing.propertyType && (
            <div className="absolute top-3 left-3">
              <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-poppins font-medium uppercase tracking-wider px-2.5 py-1 rounded-full">
                {listing.propertyType}
              </span>
            </div>
          )}
          <PMSFavoriteButton
            listingId={listing.id}
            side={basePath === "properties-for-rent" ? "rent" : "sale"}
            snapshot={{ kind: "pms", listing }}
          />
        </div>
      </div>

      <div className="mt-3 flex-grow flex flex-col">
        {location && (
          <p className="text-[#aaa] text-[10px] font-poppins uppercase tracking-wide mb-1">
            {location}
          </p>
        )}

        <h3 className="text-white font-poppins font-bold text-[13px] leading-tight mb-1 line-clamp-2">
          {listing.title}
        </h3>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            {/* {priceLine?.label && (
              <span className="text-[#aaa] font-poppins text-[10px] uppercase tracking-wide">
                {priceLine.label}
              </span>
            )} */}
            {priceLine && (
              <span className="text-white font-poppins font-bold text-[13px]">
                {priceLine.amount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[#aaa]">
            {listing.bedrooms != null && (
              <div className="flex items-center gap-0.5">
                <Bed size={10} className="text-[#ffffff]" />
                <span className="font-poppins font-normal text-[12px]">
                  {listing.bedrooms}
                </span>
              </div>
            )}
            {listing.bathrooms != null && (
              <div className="flex items-center gap-0.5">
                <Bath size={10} className="text-[#ffffff]" />
                <span className="font-poppins text-[12px]">
                  {listing.bathrooms}
                </span>
              </div>
            )}
            {listing.areaSqm != null && (
              <div className="flex items-center gap-0.5">
                <Maximize2 size={10} className="text-[#ffffff]" />
                <span className="font-poppins text-[12px]">
                  {listing.areaSqm}
                  {t("areaUnit")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
