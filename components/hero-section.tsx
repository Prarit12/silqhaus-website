import { getTranslations } from "next-intl/server";
import { ChevronDown } from "lucide-react";
import HeroSearchBar from "./hero-search-bar";

export default async function HeroSection() {
  const t = await getTranslations("home.hero");

  return (
    <section className="relative h-screen sm:h-[85vh] md:h-[88vh] lg:h-[92vh] flex items-center overflow-hidden">
      {/* HomeToGo-style gradient background (purple -> coral) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(158deg, #4b1e9e 0%, #6d28d9 26%, #a726b0 50%, #db4f88 74%, #f9835f 100%)",
        }}
      />

      {/* Soft blend into the dark sections below */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(13,13,13,0.2) 55%, rgb(13,13,13) 100%)",
        }}
      />

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
    </section>
  );
}
