"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Grid3x3 } from "lucide-react";
import { useTranslations } from "next-intl";
import ImageWithFallback from "@/components/ImageWithFallback";

interface GalleryImage {
  src: string;
  alt: string;
  category?: string;
}

interface FullScreenGalleryProps {
  images: GalleryImage[];
  isOpen: boolean;
  onClose: () => void;
  onImageClick: (index: number) => void;
  propertyName: string;
}

export default function FullScreenGallery({
  images,
  isOpen,
  onClose,
  onImageClick,
  propertyName,
}: FullScreenGalleryProps) {
  const t = useTranslations("gallery");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableElementRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Get unique categories from images
  const categories = Array.from(
    new Set(images.map((img) => img.category).filter(Boolean)),
  );

  // Filter images based on selected category
  const filteredImages = selectedCategory
    ? images.filter((img) => img.category === selectedCategory)
    : images;

  // Focus trap setup
  useEffect(() => {
    if (isOpen && firstFocusableElementRef.current) {
      firstFocusableElementRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Lazy loading intersection observer
  useEffect(() => {
    if (!isOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute("data-index") || "0",
            );
            setLoadedImages(
              (prev) => new Set(Array.from(prev).concat([index])),
            );
          }
        });
      },
      {
        rootMargin: "50px",
      },
    );

    // Observe all image containers
    const imageElements = gridRef.current?.querySelectorAll("[data-index]");
    imageElements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [isOpen, filteredImages.length]);

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  // Focus trap handler
  const handleTabKey = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (!focusableElements?.length) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col pointer-events-auto"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="flex flex-col h-full"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        onKeyDown={handleTabKey}
      >
        {/* Header */}
        <header className="flex items-center justify-between p-4 md:p-6 bg-[#e3e1d8] text-[#6e5d41]">
          <div className="flex items-center gap-3">
            <Grid3x3 className="w-6 h-6" />
            <div>
              <h1
                id="gallery-title"
                className="text-xl md:text-2xl font-bold font-gilroy"
              >
                {t("title")}
              </h1>
              <p
                id="gallery-description"
                className="text-sm font-poppins opacity-80"
              >
                {propertyName} - {t("photos", { count: filteredImages.length })}
              </p>
            </div>
          </div>

          <button
            ref={firstFocusableElementRef}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#6e5d41] text-[#e3e1d8] hover:bg-[#5a4d35] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6e5d41] focus:ring-offset-2 focus:ring-offset-[#e3e1d8]"
            aria-label={t("closeGallery")}
            data-testid="button-close-gallery"
          >
            <X size={24} />
          </button>
        </header>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="px-4 md:px-6 py-3 bg-[#e3e1d8] border-t border-[#6e5d41]/20">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-full text-sm font-poppins transition-colors focus:outline-none focus:ring-2 focus:ring-[#6e5d41] ${
                  selectedCategory === null
                    ? "bg-[#6e5d41] text-[#e3e1d8]"
                    : "bg-white text-[#6e5d41] hover:bg-[#6e5d41]/10"
                }`}
                data-testid="filter-all"
              >
                {t("all", { count: images.length })}
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category || null)}
                  className={`px-3 py-1.5 rounded-full text-sm font-poppins transition-colors focus:outline-none focus:ring-2 focus:ring-[#6e5d41] capitalize ${
                    selectedCategory === category
                      ? "bg-[#6e5d41] text-[#e3e1d8]"
                      : "bg-white text-[#6e5d41] hover:bg-[#6e5d41]/10"
                  }`}
                  data-testid={`filter-${category}`}
                >
                  {category} (
                  {images.filter((img) => img.category === category).length})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6" ref={gridRef}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 max-w-site mx-auto">
            {filteredImages.map((image, index) => {
              const originalIndex = images.findIndex(
                (img) => img.src === image.src,
              );
              const isLoaded = loadedImages.has(index);

              return (
                <div
                  key={`${image.src}-${index}`}
                  data-index={index}
                  className="aspect-square relative group cursor-pointer overflow-hidden rounded-lg bg-gray-800"
                  onClick={() => onImageClick(originalIndex)}
                  role="button"
                  tabIndex={0}
                  aria-label={t("viewInLightbox", { name: image.alt })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onImageClick(originalIndex);
                    }
                  }}
                  data-testid={`gallery-thumbnail-${index}`}
                >
                  {/* Loading placeholder */}
                  {!isLoaded && (
                    <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-[#e3e1d8] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}

                  {/* Lazy loaded image */}
                  <ImageWithFallback
                    src={image.src}
                    alt={image.alt}
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                      isLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    loading="lazy"
                    onLoad={() =>
                      setLoadedImages(
                        (prev) => new Set(Array.from(prev).concat([index])),
                      )
                    }
                    onError={() =>
                      setLoadedImages(
                        (prev) => new Set(Array.from(prev).concat([index])),
                      )
                    }
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 bg-[#e3e1d8] rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-[#6e5d41]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm5 3a2 2 0 11-4 0 2 2 0 014 0zm7.707 3.293a1 1 0 00-1.414-1.414L11 12.172l-1.293-1.293a1 1 0 00-1.414 1.414L10.586 14.5 8.293 16.793a1 1 0 001.414 1.414L12 15.914l2.293 2.293a1 1 0 001.414-1.414L13.414 14.5l2.293-2.207z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Category badge */}
                  {image.category && (
                    <div className="absolute top-2 left-2 bg-[#6e5d41] text-[#e3e1d8] text-xs px-2 py-1 rounded-full font-poppins capitalize opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {image.category}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredImages.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center text-[#e3e1d8]">
                <Grid3x3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-poppins">{t("noImages")}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="p-4 md:p-6 bg-[#e3e1d8] text-[#6e5d41] border-t border-[#6e5d41]/20">
          <div className="flex items-center justify-between max-w-site mx-auto">
            <p className="text-sm font-poppins">{t("clickToOpen")}</p>
            <div className="text-xs font-poppins opacity-75">
              {t("countOf", {
                current: filteredImages.length,
                total: images.length,
              })}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
