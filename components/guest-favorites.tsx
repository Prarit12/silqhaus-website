"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { PropertyCard } from "@/components/property-card";

/** Homepage showcase caps at 20 (five columns × four rows). */
const MAX_CARDS = 20;

/**
 * "Homes our guests love" — the same card treatment as the Vacation Rentals
 * listing page (image + dots, real save button, bed/guest/bath row).
 * Consumes the existing hostaway/guesty listing endpoints — no API changes.
 */
export default function GuestFavorites() {
  const t = useTranslations("home.guestFavorites");
  // PropertyCard reads its own labels (price, availability) from ourProperty.
  const cardT = useTranslations("ourProperty");

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

  // Real calendar prices for each property's minimum stay. Cards render
  // without it, so a slow or failed quote never holds up the grid.
  const pricingQuery = useQuery<Record<string, any>>({
    queryKey: ["home-pricing"],
    queryFn: async () => {
      const res = await fetch("/api/home-pricing");
      if (!res.ok) throw new Error("Failed to fetch pricing");
      return res.json();
    },
    staleTime: 60 * 60 * 1000,
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

  const isLoading = hostawayQuery.isLoading || guestyQuery.isLoading;
  if (isLoading) {
    return (
      <section className="bg-white py-14 sm:py-16">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-neutral-500 font-poppins">{t("loading")}</p>
        </div>
      </section>
    );
  }
  if (!villas.length) return null;

  return (
    <section className="bg-white py-14 sm:py-16 md:py-20">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10">
          {/* Eyebrow — dark variant for the white background */}
          <span className="inline-flex items-center gap-3 text-neutral-500 text-[0.72rem] font-medium uppercase tracking-[0.3em]">
            <span
              className="w-8 h-px bg-neutral-300"
              aria-hidden="true"
            />
            {t("eyebrow")}
          </span>
          <h2 className="font-display text-ink text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mt-4 normal-case">
            {t("title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {villas.slice(0, MAX_CARDS).map((v: any) => (
            <PropertyCard
              key={`${v.source}:${v.id}`}
              property={v}
              pricing={null}
              hasDates={false}
              isLoadingPrices={false}
              fromQuote={pricingQuery.data?.[`${v.source}:${v.id}`] ?? null}
              t={cardT}
              theme="light"
            />
          ))}
        </div>

        <div className="mt-10 sm:mt-12 flex justify-center">
          <Link
            href="/our-property"
            className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-neutral-800"
          >
            {t("seeMore")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
