import { getTranslations } from "next-intl/server";
import { ChevronDown } from "lucide-react";
import HeroSearchBar from "./hero-search-bar";

export default async function HeroSection() {
  const t = await getTranslations("home.hero");

  return (
    <section className="relative h-[45vh] min-h-[440px] flex items-center pt-20">
      {/* HomeToGo-style gradient background — monochrome graphite -> black */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(158deg, #565656 0%, #333333 32%, #1a1a1a 64%, #0d0d0d 100%)",
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

      {/* Centered headline over the search panel */}
      <div className="relative z-30 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <h1
          className="reveal-up font-normal text-white tracking-tight text-2xl sm:text-4xl lg:text-5xl leading-[1.1] text-balance"
          style={{ animationDelay: "0.1s" }}
        >
          {t("headlineLead")}{" "}
          <span className="font-light text-white/90">{t("headlineSub")}</span>
        </h1>

        <div
          className="reveal-up w-full mt-8 sm:mt-10 flex justify-center"
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
