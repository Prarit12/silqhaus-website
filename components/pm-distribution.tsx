"use client";

import { useTranslations } from "next-intl";
import AirbnbLogo from "@/components/logos/airbnb-logo";
import VrboLogo from "@/components/logos/vrbo-logo";
import CollapsibleSection from "@/components/collapsible-section";

const PILLARS = ["reach", "paid", "convert"] as const;

export default function PmDistribution() {
  const t = useTranslations("propertyManagement.distribution");

  return (
    <CollapsibleSection
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
      className="bg-ink-2"
    >
      {/* Supporting pillars */}
      <div className="mb-14 sm:mb-16 grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-10">
          {PILLARS.map((k) => (
            <div key={k}>
              <h3 className="text-white font-semibold text-lg leading-snug tracking-tight text-balance">
                {t(`pillars.${k}.title`)}
              </h3>
              <p className="text-white/55 text-sm mt-3 leading-relaxed">
                {t(`pillars.${k}.desc`)}
              </p>
            </div>
          ))}
        </div>

        {/* OTA distribution — the booking platforms we list every home on */}
        <div className="rounded-2xl sm:rounded-3xl border border-line bg-white/[0.02] px-6 py-9 sm:px-10 sm:py-11">
          <p className="text-center text-white/60 text-sm sm:text-base">
            {t("platformsTitle")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14 lg:gap-x-16">
            {/* Airbnb — official Bélo + wordmark lockup */}
            <span className="text-white/80 transition-colors duration-300 hover:text-white">
              <AirbnbLogo className="h-[30px] w-auto" />
            </span>

            {/* Booking.com — official mark + wordmark */}
            <span className="inline-flex items-center gap-2 text-white/80 transition-colors duration-300 hover:text-white">
              <span className="inline-flex h-[22px] w-[22px] items-center justify-center overflow-hidden rounded-[5px]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-full w-full"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M24 0H0v24h24ZM8.575 6.563h2.658c2.108 0 3.473 1.15 3.473 2.898 0 1.15-.575 1.82-.91 2.108l-.287.263.335.192c.815.479 1.318 1.389 1.318 2.395 0 1.988-1.51 3.257-3.857 3.257H7.449V7.713c0-.623.503-1.126 1.126-1.15zm1.7 1.868c-.479.024-.694.264-.694.79v1.893h1.676c.958 0 1.294-.743 1.294-1.365 0-.815-.503-1.318-1.318-1.318zm-.096 4.36c-.407.071-.598.31-.598.79v2.251h1.868c.934 0 1.509-.55 1.509-1.533 0-.934-.599-1.509-1.51-1.509zm7.737 2.394c.743 0 1.341.599 1.341 1.342a1.34 1.34 0 0 1-1.341 1.341 1.355 1.355 0 0 1-1.341-1.341c0-.743.598-1.342 1.34-1.342z" />
                </svg>
              </span>
              <span className="text-[21px] font-bold tracking-tight">
                Booking.com
              </span>
            </span>

            {/* Expedia — official mark + wordmark */}
            <span className="inline-flex items-center gap-2 text-white/80 transition-colors duration-300 hover:text-white">
              <span className="inline-flex h-[22px] w-[22px] items-center justify-center overflow-hidden rounded-[5px]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-full w-full"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M19.067 0H4.933A4.94 4.94 0 0 0 0 4.933v14.134A4.932 4.932 0 0 0 4.933 24h14.134A4.932 4.932 0 0 0 24 19.067V4.933C24.01 2.213 21.797 0 19.067 0ZM7.336 19.341c0 .19-.148.337-.337.337h-2.33a.333.333 0 0 1-.337-.337v-2.33c0-.189.148-.336.337-.336H7c.19 0 .337.147.337.337zm12.121-1.486-2.308 2.298c-.169.168-.422.053-.422-.2V9.57l-6.44 6.44a.533.533 0 0 1-.421.17H8.169a.32.32 0 0 1-.338-.338v-1.697c0-.2.053-.316.169-.422l6.44-6.44H4.058c-.253 0-.369-.253-.2-.421l2.297-2.309c.137-.137.285-.232.517-.232H18.15c.854 0 1.539.686 1.539 1.54v11.478c-.01.231-.095.368-.232.516z" />
                </svg>
              </span>
              <span className="text-[21px] font-semibold tracking-tight">
                Expedia
              </span>
            </span>

            {/* Agoda — light wordmark + signature five-dot row */}
            <span className="inline-flex flex-col items-center gap-[5px] text-white/80 transition-colors duration-300 hover:text-white">
              <span className="text-[21px] font-normal lowercase leading-none tracking-[0.01em]">
                agoda
              </span>
              <span className="flex items-center gap-[5px]" aria-hidden="true">
                <span className="h-[5px] w-[5px] rounded-full bg-current" />
                <span className="h-[5px] w-[5px] rounded-full bg-current" />
                <span className="h-[5px] w-[5px] rounded-full bg-current" />
                <span className="h-[5px] w-[5px] rounded-full bg-current" />
                <span className="h-[5px] w-[5px] rounded-full bg-current" />
              </span>
            </span>

            {/* Vrbo — official striped wordmark */}
            <span className="text-white/80 transition-colors duration-300 hover:text-white">
              <VrboLogo className="h-[30px] w-auto" />
            </span>

            {/* Trip.com — bold wordmark with round dot */}
            <span className="inline-flex items-center text-[21px] font-bold tracking-tight text-white/80 transition-colors duration-300 hover:text-white">
              Trip
              <span className="mx-[2px] inline-block h-[6px] w-[6px] translate-y-[5px] rounded-full bg-current" />
              com
            </span>
          </div>
        </div>
    </CollapsibleSection>
  );
}
