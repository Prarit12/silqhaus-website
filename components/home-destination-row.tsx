"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PropertyCard, type FromQuote } from "@/components/property-card";
import type { DestinationListing } from "@/lib/destinations";

/**
 * One region's block — heading link, homes count, pager arrows, and the
 * swipeable card row with the same PropertyCard treatment as "Homes our
 * guests love". Data arrives server-fetched so every link is in the SSR
 * HTML, and the ["home-pricing"] query is shared with GuestFavorites so
 * both sections ride one fetch. The arrows live in the header (not over
 * the cards, where they'd collide with each card's own photo arrows) and
 * only render when the row actually overflows; mobile swipes instead.
 */
export default function HomeDestinationRow({
  homes,
  href,
  title,
  countLabel,
  prevLabel,
  nextLabel,
}: {
  homes: DestinationListing[];
  href: string;
  title: string;
  countLabel: string;
  prevLabel: string;
  nextLabel: string;
}) {
  // PropertyCard reads its own labels (price, availability) from ourProperty.
  const t = useTranslations("ourProperty");

  const pricingQuery = useQuery<Record<string, FromQuote>>({
    queryKey: ["home-pricing"],
    queryFn: async () => {
      const res = await fetch("/api/home-pricing");
      if (!res.ok) throw new Error("Failed to fetch pricing");
      return res.json();
    },
    staleTime: 60 * 60 * 1000,
  });

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [overflows, setOverflows] = useState(false);

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 2);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    setOverflows(el.scrollWidth > el.clientWidth + 2);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const page = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  const pagerBtnCls =
    "grid place-items-center w-8 h-8 rounded-full border border-neutral-300 text-ink transition-colors hover:border-ink disabled:opacity-35 disabled:hover:border-neutral-300";

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <Link
          href={href as any}
          className="group inline-flex items-center gap-2 text-ink hover:text-ink text-lg sm:text-xl font-medium hover:underline underline-offset-4"
        >
          {title}
          <ArrowRight
            className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity"
            aria-hidden="true"
          />
        </Link>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[13px] text-neutral-500">{countLabel}</span>
          {overflows && (
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => page(-1)}
                disabled={!canPrev}
                aria-label={prevLabel}
                className={pagerBtnCls}
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => page(1)}
                disabled={!canNext}
                aria-label={nextLabel}
                className={pagerBtnCls}
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="mt-4 flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {homes.map((home) => (
          <div
            key={`${home.source}:${home.id}`}
            // Same column widths as the GuestFavorites grid (2/3/4/5 per row,
            // gap-6), so both sections' cards render at an identical size.
            className="snap-start shrink-0 w-[calc(100%-3rem)] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)] 2xl:w-[calc((100%-6rem)/5)]"
          >
            <PropertyCard
              property={home}
              pricing={null}
              hasDates={false}
              isLoadingPrices={false}
              fromQuote={pricingQuery.data?.[`${home.source}:${home.id}`] ?? null}
              t={t}
              theme="light"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
