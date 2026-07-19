"use client";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, BookOpen } from "lucide-react";
import phuket from "@/assets/destination-carousel/phuket.webp";
import pattaya from "@/assets/destination-carousel/pattaya.webp";

interface DestinationCoversProps {
  className?: string;
}

export default function DestinationCovers({
  className = "",
}: DestinationCoversProps) {
  const t = useTranslations("home.destinations");

  const DESTINATIONS = [
    {
      id: "phuket",
      province: t("phuket"),
      region: t("andaman"),
      staysHref: { pathname: "/our-property", query: { location: "Phuket" } },
      guideHref: "/experiences/phuket",
      image: phuket,
      alt: "Aerial view of a luxury villa with infinity pool overlooking turquoise waters and limestone islands in Phuket",
    },
    {
      id: "pattaya",
      province: t("pattaya"),
      region: t("eastern"),
      staysHref: { pathname: "/our-property", query: { location: "Pattaya" } },
      guideHref: "/destination/pattaya",
      image: pattaya,
      alt: "Dynamic coastal cityscape of Pattaya with high-rise buildings, beach promenade and busy waterfront activities",
    },
  ] as const;

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
          {DESTINATIONS.map((destination) => (
            <div
              key={destination.id}
              className="group relative aspect-[4/3] sm:aspect-[3/2] rounded-2xl overflow-hidden ring-1 ring-line transition-all duration-500 hover:ring-white/30"
            >
              <Image
                src={destination.image}
                alt={destination.alt}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                quality={80}
                className="object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-colors duration-500 group-hover:from-black/90" />
              <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 text-white">
                <p className="text-[0.7rem] sm:text-xs text-white/60 mb-2 uppercase tracking-[0.28em]">
                  {destination.region}
                </p>
                <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-wide">
                  {destination.province}
                </h3>
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  {/* Stretched link — the whole card browses villas here */}
                  <Link
                    href={destination.staysHref}
                    className="inline-flex items-center gap-2 rounded-full bg-white text-ink px-4 py-2 text-sm font-semibold transition-colors hover:bg-neutral-200 after:absolute after:inset-0 after:content-['']"
                  >
                    {t("browseVillas")}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={destination.guideHref}
                    className="relative z-10 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/30 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur-sm transition-colors hover:border-white/60 hover:text-white"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {t("guide")}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
