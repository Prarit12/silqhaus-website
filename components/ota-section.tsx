import { SiAirbnb } from "react-icons/si";
import { useTranslations } from "next-intl";
import { OTAReviews } from "@/components/ota-reviews";

export function OTASection() {
  const t = useTranslations("home.ota");
  return (
    <section className="py-16 sm:py-20 bg-ink-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-14">
        <div className="flex flex-col items-center gap-6">
          <span className="eyebrow eyebrow--center">{t("asSeenOn")}</span>
          <div className="flex justify-center items-center gap-10 sm:gap-16 opacity-90">
            <div className="flex items-center gap-3 text-snow/85">
              <SiAirbnb className="w-9 h-9 sm:w-11 sm:h-11 text-[#FF5A5F]" />
              <span className="text-lg sm:text-xl font-poppins font-light hidden sm:inline">
                Airbnb
              </span>
            </div>
            <div className="flex items-center gap-2 text-snow/85">
              <span className="text-[#4c78b5] font-semibold text-xl sm:text-2xl">
                Vrbo
              </span>
            </div>
            <div className="flex items-center gap-2 text-snow/85">
              <span className="text-[#4a7cc4] font-semibold text-lg sm:text-xl">
                Booking.com
              </span>
            </div>
          </div>
        </div>

        <OTAReviews />

        <div className="font-poppins text-snow/90">
          {/* Mobile: stacked */}
          <div className="flex flex-col items-center gap-3 sm:hidden">
            <span className="font-display text-3xl italic text-snow/80">
              {t("butIts")}
            </span>
            <span className="font-display text-4xl italic text-champagne whitespace-nowrap">
              {t("cheaper")}
            </span>
            <span className="font-display text-3xl italic text-snow/80">
              {t("to")}
            </span>
            <span className="relative font-poppins font-medium tracking-wide text-champagne text-lg whitespace-nowrap">
              {t("bookDirectly")}
              <span className="absolute left-0 right-0 -bottom-1 h-px bg-gold-antique" />
            </span>
          </div>
          {/* Desktop: inline editorial line */}
          <p className="hidden sm:flex items-baseline justify-center gap-2.5 font-display text-3xl italic text-snow/80">
            {t("butIts")}
            <span className="text-champagne not-italic font-display font-medium text-4xl">
              {t("cheaper")}
            </span>
            {t("to")}
            <span className="relative not-italic font-poppins font-medium tracking-wide text-champagne text-xl self-center">
              {t("bookDirectly")}
              <span className="absolute left-0 right-0 -bottom-1.5 h-px bg-gold-antique" />
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
