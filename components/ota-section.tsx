import { SiAirbnb } from "react-icons/si";
import { useTranslations } from "next-intl";
import { OTAReviews } from "@/components/ota-reviews";

export function OTASection() {
  const t = useTranslations("home.ota");
  return (
    <section className="py-12 bg-[#141414]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-14">
        <p className="text-snow/50 text-2xl font-poppins tracking-wider uppercase mb-6">
          {t("asSeenOn")}{" "}
        </p>
        <div className="flex justify-center items-center gap-10 sm:gap-16 mb-6">
          <div className="flex items-center gap-3 text-snow/80">
            <SiAirbnb className="w-12 h-12 text-[#FF5A5F]" />
            <span className="text-xl font-poppins hidden sm:inline">
              Airbnb
            </span>
          </div>
          <div className="flex items-center gap-2 text-snow/80">
            <span className="text-[#3D67A6] font-bold text-2xl">Vrbo</span>
          </div>
          <div className="flex items-center gap-2 text-snow/80">
            <span className="text-[#003580] font-bold text-xl">
              Booking.com
            </span>
          </div>
        </div>
        <OTAReviews />
        <div className="font-poppins text-gold">
          {/* Mobile: 4 stacked lines */}
          <div className="flex flex-col items-center gap-2 sm:hidden">
            <span className="text-2xl">{t("butIts")}</span>
            <span className="rounded-lg bg-gold px-3 py-1 text-black text-3xl font-extrabold whitespace-nowrap">
              {t("cheaper")}
            </span>
            <span className="text-2xl">{t("to")}</span>
            <span className="relative font-extrabold text-gold text-xl whitespace-nowrap">
              {t("bookDirectly")}
              <span className="absolute left-0 right-0 -bottom-1 h-1 bg-gold rounded-full" />
            </span>
          </div>
          {/* Desktop: inline */}
          <p className="hidden sm:block text-2xl">
            {t("butIts")}
            <span className="mx-2 rounded-lg bg-gold px-3 py-1 text-black text-3xl font-extrabold">
              {t("cheaper")}
            </span>
            {t("to")}
            <span className="relative ml-2 font-extrabold text-gold">
              {t("bookDirectly")}
              <span className="absolute left-0 right-0 -bottom-2 h-1.5 bg-gold rounded-full" />
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
