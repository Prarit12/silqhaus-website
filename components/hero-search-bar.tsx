"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Search, MapPin, Calendar, Users } from "lucide-react";

/**
 * HomeToGo-style hero search bar.
 * Visual entry point that routes into the existing property-search page.
 * Deliberately does NOT touch the booking/API/filter logic — it just navigates.
 *
 * Note: uses Tailwind's built-in neutral-* grays (not the theme `ink` token),
 * because `ink` is a hex CSS variable and opacity modifiers like `text-ink/55`
 * don't apply to hex var() colors — they'd fall back to the inherited white.
 */
export default function HeroSearchBar() {
  const t = useTranslations("home.hero.search");
  const router = useRouter();
  const [location, setLocation] = useState("");

  const goSearch = () => {
    router.push(
      location.trim()
        ? { pathname: "/our-property", query: { location: location.trim() } }
        : "/our-property",
    );
  };

  return (
    <div className="w-full max-w-3xl">
      {/* Frosted panel: labelled fields as inner pills + circular search */}
      <div className="rounded-2xl sm:rounded-3xl bg-black/45 backdrop-blur-md ring-1 ring-white/10 shadow-2xl shadow-black/40 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-3">
          {/* Location */}
          <div className="flex-1 min-w-0">
            <span className="block text-xs font-medium text-white/70 mb-2">
              {t("locationLabel")}
            </span>
            <label className="flex items-center gap-2.5 rounded-full bg-white/10 ring-1 ring-white/15 px-4 py-3 transition-colors focus-within:ring-white/40">
              <MapPin
                className="w-4 h-4 text-white/70 shrink-0"
                aria-hidden="true"
              />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") goSearch();
                }}
                placeholder={t("whereTo")}
                aria-label={t("whereTo")}
                className="w-full bg-transparent text-white text-sm placeholder:text-white/65 outline-none"
              />
            </label>
          </div>

          {/* Dates */}
          <div className="flex-1 min-w-0">
            <span className="block text-xs font-medium text-white/70 mb-2">
              {t("dateLabel")}
            </span>
            <button
              type="button"
              onClick={goSearch}
              className="flex w-full items-center gap-2.5 rounded-full bg-white/10 ring-1 ring-white/15 px-4 py-3 text-left text-sm text-white/85 transition-colors hover:ring-white/35"
            >
              <Calendar
                className="w-4 h-4 text-white/70 shrink-0"
                aria-hidden="true"
              />
              <span className="truncate">{t("anytime")}</span>
            </button>
          </div>

          {/* Guests */}
          <div className="flex-1 min-w-0">
            <span className="block text-xs font-medium text-white/70 mb-2">
              {t("guestsLabel")}
            </span>
            <button
              type="button"
              onClick={goSearch}
              className="flex w-full items-center gap-2.5 rounded-full bg-white/10 ring-1 ring-white/15 px-4 py-3 text-left text-sm text-white/85 transition-colors hover:ring-white/35"
            >
              <Users
                className="w-4 h-4 text-white/70 shrink-0"
                aria-hidden="true"
              />
              <span className="truncate">{t("guests")}</span>
            </button>
          </div>

          {/* Search — circular on desktop, full-width pill on mobile */}
          <button
            type="button"
            onClick={goSearch}
            aria-label={t("search")}
            className="hidden sm:flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-white text-ink transition-colors hover:bg-neutral-200"
          >
            <Search className="w-[18px] h-[18px]" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={goSearch}
            className="sm:hidden flex w-full items-center justify-center gap-2 rounded-full bg-white text-ink px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-neutral-200"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            {t("search")}
          </button>
        </div>
      </div>
    </div>
  );
}
