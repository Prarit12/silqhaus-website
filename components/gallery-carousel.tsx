"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ImageIcon, Images } from "lucide-react";
import { useTranslations } from "next-intl";
import { SafeImg } from "./SafeImg";
import { Button } from "@/components/ui/button";

interface Photo {
  url: string;
  caption?: string;
}

interface GalleryCarouselProps {
  photos: Photo[];
  propertyTitle: string;
  onImageClick: (index: number) => void;
  onViewAll: () => void;
  /** "dark" (default) for the ink PMS page, "light" for white pages. */
  theme?: "dark" | "light";
}

const placeholderImages: Photo[] = [
  {
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  },
  {
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  {
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  },
  {
    url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
  },
  {
    url: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80",
  },
  {
    url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
  },
];

export function GalleryCarousel({
  photos,
  propertyTitle,
  onImageClick,
  onViewAll,
  theme = "dark",
}: GalleryCarouselProps) {
  const t = useTranslations("galleryCarousel");
  const light = theme === "light";
  const [currentSet, setCurrentSet] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // ✅ Responsive images per set (default to 5 for SSR, update on client)
  const [imagesPerSet, setImagesPerSet] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      setImagesPerSet(window.innerWidth < 768 ? 1 : 5);
    };

    // Set initial value on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Reset carousel when layout changes
  useEffect(() => {
    setCurrentSet(0);
  }, [imagesPerSet]);

  const displayPhotos = photos.length ? photos : placeholderImages;
  const isPlaceholder = photos.length === 0;

  const totalSets = Math.ceil(displayPhotos.length / imagesPerSet);
  const startIndex = currentSet * imagesPerSet;

  const currentPhotos = displayPhotos.slice(
    startIndex,
    startIndex + imagesPerSet,
  );

  const mainImage = currentPhotos[0];
  const secondaryImages = imagesPerSet > 1 ? currentPhotos.slice(1, 3) : [];
  const thirdImages = imagesPerSet > 3 ? currentPhotos.slice(3, 5) : [];

  // Prefetch: compute next set of photos
  const nextSet = currentSet < totalSets - 1 ? currentSet + 1 : 0;
  const nextStart = nextSet * imagesPerSet;
  const nextPhotos =
    totalSets > 1
      ? displayPhotos.slice(nextStart, nextStart + imagesPerSet)
      : [];

  const goToPrevious = () => {
    setCurrentSet((prev) => (prev > 0 ? prev - 1 : totalSets - 1));
  };

  const goToNext = () => {
    setCurrentSet((prev) => (prev < totalSets - 1 ? prev + 1 : 0));
  };

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (swipeDistance > minSwipeDistance) {
      goToNext();
    } else if (swipeDistance < -minSwipeDistance) {
      goToPrevious();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="relative">
      <div
        className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-2 rounded-xl overflow-hidden h-[400px] md:h-[500px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Column 1 */}
        <div
          className="relative cursor-pointer group h-full overflow-hidden"
          onClick={() => onImageClick(startIndex)}
        >
          {mainImage && (
            <>
              <SafeImg
                src={mainImage.url}
                alt={
                  mainImage.caption
                    ? `${propertyTitle} - ${mainImage.caption}`
                    : propertyTitle
                }
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

              {/* Mobile: Image counter and View All button overlay */}
              <div className="md:hidden absolute bottom-3 left-3 right-3 flex items-center justify-between">
                {/* Image counter */}
                <div className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                  {currentSet + 1} / {totalSets}
                </div>

                {/* View all photos button - mobile only */}
                {photos.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewAll();
                    }}
                    className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-black/80 transition-colors"
                  >
                    <Images className="w-3.5 h-3.5" />
                    {t("viewAll", { count: photos.length })}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Column 2 */}
        {imagesPerSet > 1 && (
          <div className="hidden md:grid grid-rows-[1fr_1fr] gap-2 h-full min-h-0">
            {secondaryImages.map((photo, index) => (
              <div
                key={index}
                className="relative cursor-pointer group h-full overflow-hidden"
                onClick={() => onImageClick(startIndex + index + 1)}
              >
                <SafeImg
                  src={photo.url}
                  alt={
                    photo.caption
                      ? `${propertyTitle} - ${photo.caption}`
                      : propertyTitle
                  }
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            ))}
          </div>
        )}

        {/* Column 3 */}
        {imagesPerSet > 3 && (
          <div className="hidden md:grid grid-rows-[1fr_1fr] gap-2 h-full min-h-0">
            {thirdImages.map((photo, index) => (
              <div
                key={index}
                className="relative cursor-pointer group h-full overflow-hidden"
                onClick={() => onImageClick(startIndex + index + 3)}
              >
                <SafeImg
                  src={photo.url}
                  alt={
                    photo.caption
                      ? `${propertyTitle} - ${photo.caption}`
                      : propertyTitle
                  }
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prefetch next set of images — off-screen for Next.js optimization pipeline */}
      {nextPhotos.length > 0 && (
        <div
          className="absolute w-px h-px overflow-hidden"
          style={{ left: "-9999px" }}
          aria-hidden="true"
        >
          {nextPhotos.map((photo, i) => (
            <SafeImg
              key={`prefetch-${nextStart + i}`}
              src={photo.url}
              alt=""
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ))}
        </div>
      )}

      {/* Navigation arrows */}
      {totalSets > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg z-10"
            aria-label={t("previousImages")}
          >
            <ChevronLeft className="w-5 h-5 text-black" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg z-10"
            aria-label={t("nextImages")}
          >
            <ChevronRight className="w-5 h-5 text-black" />
          </button>
        </>
      )}

      {/* Footer - Hidden on mobile phones, visible on tablets and larger */}
      <div className="hidden md:flex flex-col gap-4 md:gap-0 md:flex-row mt-4">
        {totalSets > 1 && (
          <div className="flex gap-2">
            {Array.from({ length: totalSets }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSet(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentSet
                    ? light
                      ? "bg-ink"
                      : "bg-[var(--cocoa)]"
                    : light
                      ? "bg-neutral-300 hover:bg-neutral-400"
                      : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {photos.length > 3 && (
          <Button
            onClick={onViewAll}
            variant="outline"
            size="sm"
            className={
              light
                ? "border-neutral-300 bg-white text-ink hover:bg-neutral-100 hover:text-ink ml-auto"
                : "border-white/30 text-white hover:bg-white/10 ml-auto"
            }
          >
            {t("viewAllPhotos", { count: photos.length })}
          </Button>
        )}

        {isPlaceholder && (
          <div
            className={`flex items-center gap-2 text-sm ml-auto ${
              light ? "text-neutral-500" : "text-white/50"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>{t("sampleImages")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
