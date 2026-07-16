"use client";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import pattaya from "@/assets/destination-carousel/pattaya.webp";
import phuket from "@/assets/destination-carousel/phuket.webp";

const THAILAND_DESTINATIONS = [
  {
    id: "phuket",
    province: "Phuket",
    region: "Andaman",
    slug: "phuket",
    image: phuket,
    alt: "Aerial view of a luxury villa with infinity pool overlooking turquoise waters and limestone islands in Phuket",
  },
  {
    id: "pattaya",
    province: "Pattaya",
    region: "Eastern",
    slug: "pattaya",
    image: pattaya,
    alt: "Dynamic coastal cityscape of Pattaya with high-rise buildings, beach promenade and busy waterfront activities",
  },
];

interface DestinationCarouselProps {
  className?: string;
}

const DestinationCarousel = ({ className = "" }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();

  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const getItemsPerPage = () => {
      if (window.innerWidth >= 1280) return 5;
      if (window.innerWidth >= 1024) return 4;
      if (window.innerWidth >= 768) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    };

    const handleResize = () => {
      const newItemsPerPage = getItemsPerPage();
      setItemsPerPage(newItemsPerPage);
      const newTotalPages = Math.ceil(
        THAILAND_DESTINATIONS.length / newItemsPerPage,
      );
      setCurrentPage((prev) => (prev >= newTotalPages ? 0 : prev));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(THAILAND_DESTINATIONS.length / itemsPerPage);

  const handleCardClick = (destination: (typeof THAILAND_DESTINATIONS)[0]) => {
    router.push(`/destination/${encodeURIComponent(destination.slug)}`);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    destination: (typeof THAILAND_DESTINATIONS)[0],
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick(destination);
    }
  };

  const handlePageNavigation = (direction: "prev" | "next") => {
    if (direction === "prev" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  const getCurrentPageItems = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return THAILAND_DESTINATIONS.slice(startIndex, endIndex);
  };

  const canGoLeft = currentPage > 0;
  const canGoRight = currentPage < totalPages - 1;

  return (
    <section className="min-h-[60vh] sm:min-h-[65vh] md:min-h-[68vh] lg:min-h-[70vh] py-8 sm:py-10 md:py-12 bg-[#000000] relative flex items-center mt-60 sm:mt-0">
      <div className="w-full">
        {/* Section Header */}
        <div className="text-left mb-6 sm:mb-8 md:mb-10 relative z-20">
          <div className="pl-4 sm:pl-6 lg:pl-8">
            <h2 className="text-white mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-wide font-gilroy font-medium">
              Most Popular Stay in Thailand
            </h2>
          </div>
        </div>
        {/* Horizontal Scrollable Container with Arrow Navigation */}
        <div className="px-4 sm:px-6 lg:px-8 relative group">
          {/* Arrow Navigation Buttons */}
          <button
            onClick={() => handlePageNavigation("prev")}
            disabled={!canGoLeft}
            className="absolute -left-1 sm:-left-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/90 hover:bg-[#ffffff] disabled:opacity-30 disabled:cursor-not-allowed text-black hover:text-white rounded-full shadow-lg border border-white/20 sm:border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ffffff] focus:ring-offset-2"
            aria-label="Previous page"
            data-testid="button-prev-page"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mx-auto" />
          </button>

          <button
            onClick={() => handlePageNavigation("next")}
            disabled={!canGoRight}
            className="absolute -right-1 sm:-right-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/90 hover:bg-[#ffffff] disabled:opacity-30 disabled:cursor-not-allowed text-black hover:text-white rounded-full shadow-lg border border-white/20 sm:border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ffffff] focus:ring-offset-2"
            aria-label="Next page"
            data-testid="button-next-page"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mx-auto" />
          </button>

          {/* Paginated Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 py-2">
            {getCurrentPageItems().map((destination, index) => (
              <Link
                href={`/destination/${encodeURIComponent(destination.slug)}`}
                key={destination.id}
                className="w-full aspect-[4/5] relative rounded-lg shadow border border-black/10 overflow-hidden cursor-pointer group/card transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                onKeyDown={(e) => handleKeyDown(e, destination)}
                tabIndex={0}
                role="button"
                aria-label={`Visit ${destination.province} today!`}
                data-testid={`destination-card-${destination.id}`}
              >
                {/* Background Image */}
                <Image
                  src={destination.image}
                  alt={destination.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  quality={80}
                  className="object-cover object-center rounded-lg transition-transform duration-500 group-hover/card:scale-105"
                  loading={index === 0 ? "eager" : "lazy"}
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover/card:from-black/80 group-hover/card:via-black/40 transition-colors duration-300 rounded-lg"></div>

                {/* Text Content */}
                <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 right-2 sm:right-3 md:right-4 text-white drop-shadow-lg">
                  <p className="text-[10px] sm:text-xs md:text-sm text-white/90 font-poppins mb-0.5 sm:mb-1 uppercase tracking-wider">
                    {destination.region}
                  </p>
                  <h3
                    className="text-xs sm:text-sm md:text-base font-bold font-poppins tracking-wide leading-tight"
                    data-testid={`text-destination-${destination.id}`}
                  >
                    {destination.province}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 sm:gap-3 md:gap-4 mt-6 sm:mt-8 md:mt-10 mb-4 sm:mb-6 relative z-20">
          {/* Previous Arrow */}
          <button
            onClick={() => handlePageNavigation("prev")}
            disabled={!canGoLeft}
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed text-white/60 hover:text-[#ffffff] hover:bg-white/10"
            aria-label="Previous page"
            data-testid="pagination-prev"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>

          {/* Page Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ffffff]/40 focus:ring-offset-2 focus:ring-offset-black ${
                  currentPage === index
                    ? "w-6 sm:w-8 md:w-10 h-2.5 sm:h-3 md:h-4 bg-[#ffffff] rounded-full shadow-lg shadow-[#ffffff]/30"
                    : "w-2.5 sm:w-3 md:w-4 h-2.5 sm:h-3 md:h-4 bg-white/30 hover:bg-white/50 rounded-full hover:scale-110"
                }`}
                aria-label={`Go to page ${index + 1}`}
                data-testid={`pagination-dot-${index}`}
              />
            ))}
          </div>

          {/* Next Arrow */}
          <button
            onClick={() => handlePageNavigation("next")}
            disabled={!canGoRight}
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed text-white/60 hover:text-[#ffffff] hover:bg-white/10"
            aria-label="Next page"
            data-testid="pagination-next"
          >
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default DestinationCarousel;
