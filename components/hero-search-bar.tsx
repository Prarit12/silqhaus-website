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
 * Airbnb-style single-pill search. "Where" opens a region picker (photos we
 * already ship); "When" opens a two-month calendar / flexible picker. A search
 * routes into /our-property with location + check-in/out as filters.
 *
 * `variant`: "hero" is the large landing-page pill; "compact" is the smaller,
 * bordered pill that lives centered in the header.
 */
export default function HeroSearchBar({
  variant = "hero",
}: {
  variant?: "hero" | "compact";
}) {
  const compact = variant === "compact";
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

  /** Icon-only until the guest has actually picked something, then the
   * button widens to spell out "Search". */
  const hasSelection = Boolean(selected || checkIn || guestTotal > 0);

  return (
    <div
      ref={wrapRef}
      className={`relative w-full ${compact ? "max-w-md" : "max-w-xl"}`}
    >
      <div
        className={`flex items-center rounded-full bg-white ${
          compact
            ? "h-10 pl-4 pr-1 border border-neutral-200 shadow-md"
            : "shadow-2xl shadow-black/25 h-[52px] sm:h-14 pl-4 pr-1.5"
        }`}
      >
        {/* Where — opens the region picker */}
        <button
          type="button"
          onClick={() => setPanel((p) => (p === "where" ? null : "where"))}
          aria-haspopup="dialog"
          aria-expanded={panel === "where"}
          className="flex items-center justify-center gap-2.5 flex-1 min-w-0 text-center"
        >
          <span
            className={`truncate ${compact ? "text-[13px]" : "text-sm sm:text-[15px]"} ${
              selectedRegion ? "text-ink font-medium" : "text-neutral-600"
            }`}
          >
            {selectedRegion ? tDest(selectedRegion.key) : `${t("where")}?`}
          </span>
        </button>

        {/* When — opens the calendar / flexible picker */}
        <span
          className={`hidden sm:block w-px bg-neutral-200 mx-1 shrink-0 ${compact ? "h-5" : "h-6"}`}
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={() => setPanel((p) => (p === "when" ? null : "when"))}
          aria-haspopup="dialog"
          aria-expanded={panel === "when"}
          className={`hidden sm:block flex-1 px-4 text-center transition-colors ${
            compact ? "text-[13px]" : "text-[15px]"
          } ${
            checkIn ? "text-ink font-medium" : "text-neutral-600 hover:text-ink"
          }`}
        >
          {whenLabel}
        </button>
        <span
          className={`hidden sm:block w-px bg-neutral-200 mx-1 shrink-0 ${compact ? "h-5" : "h-6"}`}
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={() => setPanel((p) => (p === "who" ? null : "who"))}
          aria-haspopup="dialog"
          aria-expanded={panel === "who"}
          className={`hidden sm:block flex-1 px-4 text-center transition-colors ${
            compact ? "text-[13px]" : "text-[15px]"
          } ${
            whoParts.length
              ? "text-ink font-medium"
              : "text-neutral-600 hover:text-ink"
          }`}
        >
          {whoLabel}
        </button>

        {/* Search — a compact circle until there's something to search for */}
        <button
          type="button"
          onClick={goSearch}
          aria-label={t("search")}
          className={`ml-2 shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white text-sm font-semibold transition-all duration-300 ease-out hover:bg-neutral-800 ${
            compact
              ? "h-8 w-8"
              : `h-11 ${hasSelection ? "px-4 sm:px-5" : "w-11"}`
          }`}
        >
          <Search
            className={`shrink-0 ${compact ? "w-3.5 h-3.5" : "w-4 h-4"}`}
            aria-hidden="true"
          />
          {!compact && hasSelection && <span>{t("search")}</span>}
        </button>
      </div>

      {/* Region picker */}
      {panel === "where" && (
        <div
          role="dialog"
          aria-label={t("whereTitle")}
          className={`absolute top-full mt-3 w-[calc(100vw-2rem)] max-w-xl rounded-2xl sm:rounded-3xl bg-white shadow-2xl shadow-black/30 p-5 sm:p-6 z-50 text-left ${
            compact ? "left-1/2 -translate-x-1/2" : "left-0"
          }`}
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
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[calc(100vw-2rem)] max-w-2xl rounded-2xl sm:rounded-3xl bg-white shadow-2xl shadow-black/30 p-5 sm:p-7 z-50"
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
          <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
            <span className="text-sm text-neutral-600 truncate">
              {checkIn ? whenLabel : t("when")}
            </span>
            <button
              type="button"
              onClick={() => setPanel("who")}
              className="shrink-0 inline-flex items-center justify-center h-10 px-6 rounded-full bg-ink text-white text-sm font-semibold hover:bg-neutral-800 transition-colors"
            >
              {t("next")}
            </button>
          </div>
        </div>
      )}

      {/* Who picker */}
      {panel === "who" && (
        <div
          role="dialog"
          aria-label={t("who")}
          className={`absolute top-full mt-3 w-[calc(100vw-2rem)] max-w-md rounded-2xl sm:rounded-3xl bg-white shadow-2xl shadow-black/30 p-5 sm:p-6 z-50 ${
            compact ? "left-1/2 -translate-x-1/2" : "right-0"
          }`}
        >
          <HeroWhoPicker value={guests} onChange={setGuests} />
          <div className="mt-4 pt-4 border-t border-neutral-100 flex justify-end">
            <button
              type="button"
              onClick={goSearch}
              className="inline-flex items-center justify-center gap-2 h-10 px-6 rounded-full bg-ink text-white text-sm font-semibold hover:bg-neutral-800 transition-colors"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              {t("search")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
