"use client";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
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
    <section className={`py-8 sm:py-12 md:py-16 bg-[#000000] ${className}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-white mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-wide font-gilroy font-medium">
            {t("title")}
          </h2>
          <p className="text-white/70 font-poppins font-light text-base sm:text-lg leading-relaxed max-w-2xl">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {DESTINATIONS.map((destination) => (
            <Link
              key={destination.id}
              href={`/destination/${destination.slug}`}
              className="group relative aspect-[4/3] sm:aspect-[3/2] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]"
            >
              <Image
                src={destination.image}
                alt={destination.alt}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                quality={80}
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 group-hover:via-black/40 transition-colors duration-300"></div>
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
                <p className="text-xs sm:text-sm text-white/80 font-poppins mb-1 uppercase tracking-wider">
                  {destination.region}
                </p>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-gilroy font-bold tracking-wide">
                  {destination.province}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
