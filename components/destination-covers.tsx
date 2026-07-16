"use client";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
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
      slug: "phuket",
      image: phuket,
      alt: "Aerial view of a luxury villa with infinity pool overlooking turquoise waters and limestone islands in Phuket",
    },
    {
      id: "pattaya",
      province: t("pattaya"),
      region: t("eastern"),
      slug: "pattaya",
      image: pattaya,
      alt: "Dynamic coastal cityscape of Pattaya with high-rise buildings, beach promenade and busy waterfront activities",
    },
  ];

  return (
    <section className={`py-16 sm:py-20 md:py-28 bg-ink ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-10 sm:mb-14 max-w-2xl">
          <span className="eyebrow mb-5">{t("eyebrow")}</span>
          <h2 className="font-display font-light text-white text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight mt-5 normal-case">
            {t("title")}
          </h2>
          <p className="text-white/60 font-poppins font-light text-base sm:text-lg leading-relaxed mt-5">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
          {DESTINATIONS.map((destination) => (
            <Link
              key={destination.id}
              href={`/destination/${destination.slug}`}
              className="group relative aspect-[4/3] sm:aspect-[3/2] rounded-2xl overflow-hidden cursor-pointer ring-1 ring-line transition-all duration-500 hover:ring-gold-antique/50"
            >
              <Image
                src={destination.image}
                alt={destination.alt}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                quality={80}
                className="object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent group-hover:from-black/85 transition-colors duration-500"></div>
              <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 text-white">
                <p className="text-[0.7rem] sm:text-xs text-champagne font-poppins mb-2 uppercase tracking-[0.28em]">
                  {destination.region}
                </p>
                <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-wide">
                  {destination.province}
                </h3>
                <span className="inline-flex items-center gap-2 mt-3 text-sm font-poppins text-white/70 tracking-wide opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
                  {t("explore")}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
