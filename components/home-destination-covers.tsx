"use client";

import { useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export interface DestinationCover {
  key: string;
  img: string;
  name: string;
  /** "8 homes" / "Homes coming soon" — translated server-side. */
  sub: string;
}

/**
 * The six region covers as an auto-turning embla loop — three big cards per
 * view on desktop, one-and-a-peek on mobile. Pauses on hover and for
 * reduced-motion users; every cover stays a crawlable /destination link.
 */
export default function HomeDestinationCovers({
  covers,
  prevLabel,
  nextLabel,
}: {
  covers: DestinationCover[];
  prevLabel: string;
  nextLabel: string;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
      slidesToScroll: 1,
    },
    [
      Autoplay({
        delay: 4000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );

  useEffect(() => {
    if (!emblaApi) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      emblaApi.plugins().autoplay?.stop();
    }
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {covers.map((cover) => (
            <div
              key={cover.key}
              className="shrink-0 pl-4 basis-[80%] sm:basis-1/2 lg:basis-1/3"
            >
              <Link
                href={`/destination/${cover.key}`}
                className="group relative block aspect-[4/5] rounded-2xl overflow-hidden ring-1 ring-line transition-all duration-500 hover:ring-white/30"
              >
                <Image
                  src={cover.img}
                  alt={cover.name}
                  fill
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 400px"
                  quality={80}
                  className="object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-105"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="text-white text-xl sm:text-2xl font-semibold tracking-tight">
                    {cover.name}
                  </p>
                  <p className="mt-1 text-[13px] sm:text-sm font-medium text-white/70">
                    {cover.sub}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => emblaApi?.scrollPrev()}
        aria-label={prevLabel}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-9 h-9 rounded-full bg-white/90 text-ink shadow-md hover:bg-white hover:scale-105 transition-all"
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => emblaApi?.scrollNext()}
        aria-label={nextLabel}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-9 h-9 rounded-full bg-white/90 text-ink shadow-md hover:bg-white hover:scale-105 transition-all"
      >
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}
