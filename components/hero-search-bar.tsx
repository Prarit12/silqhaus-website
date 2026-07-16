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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1 sm:gap-0 rounded-3xl sm:rounded-full bg-white p-2 sm:p-1.5 shadow-2xl shadow-black/40 ring-1 ring-black/5">
        {/* Location */}
        <div className="flex items-center gap-3 flex-1 min-w-0 px-4 sm:px-5 py-3">
          <MapPin
            className="w-5 h-5 text-neutral-400 shrink-0"
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
            className="w-full bg-transparent text-neutral-900 placeholder:text-neutral-400 outline-none font-poppins text-[15px]"
          />
        </div>

        <div className="hidden sm:block w-px self-stretch bg-neutral-200 my-2.5" />

        {/* Dates */}
        <button
          type="button"
          onClick={goSearch}
          className="flex items-center gap-3 sm:flex-1 px-4 sm:px-5 py-3 text-left text-neutral-500 hover:text-neutral-900 transition-colors font-poppins text-[15px]"
        >
          <Calendar className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span className="truncate">{t("anytime")}</span>
        </button>

        <div className="hidden sm:block w-px self-stretch bg-neutral-200 my-2.5" />

        {/* Guests */}
        <button
          type="button"
          onClick={goSearch}
          className="flex items-center gap-3 sm:flex-1 px-4 sm:px-5 py-3 text-left text-neutral-500 hover:text-neutral-900 transition-colors font-poppins text-[15px]"
        >
          <Users className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span className="truncate">{t("guests")}</span>
        </button>

        {/* Search */}
        <button
          type="button"
          onClick={goSearch}
          className="flex items-center justify-center gap-2 rounded-full bg-neutral-900 text-white px-7 py-3.5 font-poppins font-medium tracking-wide hover:bg-neutral-800 transition-colors shrink-0"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          <span>{t("search")}</span>
        </button>
      </div>
    </div>
  );
}
