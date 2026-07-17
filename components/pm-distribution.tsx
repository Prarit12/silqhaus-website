"use client";

import { useTranslations } from "next-intl";
import {
  AirbnbLockup,
  BookingLockup,
  ExpediaLockup,
  AgodaLockup,
  VrboLockup,
  TripLockup,
} from "@/components/logos/ota-logos";
import CollapsibleSection from "@/components/collapsible-section";

const OTAS = [
  { key: "airbnb", logo: AirbnbLockup },
  { key: "booking", logo: BookingLockup },
  { key: "expedia", logo: ExpediaLockup },
  { key: "agoda", logo: AgodaLockup },
  { key: "vrbo", logo: VrboLockup },
  { key: "trip", logo: TripLockup },
] as const;

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
            {OTAS.map((o) => (
              <span
                key={o.key}
                className="text-white/80 transition-colors duration-300 hover:text-white"
              >
                <o.logo />
              </span>
            ))}
          </div>
        </div>
    </CollapsibleSection>
  );
}
