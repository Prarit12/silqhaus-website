"use client";
import Image, { type StaticImageData } from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import phuket from "@/assets/destination-carousel/phuket.webp";
import pattaya from "@/assets/destination-carousel/pattaya.webp";

interface DestinationCoversProps {
  className?: string;
}

type Href =
  | string
  | { pathname: string; query: Record<string, string> }
  | null;

interface Destination {
  id: string;
  name: string;
  href: Href;
  image: string | StaticImageData;
  alt: string;
  comingSoon?: boolean;
}

export default function DestinationCovers({
  className = "",
}: DestinationCoversProps) {
  const t = useTranslations("home.destinations");

  /** One clean grid — flagship destinations link to their listings, guide-only
   * cities to their guide, and the rest are teased as coming soon. */
  const DESTINATIONS: Destination[] = [
    {
      id: "phuket",
      name: t("phuket"),
      href: { pathname: "/our-property", query: { location: "Phuket" } },
      image: phuket,
      alt: "Aerial view of a luxury villa with infinity pool overlooking turquoise waters in Phuket",
    },
    {
      id: "pattaya",
      name: t("pattaya"),
      href: { pathname: "/our-property", query: { location: "Pattaya" } },
      image: pattaya,
      alt: "Coastal cityscape of Pattaya with high-rise buildings and a beach promenade",
    },
    {
      id: "bangkok",
      name: t("bangkok"),
      href: "/experiences/bangkok",
      image: "/experiences/regions/bangkok.jpg",
      alt: "Wat Arun temple glowing at blue hour in Bangkok",
    },
    {
      id: "samui",
      name: t("samui"),
      href: null,
      image: "/experiences/regions/samui.jpg",
      alt: "Palm-fringed beach with a longtail boat on Koh Samui",
      comingSoon: true,
    },
    {
      id: "huahin",
      name: t("huahin"),
      href: null,
      image: "/experiences/regions/huahin.jpg",
      alt: "Hua Hin beach at sunrise with a wooden pier",
      comingSoon: true,
    },
    {
      id: "chiangmai",
      name: t("chiangmai"),
      href: null,
      image: "/experiences/regions/chiangmai.jpg",
      alt: "Doi Suthep's golden chedi above the mist in Chiang Mai",
      comingSoon: true,
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
          <p className="text-white/60 text-base sm:text-lg leading-relaxed mt-5">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
          {DESTINATIONS.map((d) => {
            const inner = (
              <>
                <Image
                  src={d.image}
                  alt={d.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  quality={80}
                  className="object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-105"
                />
                {/* Top-left name notch — the clean signature label */}
                <div className="absolute top-0 left-0 bg-white rounded-br-2xl pl-3.5 pr-5 py-2.5 shadow-sm">
                  <p className="text-ink font-semibold text-[15px] sm:text-base tracking-tight">
                    {d.name}
                  </p>
                </div>
                {d.comingSoon && (
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/45 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                    {t("comingSoon")}
                  </span>
                )}
              </>
            );
            const classes =
              "group relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-line transition-all duration-500 hover:ring-white/30";
            return d.href ? (
              <Link key={d.id} href={d.href} className={classes}>
                {inner}
              </Link>
            ) : (
              <div key={d.id} className={classes}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
