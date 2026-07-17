import { getTranslations } from "next-intl/server";
import { ChevronDown } from "lucide-react";
import HeroSearchBar from "./hero-search-bar";
import HeroConnector from "./hero-connector";

export default async function HeroSection() {
  const t = await getTranslations("home.hero");

  return (
    <section className="relative h-screen flex items-center overflow-hidden">
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

      {/* Headline top-left, search panel right — joined by a dotted elbow connector */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <HeroConnector
          headline={
            <h1
              className="tracking-tight reveal-up"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="block font-normal text-white text-4xl sm:text-5xl lg:text-[3.25rem] leading-[1.05]">
                {t("headlineLead")}
              </span>
              <span className="block whitespace-nowrap font-light text-white/90 text-xl sm:text-2xl lg:text-[1.7rem] leading-[1.15] mt-1.5">
                {t("headlineSub")}
              </span>
            </h1>
          }
          search={
            <div
              className="reveal-up w-full max-w-3xl lg:max-w-2xl"
              style={{ animationDelay: "0.25s" }}
            >
              <HeroSearchBar />
            </div>
          }
        />
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
