import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { ChevronDown } from "lucide-react";
import HeroSearchBar from "./hero-search-bar";

export default async function HeroSection() {
  const t = await getTranslations("home.hero");
  const locale = await getLocale();

  return (
    <section className="relative flex-1 min-h-[580px] flex items-center pt-20">
      {/* Full-bleed hero photograph — decorative, the headline carries meaning */}
      <Image
        src="/photos/why-silqhaus.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        quality={85}
        className="object-cover object-center"
      />
      {/* Scrim — pooled behind the headline so the photo stays vivid at the
       * edges while white type clears WCAG over a bright sunset sky. */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 75% at 50% 46%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.28) 55%, rgba(0,0,0,0) 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-transparent"
        aria-hidden="true"
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
      <div className="relative z-30 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center -translate-y-6 sm:-translate-y-10">
        {/* Hand-lettered wordmark for Latin; Thai has no script equivalent,
         * so it keeps the Trirong serif set as live text. */}
        {locale === "th" ? (
          <h1
            className="reveal-up font-hero font-semibold text-white tracking-[-0.01em] text-2xl sm:text-4xl lg:text-5xl leading-[1.15] text-balance"
            style={{ animationDelay: "0.1s" }}
          >
            {t("headlineLead")}{" "}
            <span className="font-light text-white/90">{t("headlineSub")}</span>
          </h1>
        ) : (
          <h1 className="reveal-up w-full" style={{ animationDelay: "0.1s" }}>
            <span className="sr-only">{t("headline")}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/hero-lettering.svg"
              alt=""
              aria-hidden="true"
              className="mx-auto w-full max-w-xl sm:max-w-2xl lg:max-w-3xl invert"
            />
          </h1>
        )}

        <div
          className="reveal-up w-full mt-12 sm:mt-16 flex justify-center"
          style={{ animationDelay: "0.25s" }}
        >
          <HeroSearchBar />
        </div>
      </div>

      {/* Scroll cue — the fold is filled edge to edge, so say there's more
       * below and let it be clicked, not just hinted at. */}
      <a
        href="#homes"
        className="group absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 rounded-full px-4 py-1.5 text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        <span className="text-xs sm:text-[13px] font-medium tracking-wide">
          {t("scrollCue")}
        </span>
        <ChevronDown
          className="w-5 h-5 animate-bounce motion-reduce:animate-none"
          aria-hidden="true"
        />
      </a>
    </section>
  );
}
