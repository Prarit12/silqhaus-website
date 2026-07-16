"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { PMSFavoriteButton } from "@/components/pms-favorite-button";
import {
  ArrowLeft,
  Bed,
  Bath,
  Maximize2,
  Square,
  Calendar,
  Car,
  CircleCheck,
  Send,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { PMSListing } from "@/lib/silqhaus-pms/listings";
import { getPMSPriceLines, getPMSGalleryImages } from "@/lib/api/silqhaus-pms";
import { GalleryCarousel } from "@/components/gallery-carousel";
import Lightbox from "@/components/lightbox";
import FullScreenGallery from "@/components/full-screen-gallery";
import { PMSListingCard } from "@/components/pms-listing-card";
import { PMSPropertyInquiry } from "@/components/pms-property-inquiry";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

const PropertyMap = dynamic(() => import("./property-map"), { ssr: false });

interface PMSPropertyDetailProps {
  listing: PMSListing;
  basePath: "properties-for-rent" | "properties-for-sale";
  similarListings?: PMSListing[];
}

export function PMSPropertyDetail({
  listing,
  basePath,
  similarListings = [],
}: PMSPropertyDetailProps) {
  const t = useTranslations("pmsPropertyDetail");
  const tList = useTranslations(
    basePath === "properties-for-rent"
      ? "propertiesForRent"
      : "propertiesForSale",
  );
  const tInq = useTranslations("pmsPropertyInquiry.drawer");
  const images = getPMSGalleryImages(listing);
  const priceLines = getPMSPriceLines(
    listing,
    basePath === "properties-for-rent" ? "rent" : "sale",
    {
      yearly: t("rentPriceYearly"),
      midterm: t("rentPriceMidterm"),
      monthly: t("rentPriceMonthly"),
      perMonth: t("perMonth"),
    },
  );
  const location = [listing.city, listing.state, listing.country]
    .filter(Boolean)
    .join(", ");

  const galleryPhotos = images.map((url) => ({ url, caption: undefined }));
  const lightboxImages = images.map((url) => ({
    src: url,
    alt: listing.title,
  }));

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);
  const [fullGalleryOpen, setFullGalleryOpen] = useState(false);
  const [inquiryDrawerOpen, setInquiryDrawerOpen] = useState(false);
  const [isMobileInquiry, setIsMobileInquiry] = useState(false);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const drawerBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobileInquiry(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const handleInquiryDrawerChange = (open: boolean) => {
    setInquiryDrawerOpen(open);
    if (!open) {
      window.setTimeout(() => ctaButtonRef.current?.focus(), 0);
    }
  };

  useEffect(() => {
    if (!inquiryDrawerOpen) return;
    const id = window.setTimeout(() => {
      const root = drawerBodyRef.current;
      if (!root) return;
      const target = root.querySelector<HTMLElement>(
        "input:not([type='hidden']):not([disabled]), textarea:not([disabled]), select:not([disabled])",
      );
      target?.focus();
    }, 50);
    return () => window.clearTimeout(id);
  }, [inquiryDrawerOpen]);

  const ctaPrice = priceLines[0];

  const facts: Array<{ icon: LucideIcon; label: string; show: boolean }> = [
    {
      icon: Bed,
      label: t("bedrooms", { count: listing.bedrooms ?? 0 }),
      show: listing.bedrooms != null,
    },
    {
      icon: Bath,
      label: t("bathrooms", { count: listing.bathrooms ?? 0 }),
      show: listing.bathrooms != null,
    },
    {
      icon: Maximize2,
      label: t("areaSqm", { count: listing.areaSqm ?? 0 }),
      show: listing.areaSqm != null,
    },
    {
      icon: Square,
      label: t("lotSizeSqm", { count: listing.lotSizeSqm ?? 0 }),
      show: listing.lotSizeSqm != null,
    },
    {
      icon: Calendar,
      label: t("yearBuilt", { year: listing.yearBuilt ?? 0 }),
      show: listing.yearBuilt != null,
    },
    {
      icon: Car,
      label: t("parkingSpaces", { count: listing.parkingSpaces ?? 0 }),
      show: listing.parkingSpaces != null,
    },
  ];

  return (
    <div
      className={`min-h-screen bg-[#000000] pb-24 ${
        fullGalleryOpen ? "pointer-events-none" : ""
      }`}
    >
      <section className="pt-32 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/${basePath}`}
            className="inline-flex items-center gap-2 text-mist hover:text-gold font-poppins text-sm transition-colors"
            data-testid="link-back-to-list"
          >
            <ArrowLeft size={16} /> {tList("backToList")}
          </Link>
        </div>
      </section>

      {/* Header (title + address only) */}
      <section className="pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {listing.propertyType && (
            <span className="inline-block bg-[#7e6725]/20 text-[#bf9b3a] text-[11px] font-poppins font-medium uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              {listing.propertyType}
            </span>
          )}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h1 className="text-3xl md:text-5xl font-gilroy font-bold text-white tracking-wide">
              {listing.title}
            </h1>
            <PMSFavoriteButton
              listingId={listing.id}
              side={basePath === "properties-for-rent" ? "rent" : "sale"}
              snapshot={{ kind: "pms", listing }}
              variant="detail"
            />
          </div>
          {location && (
            <p className="mt-2 text-mist font-poppins text-sm md:text-base">
              {location}
            </p>
          )}
        </div>
      </section>

      {/* Gallery */}
      {images.length > 0 && (
        <section className="pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <GalleryCarousel
              photos={galleryPhotos}
              propertyTitle={listing.title}
              onImageClick={(index) => {
                setLightboxStartIndex(index);
                setLightboxOpen(true);
              }}
              onViewAll={() => setFullGalleryOpen(true)}
            />
          </div>
        </section>
      )}

      {/* Body grid: content on left, sticky inquiry on right */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-8">
          <div className="min-w-0">
            {/* Price + quick facts summary */}
            {(priceLines.length > 0 || facts.some((f) => f.show)) && (
              <section className="pb-12">
                {priceLines.length > 0 && (
                  <div className="mb-6">
                    {priceLines.every((l) => !l.label) ? (
                      <div
                        className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3"
                        data-testid={`price-line-${priceLines[0].tier}`}
                      >
                        <span className="text-4xl md:text-5xl font-poppins font-bold text-white tracking-tight">
                          {priceLines[0].amount}
                        </span>
                        {priceLines[0].label && (
                          <span className="mt-1 sm:mt-0 text-mist font-poppins text-xs md:text-sm uppercase tracking-wider">
                            {priceLines[0].label}
                          </span>
                        )}
                      </div>
                    ) : (
                      // <div className="bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-line rounded-2xl p-5 md:p-6 max-w-2xl">
                      //   <h3 className="text-[11px] font-poppins font-medium uppercase tracking-[0.18em] text-[#bf9b3a] mb-4">
                      //     {t("rentalRatesHeading")}
                      //   </h3>
                      //   <ul className="divide-y divide-line/60">
                      //     {priceLines.map((line) => (
                      //       <li
                      //         key={line.tier}
                      //         data-testid={`price-line-${line.tier}`}
                      //         className="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:pb-0"
                      //       >
                      //         <span className="text-mist font-poppins text-xs md:text-sm uppercase tracking-wider">
                      //           {line.label}
                      //         </span>
                      //         <span className="text-xl md:text-2xl font-poppins font-bold text-white tracking-tight text-right">
                      //           {line.amount}
                      //         </span>
                      //       </li>
                      //     ))}
                      //   </ul>
                      // </div>

                      <div className="">
                        <h3 className="font-bold text-white mb-4 font-gilroy text-2xl uppercase tracking-wide">
                          {t("rentalRatesHeading")}
                        </h3>
                        {/* For md screens and up */}
                        <div className="hidden lg:flex  lg:flex-row gap-4">
                          {priceLines.map((line, i) => (
                            <div
                              key={line.tier}
                              data-testid={`price-line-${line.tier}`}
                              className="flex flex-col justify-between gap-4 bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-line rounded-2xl p-5 md:p-6 flex-1"
                            >
                              <p className="text-xl md:text-2xl font-poppins font-bold text-white uppercase tracking-wider">
                                {i === 0
                                  ? line.label?.slice(0, "yearly ".length)
                                  : i === 1
                                    ? line.label?.slice(0, "midtem ".length)
                                    : line.label?.slice(0, "monthly ".length)}
                                <br />
                                <span className="text-mist font-poppins text-xs md:text-sm uppercase font-normal tracking-tight">
                                  {i === 0
                                    ? line.label?.slice("yearly ".length, 100)
                                    : i === 1
                                      ? line.label?.slice("midtem ".length, 100)
                                      : line.label?.slice(
                                          "monthly ".length,
                                          100,
                                        )}
                                </span>
                              </p>
                              <p className="text-xl md:text-2xl font-poppins font-bold text-white tracking-tight">
                                {line.amount}
                              </p>
                            </div>
                          ))}
                        </div>
                        {/* For smaller screens than md */}
                        <div>
                          <div className="flex flex-col lg:hidden justify-between gap-4 bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-line rounded-2xl px-5 md:px-6 flex-1">
                            {priceLines.map((line, i) => (
                              <div
                                key={line.tier}
                                data-testid={`price-line-${line.tier}`}
                                className="flex justify-between border-t border-mist/20 first:border-t-0 pt-3 last:pb-3"
                              >
                                <div>
                                  <p className="text-xl md:text-2xl font-poppins font-bold text-white uppercase tracking-wider">
                                    {i === 0
                                      ? line.label?.slice(0, "yearly ".length)
                                      : i === 1
                                        ? line.label?.slice(0, "midtem ".length)
                                        : line.label?.slice(
                                            0,
                                            "monthly ".length,
                                          )}
                                    <br />
                                    <span className="text-mist font-poppins text-xs md:text-sm uppercase font-normal tracking-tight">
                                      {i === 0
                                        ? line.label?.slice(
                                            "yearly ".length,
                                            100,
                                          )
                                        : i === 1
                                          ? line.label?.slice(
                                              "midtem ".length,
                                              100,
                                            )
                                          : line.label?.slice(
                                              "monthly ".length,
                                              100,
                                            )}
                                    </span>
                                  </p>
                                </div>
                                <p className="text-xl md:text-2xl font-poppins font-bold text-white tracking-tight">
                                  {line.amount}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {facts.some((f) => f.show) && (
                  <div className="flex flex-wrap gap-3">
                    {facts
                      .filter((f) => f.show)
                      .map((f, i) => {
                        const Icon = f.icon;
                        return (
                          <div
                            key={i}
                            className="flex items-center gap-2 bg-[#0a0a0a] border border-line rounded-full px-4 py-2"
                          >
                            <Icon size={16} className="text-[#8c7429]" />
                            <span className="font-poppins text-snow text-sm">
                              {f.label}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                )}
              </section>
            )}

            {/* About this property */}
            {listing.description && (
              <section className="pb-12">
                <h2 className="font-bold text-white mb-4 font-gilroy text-2xl">
                  {t("description")}
                </h2>
                <div className="text-white/90 leading-snug space-y-4 whitespace-pre-line font-poppins">
                  <p>{listing.description}</p>
                </div>
              </section>
            )}

            {/* Amenities & Features */}
            {listing.features && listing.features.length > 0 && (
              <section className="pb-12">
                <h2 className="text-[#e3e1d8] mb-8 font-gilroy text-2xl font-bold">
                  {t("features")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {listing.features.slice(0, 20).map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#6e5d41] rounded-lg flex items-center justify-center flex-shrink-0">
                        <CircleCheck
                          className="w-4 h-4 text-white"
                          strokeWidth={1.5}
                        />
                      </div>
                      <span className="font-poppins text-white text-sm font-medium">
                        {f}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Map */}
            {listing.latitude != null && listing.longitude != null && (
              <section className="pb-12">
                <h2 className="text-2xl font-gilroy font-bold text-white tracking-wide mb-4">
                  {t("location")}
                </h2>
                <div className="h-[360px] w-full overflow-hidden rounded-2xl border border-line">
                  <PropertyMap
                    lat={listing.latitude}
                    lng={listing.longitude}
                    propertyName={listing.title}
                    className="h-full w-full"
                    showHeading={false}
                  />
                </div>
              </section>
            )}

            {/* Similar listings */}
            {similarListings.length > 0 && (
              <section className="pb-12">
                <h2 className="text-xl md:text-2xl font-gilroy font-semibold text-white tracking-wide mb-6">
                  {t("similarListings")}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {similarListings.map((s) => {
                    const supportsCurrent =
                      basePath === "properties-for-rent"
                        ? s.listingType?.includes("RENT")
                        : s.listingType?.includes("SALE");
                    const targetBase:
                      | "properties-for-rent"
                      | "properties-for-sale" = supportsCurrent
                      ? basePath
                      : s.listingType?.includes("SALE")
                        ? "properties-for-sale"
                        : "properties-for-rent";
                    return (
                      <PMSListingCard
                        key={s.id}
                        listing={s}
                        basePath={targetBase}
                      />
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Inquiry — desktop. Form mount is JS-gated to avoid duplicate IDs with the mobile drawer. */}
          <aside className="hidden min-[769px]:block lg:sticky lg:top-6 lg:h-fit">
            {!isMobileInquiry && (
              <PMSPropertyInquiry listing={listing} basePath={basePath} />
            )}
          </aside>
        </div>
      </div>

      {/* Inquiry — mobile (≤ iPad Mini portrait): bottom CTA + slide-up drawer. */}
      <div className="min-[769px]:hidden">
        {isMobileInquiry && (
          <>
            <div
              className="fixed inset-x-0 bottom-0 z-40 bg-[#000000] border-t border-[#7e6725]"
              data-testid="mobile-inquiry-cta-bar"
            >
              {/* {ctaPrice && (
                <div className="px-4 py-3">
                  <span className="block text-sm font-poppins font-bold text-white tracking-tight truncate">
                    {ctaPrice.amount}
                  </span>
                  {ctaPrice.label && (
                    <span className="block text-[10px] font-poppins uppercase tracking-wider text-gray-400 truncate">
                      {ctaPrice.label}
                    </span>
                  )}
                </div>
              )} */}
              <Button
                ref={ctaButtonRef}
                type="button"
                onClick={() => setInquiryDrawerOpen(true)}
                className="w-full h-auto rounded-none bg-[#7e6725] hover:bg-[#8c7429] text-white font-poppins font-medium text-[14px] uppercase tracking-wide py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex items-center justify-center gap-2 shadow-lg"
                data-testid="mobile-inquiry-cta"
              >
                <Send className="w-4 h-4" />
                {tInq("cta")}
              </Button>
            </div>

            <Drawer
              open={inquiryDrawerOpen}
              onOpenChange={handleInquiryDrawerChange}
            >
              <DrawerContent
                className="bg-[#0a0a0a] border-white/10 max-h-[92vh]"
                data-testid="mobile-inquiry-drawer"
              >
                <div className="flex items-center justify-between px-5 pt-3 pb-2">
                  <DrawerTitle className="font-gilroy text-white text-lg">
                    {/* {tInq("title")} */}
                  </DrawerTitle>
                  <DrawerClose asChild>
                    <button
                      type="button"
                      aria-label={tInq("close")}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                      data-testid="mobile-inquiry-drawer-close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </DrawerClose>
                </div>
                <div
                  ref={drawerBodyRef}
                  className="overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]"
                >
                  {inquiryDrawerOpen && (
                    <PMSPropertyInquiry listing={listing} basePath={basePath} />
                  )}
                </div>
              </DrawerContent>
            </Drawer>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          startIndex={lightboxStartIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          propertyName={listing.title}
        />
      )}

      {/* Full screen gallery */}
      {fullGalleryOpen && (
        <FullScreenGallery
          images={lightboxImages}
          isOpen={fullGalleryOpen}
          onClose={() => setFullGalleryOpen(false)}
          onImageClick={(index) => {
            setFullGalleryOpen(false);
            setLightboxStartIndex(index);
            setLightboxOpen(true);
          }}
          propertyName={listing.title}
        />
      )}
    </div>
  );
}
