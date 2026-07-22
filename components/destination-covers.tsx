"use client";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { EXPERIENCE_REGIONS } from "@/config/experience-regions";

interface DestinationCoversProps {
  className?: string;
}

/**
 * Homepage order leads with the regions we actually manage villas in; the
 * photo and guide availability for each come straight from the config the
 * Destinations page reads, so the two surfaces can't drift apart.
 */
const ORDER = [
  "phuket",
  "pattaya",
  "bangkok",
  "samui",
  "huahin",
  "chiangmai",
] as const;

const DESTINATIONS = ORDER.map((key) => {
  const region = EXPERIENCE_REGIONS.find((r) => r.key === key);
  if (!region) throw new Error(`destination-covers: unknown region "${key}"`);
  return { key, img: region.img, hasGuide: region.hasGuide };
});

export default function DestinationCovers({
  className = "",
}: DestinationCoversProps) {
  const t = useTranslations("home.destinations");

  return (
    <section className={`py-16 sm:py-20 md:py-28 bg-ink ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-10 sm:mb-14 max-w-2xl">
          <span className="eyebrow mb-5">{t("eyebrow")}</span>
          <h2 className="font-display font-light text-white text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight mt-5 normal-case">
            {t("title")}
          </h2>
          <p className="text-white/60 text-base sm:text-lg leading-relaxed mt-5">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
          {DESTINATIONS.map((d) => {
            const name = t(d.key);
            const inner = (
              <>
                <Image
                  src={d.img}
                  alt={name}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  quality={80}
                  className="object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-105"
                />
                {/* Top-left name notch — the clean signature label */}
                <div className="absolute top-0 left-0 bg-white rounded-br-2xl pl-3.5 pr-5 py-2.5 shadow-sm">
                  <p className="text-ink font-semibold text-[15px] sm:text-base tracking-tight">
                    {name}
                  </p>
                </div>
                {!d.hasGuide && (
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/45 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                    {t("comingSoon")}
                  </span>
                )}
              </>
            );
            const classes =
              "group relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-line transition-all duration-500 hover:ring-white/30";
            return d.hasGuide ? (
              <Link
                key={d.key}
                href={`/experiences/${d.key}`}
                className={classes}
              >
                {inner}
              </Link>
            ) : (
              <div key={d.key} className={classes}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
