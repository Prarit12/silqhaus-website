"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight, Star, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { createPropertySlug } from "@/lib/slugify";
import { useHoverPrefetch } from "@/hooks/use-hover-prefetch";

/**
 * Airbnb-style property cards (image on top, details below).
 * Consumes the existing hostaway/guesty listing endpoints — no API changes.
 */
export default function GuestFavorites() {
  const t = useTranslations("home.guestFavorites");
  const buildHoverHandlers = useHoverPrefetch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const hostawayQuery = useQuery<any[]>({
    queryKey: ["hostaway", "listings"],
    queryFn: async () => {
      const res = await fetch("/api/hostaway/listings");
      if (!res.ok) throw new Error("Failed to fetch hostaway listings");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const guestyQuery = useQuery<any[]>({
    queryKey: ["guesty", "listings"],
    queryFn: async () => {
      const res = await fetch("/api/guesty/listings");
      if (!res.ok) throw new Error("Failed to fetch guesty listings");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const villas = useMemo(() => {
    const ha = (hostawayQuery.data ?? []).map((l: any) => ({
      ...l,
      source: l.source ?? "hostaway",
    }));
    const gu = (guestyQuery.data ?? []).map((l: any) => ({
      ...l,
      source: l.source ?? "guesty",
    }));
    const seen = new Set<string>();
    const out: any[] = [];
    for (const l of [...ha, ...gu]) {
      const key = `${l.source ?? "hostaway"}:${l.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(l);
    }
    return out;
  }, [hostawayQuery.data, guestyQuery.data]);

  const scroll = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = (el.children[0] as HTMLElement)?.offsetWidth ?? 320;
    el.scrollBy({ left: dir * (amount + 20), behavior: "smooth" });
  };

  const isLoading = hostawayQuery.isLoading || guestyQuery.isLoading;
  if (isLoading) {
    return (
      <section className="bg-ink py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-white/50 font-poppins">{t("loading")}</p>
        </div>
      </section>
    );
  }
  if (!villas.length) return null;

  return (
    <section className="bg-ink py-14 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-7 sm:mb-9">
          <div>
            <span className="eyebrow mb-3">{t("eyebrow")}</span>
            <h2 className="font-display text-white text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mt-4 normal-case">
              {t("title")}
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-full border border-line text-white flex items-center justify-center hover:bg-white hover:text-ink transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-full border border-line text-white flex items-center justify-center hover:bg-white hover:text-ink transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-1 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {villas.map((v: any) => {
            const href = `/our-property/${createPropertySlug(v.name, v.id)}`;
            const key = `${v.source}:${v.id}`;
            const raw = v.averageReviewRating ?? v.starRating ?? null;
            const rating =
              typeof raw === "number"
                ? (raw > 5 ? raw / 2 : raw).toFixed(1)
                : null;
            const isSaved = !!saved[key];
            return (
              <Link
                key={key}
                href={href as any}
                prefetch={false}
                {...buildHoverHandlers(href)}
                className="group flex-none w-64 sm:w-72 md:w-80 snap-start"
                aria-label={`View ${v.name}`}
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-line">
                  <Image
                    src={v.listingImages?.[0]?.url ?? ""}
                    alt={v.name}
                    fill
                    sizes="(max-width: 640px) 80vw, 320px"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 tracking-wide">
                    <Star className="w-3 h-3 fill-white" />
                    {t("badge")}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSaved((s) => ({ ...s, [key]: !s[key] }));
                    }}
                    aria-label={isSaved ? "Remove from saved" : "Save"}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/35 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/55 transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`}
                    />
                  </button>
                </div>

                <div className="pt-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-white font-medium text-[15px] leading-snug">
                      {v.name}
                    </h3>
                    {rating && (
                      <span className="flex items-center gap-1 text-white text-sm shrink-0 mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-white" />
                        {rating}
                      </span>
                    )}
                  </div>
                  <p className="text-white/55 font-poppins text-sm mt-1">
                    {v.bedroomsNumber} {t("bedrooms")}
                    {v.bathroomsNumber
                      ? ` · ${v.bathroomsNumber} ${t("baths")}`
                      : ""}
                  </p>
                  {(v.city || v.state) && (
                    <p className="text-white/40 font-poppins text-sm">
                      {v.city}
                      {v.city && v.state ? ", " : ""}
                      {v.state}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
