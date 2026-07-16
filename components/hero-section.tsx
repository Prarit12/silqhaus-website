import { getTranslations } from "next-intl/server";
import { ChevronDown } from "lucide-react";
import HeroCarousel from "./hero-carousel";
import HeroSearchBar from "./hero-search-bar";

export default async function HeroSection() {
  const t = await getTranslations("home.hero");

  return (
    <section className="relative h-screen sm:h-[85vh] md:h-[88vh] lg:h-[92vh] flex items-center">
      <HeroCarousel />

      {/* Legibility scrims over the photo (left + bottom) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/45 to-black/10 pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/55 via-transparent to-black/20 pointer-events-none" />

      {/* Left-aligned headline + search bar (HomeToGo-style) */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <h1
            className="tracking-tight reveal-up"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="block font-normal text-white text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] leading-[1.03]">
              {t("headlineLead")}
            </span>
            <span className="block whitespace-nowrap font-light text-white/90 text-xl sm:text-2xl md:text-3xl lg:text-[2.4rem] leading-[1.1] mt-1.5">
              {t("headlineSub")}
            </span>
          </h1>
        </div>

        <div
          className="mt-9 sm:mt-10 reveal-up"
          style={{ animationDelay: "0.25s" }}
        >
          <HeroSearchBar />
        </div>
      </div>

      <div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce z-20"
        aria-hidden="true"
      >
        <ChevronDown className="w-5 h-5 text-snow opacity-80" />
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-48 z-20 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom,
            transparent 0%,
            rgba(12, 12, 12, 0.05) 15%,
            rgba(12, 12, 12, 0.15) 30%,
            rgba(12, 12, 12, 0.35) 50%,
            rgba(12, 12, 12, 0.65) 70%,
            rgba(12, 12, 12, 0.85) 85%,
            rgb(12, 12, 12) 100%)`,
        }}
      ></div>
    </section>
  );
}
