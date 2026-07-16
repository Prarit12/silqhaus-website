"use client";

import React, { useEffect, useCallback, useState, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import ImageWithFallback from "@/components/ImageWithFallback";

interface LightboxImage {
  src: string;
  alt: string;
}

interface LightboxProps {
  images: LightboxImage[];
  startIndex: number;
  isOpen: boolean;
  onClose: () => void;
  propertyName?: string;
}

export default function Lightbox({
  images,
  startIndex,
  isOpen,
  onClose,
  propertyName,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isLoading, setIsLoading] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("lightbox");

  // Update index when startIndex changes and set loading
  useEffect(() => {
    setCurrentIndex(startIndex);
    setIsLoading(true);
  }, [startIndex]);

  // Update loading state when current index changes
  // useEffect(() => {
  //   setIsLoading(true);
  // }, [currentIndex]);

  // Preload adjacent images for better performance
  useEffect(() => {
    if (!isOpen) return;

    const preloadImages = () => {
      const indicesToPreload = [
        currentIndex - 1 >= 0 ? currentIndex - 1 : images.length - 1,
        currentIndex + 1 < images.length ? currentIndex + 1 : 0,
      ];

      indicesToPreload.forEach((index) => {
        const img = new Image();
        img.src = images[index]?.src;
      });
    };

    preloadImages();
  }, [currentIndex, images, isOpen]);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    setIsLoading(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  }, [images.length]);

  const goToNext = useCallback(() => {
    setIsLoading(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          e.preventDefault();
          goToPrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          goToNext();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, goToPrevious, goToNext]);

  // Touch/swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  // Focus management and trap
  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Focus the close button initially
      setTimeout(() => {
        const closeButton = document.querySelector(
          '[data-testid="button-close-lightbox"]',
        ) as HTMLElement;
        if (closeButton) {
          closeButton.focus();
        }
      }, 50);
    } else {
      // Restore focus when closing
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }
  }, [isOpen]);

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusableElements = lightboxRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

  if (!isOpen || !images.length) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      ref={lightboxRef}
      className="fixed inset-0 z-50 bg-[#000] flex items-center justify-center font-poppins"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label={t("ariaLabel")}
    >
      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 z-60 p-2 text-white hover:text-[#e3e1d8] transition-colors duration-200 bg-[#6e5d41]/80 rounded-full backdrop-blur-sm"
        aria-label={t("closeLightbox")}
        data-testid="button-close-lightbox"
      >
        <X size={24} />
      </button>

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrevious();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-60 p-3 text-white hover:text-[#e3e1d8] transition-colors duration-200 bg-[#6e5d41]/80 rounded-full backdrop-blur-sm"
          aria-label={t("previousImage")}
          data-testid="button-previous-image"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-60 p-3 text-white hover:text-[#e3e1d8] transition-colors duration-200 bg-[#6e5d41]/80 rounded-full backdrop-blur-sm"
          aria-label={t("nextImage")}
          data-testid="button-next-image"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Image Container */}
      <div
        className="max-w-[92vw] max-h-[88vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Image */}
        <div className="relative flex items-center justify-center">
          <ImageWithFallback
            key={currentImage.src}
            src={currentImage.src}
            alt={currentImage.alt}
            fill={false}
            width={1200}
            height={800}
            sizes="92vw"
            className="max-w-full max-h-[80vh] w-auto h-auto object-contain"
            onLoad={() => setIsLoading(false)}
          />

          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="mt-4 text-center px-4">
          <p className="text-white text-lg font-medium">{currentImage.alt}</p>
          {images.length > 1 && (
            <p className="text-white/70 text-sm mt-1">
              {t("imageCounter", {
                current: currentIndex + 1,
                total: images.length,
              })}
            </p>
          )}
        </div>
      </div>

      {/* Image Thumbnails (optional, for larger galleries) */}
      {images.length > 1 && images.length <= 10 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-[#e3e1d8] scale-110"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={t("goToImage", { index: index + 1 })}
              data-testid={`button-thumbnail-${index}`}
            />
          ))}
        </div>
      )}

      {/* Keyboard hints (desktop only) */}
      <div className="absolute bottom-4 left-4 text-white/50 text-xs hidden md:block">
        <div>{t("navigateHint")}</div>
        <div>{t("escHint")}</div>
      </div>
    </div>
  );
}
