"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

const OWNERS = [
  { key: "t1", img: "/property-management/owners/1.jpg" },
  { key: "t2", img: "/property-management/owners/2.jpg" },
  { key: "t3", img: "/property-management/owners/3.jpg" },
  { key: "t4", img: "/property-management/owners/4.jpg" },
  { key: "t5", img: "/property-management/owners/5.jpg" },
] as const;

export default function PmTestimonials() {
  const t = useTranslations("propertyManagement.testimonials");
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const gap = 20;
    const step = (card?.offsetWidth ?? 340) + gap;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const x = track.scrollLeft;
    const eps = 8;
    // Loop around at either end so the carousel feels circular.
    const target =
      dir === 1
        ? x >= maxScroll - eps
          ? 0
          : Math.min(x + step, maxScroll)
        : x <= eps
          ? maxScroll
          : Math.max(x - step, 0);
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    track.scrollTo({
      left: target,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <section className="bg-ink py-24 sm:py-28 border-t border-line">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <span className="eyebrow mb-5">{t("subtitle")}</span>
            <h2 className="font-display text-white text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] tracking-tight normal-case text-balance mt-5">
              {t("title")}
            </h2>
            <p className="text-white/60 mt-5 text-lg leading-relaxed">
              {t("description")}
            </p>
          </div>
          {/* Carousel controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label={t("prev")}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-white/70 transition-colors hover:border-white/40 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label={t("next")}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-white/70 transition-colors hover:border-white/40 hover:text-white"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
        {/* Track — three cards per view on desktop, looping via the arrows */}
        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {OWNERS.map((o) => (
            <figure
              key={o.key}
              data-card
              className="relative w-full sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)] shrink-0 snap-start aspect-[4/5] rounded-2xl overflow-hidden ring-1 ring-line"
            >
            <Image
              src={o.img}
              alt={t(`items.${o.key}.name`)}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center"
            />
            {/* Scrim keeps the quote legible over the portrait */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5"
              aria-hidden="true"
            />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <blockquote className="text-white font-semibold text-[16px] sm:text-[17px] leading-snug text-balance">
                &ldquo;{t(`items.${o.key}.quote`)}&rdquo;
              </blockquote>
              <div className="mt-4 pt-4 border-t border-white/20 flex items-end justify-between gap-4">
                <span>
                  <span className="block text-white font-semibold text-sm">
                    {t(`items.${o.key}.name`)}
                  </span>
                  <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-white/60 mt-1">
                    {t(`items.${o.key}.location`)}
                  </span>
                </span>
                <span className="text-white/75 text-sm font-medium text-right">
                  {t(`items.${o.key}.property`)}
                </span>
              </div>
            </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
