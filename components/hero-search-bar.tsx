"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Search, Globe } from "lucide-react";
import HeroWhenPicker from "./hero-when-picker";
import HeroWhoPicker, {
  type GuestCounts,
  EMPTY_GUESTS,
} from "./hero-who-picker";

/** Regions with photos we already ship; `q` is the location filter sent to
 * the listing page, kept in English so it matches listing data in any locale. */
const REGIONS = [
  { key: "phuket", label: "andaman", img: "/experiences/regions/phuket.jpg", q: "Phuket" },
  { key: "pattaya", label: "eastern", img: "/experiences/regions/pattaya.jpg", q: "Pattaya" },
  { key: "bangkok", label: "central", img: "/experiences/regions/bangkok.jpg", q: "Bangkok" },
  { key: "samui", label: "gulf", img: "/experiences/regions/samui.jpg", q: "Koh Samui" },
  { key: "huahin", label: "royalCoast", img: "/experiences/regions/huahin.jpg", q: "Hua Hin" },
  { key: "chiangmai", label: "north", img: "/experiences/regions/chiangmai.jpg", q: "Chiang Mai" },
] as const;

type Panel = "where" | "when" | "who" | null;

/**
 * Airbnb-style single-pill hero search. "Where" opens a region picker (photos
 * we already ship); "When" opens a two-month calendar / flexible picker. A
 * search routes into /our-property with location + check-in/out as filters.
 */
export default function HeroSearchBar() {
  const t = useTranslations("home.hero.search");
  const tDest = useTranslations("home.destinations");
  const locale = useLocale();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [guests, setGuests] = useState<GuestCounts>(EMPTY_GUESTS);
  const [panel, setPanel] = useState<Panel>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close any open panel on outside click / Escape.
  useEffect(() => {
    if (!panel) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setPanel(null);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(null);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [panel]);

  const guestTotal = guests.adults + guests.children;

  const goSearch = () => {
    const region = REGIONS.find((r) => r.key === selected);
    const query: Record<string, string> = {};
    if (region) query.location = region.q;
    if (checkIn) query.checkIn = checkIn;
    if (checkOut) query.checkOut = checkOut;
    if (guestTotal > 1) query.guests = String(guestTotal);
    setPanel(null);
    router.push(
      Object.keys(query).length
        ? { pathname: "/our-property", query }
        : "/our-property",
    );
  };

  const pickRegion = (r: (typeof REGIONS)[number]) => {
    setSelected(r.key);
    setPanel("when");
  };

  const pickAnywhere = () => {
    setSelected(null);
    setPanel("when");
  };

  const selectedRegion = REGIONS.find((r) => r.key === selected);

  const fmtDay = (iso: string) =>
    new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(
      new Date(`${iso}T00:00:00`),
    );
  const whenLabel = checkIn
    ? checkOut
      ? `${fmtDay(checkIn)} – ${fmtDay(checkOut)}`
      : fmtDay(checkIn)
    : `${t("when")}?`;

  const whoParts: string[] = [];
  if (guestTotal > 0) whoParts.push(t("guestCount", { n: guestTotal }));
  if (guests.infants > 0)
    whoParts.push(t("infantCount", { n: guests.infants }));
  if (guests.pets > 0) whoParts.push(t("petCount", { n: guests.pets }));
  const whoLabel = whoParts.length ? whoParts.join(", ") : `${t("who")}?`;

  return (
    <div ref={wrapRef} className="relative w-full max-w-2xl">
      <div className="flex items-center rounded-full bg-white shadow-2xl shadow-black/25 h-14 sm:h-16 pl-5 pr-1.5">
        {/* Where — opens the region picker */}
        <button
          type="button"
          onClick={() => setPanel((p) => (p === "where" ? null : "where"))}
          aria-haspopup="dialog"
          aria-expanded={panel === "where"}
          className="flex items-center justify-center gap-2.5 flex-1 min-w-0 text-center"
        >
          <Search
            className="w-4 h-4 text-neutral-500 shrink-0"
            aria-hidden="true"
          />
          <span
            className={`truncate text-sm sm:text-[15px] ${
              selectedRegion ? "text-ink font-medium" : "text-neutral-600"
            }`}
          >
            {selectedRegion ? tDest(selectedRegion.key) : `${t("where")}?`}
          </span>
        </button>

        {/* When — opens the calendar / flexible picker */}
        <span
          className="hidden sm:block h-6 w-px bg-neutral-200 mx-1 shrink-0"
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={() => setPanel((p) => (p === "when" ? null : "when"))}
          aria-haspopup="dialog"
          aria-expanded={panel === "when"}
          className={`hidden sm:block flex-1 px-4 text-center text-[15px] transition-colors ${
            checkIn ? "text-ink font-medium" : "text-neutral-600 hover:text-ink"
          }`}
        >
          {whenLabel}
        </button>
        <span
          className="hidden sm:block h-6 w-px bg-neutral-200 mx-1 shrink-0"
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={() => setPanel((p) => (p === "who" ? null : "who"))}
          aria-haspopup="dialog"
          aria-expanded={panel === "who"}
          className={`hidden sm:block flex-1 px-4 text-center text-[15px] transition-colors ${
            whoParts.length
              ? "text-ink font-medium"
              : "text-neutral-600 hover:text-ink"
          }`}
        >
          {whoLabel}
        </button>

        {/* Search */}
        <button
          type="button"
          onClick={goSearch}
          className="ml-2 shrink-0 inline-flex items-center justify-center rounded-full bg-ink text-white px-6 sm:px-7 h-11 sm:h-[52px] text-sm font-semibold transition-colors hover:bg-neutral-800"
        >
          {t("search")}
        </button>
      </div>

      {/* Region picker */}
      {panel === "where" && (
        <div
          role="dialog"
          aria-label={t("whereTitle")}
          className="absolute top-full left-0 mt-3 w-full max-w-xl rounded-2xl sm:rounded-3xl bg-white shadow-2xl shadow-black/30 p-5 sm:p-6 z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200 text-left"
        >
          <h3 className="text-ink font-semibold text-lg tracking-tight">
            {t("whereTitle")}
          </h3>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {REGIONS.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => pickRegion(r)}
                className="flex items-center gap-3 rounded-xl border border-neutral-200 p-2.5 text-left transition-colors hover:border-neutral-400 hover:bg-neutral-50"
              >
                <span className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={r.img}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block text-ink font-semibold text-[15px] tracking-tight truncate">
                    {tDest(r.key)}
                  </span>
                  <span className="block text-neutral-500 text-xs truncate">
                    {tDest(r.label)}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={pickAnywhere}
            className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 py-3.5 text-ink text-sm font-medium transition-colors hover:border-neutral-500 hover:bg-neutral-50"
          >
            <Globe className="w-4 h-4" aria-hidden="true" />
            {t("anywhere")}
          </button>
        </div>
      )}

      {/* When picker */}
      {panel === "when" && (
        <div
          role="dialog"
          aria-label={t("when")}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[calc(100vw-2rem)] max-w-2xl rounded-2xl sm:rounded-3xl bg-white shadow-2xl shadow-black/30 p-5 sm:p-7 z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200"
        >
          <HeroWhenPicker
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={(ci, co) => {
              setCheckIn(ci);
              setCheckOut(co);
            }}
            onClear={() => {
              setCheckIn(null);
              setCheckOut(null);
            }}
          />
        </div>
      )}

      {/* Who picker */}
      {panel === "who" && (
        <div
          role="dialog"
          aria-label={t("who")}
          className="absolute top-full right-0 mt-3 w-[calc(100vw-2rem)] max-w-md rounded-2xl sm:rounded-3xl bg-white shadow-2xl shadow-black/30 p-5 sm:p-6 z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200"
        >
          <HeroWhoPicker value={guests} onChange={setGuests} />
        </div>
      )}
    </div>
  );
}
