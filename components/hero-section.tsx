import { getTranslations } from "next-intl/server";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import HeroCarousel from "./hero-carousel";

export default async function HeroSection() {
  const t = await getTranslations("home.hero");

  return (
    <section className="relative h-screen sm:h-[80vh] md:h-[85vh] lg:h-[90vh] flex items-center justify-center">
      <HeroCarousel />
      <div className="relative z-30 text-center text-snow max-w-5xl px-6 mt-20 sm:mt-0">
        <div className="mx-auto flex flex-col items-center">
          <span className="eyebrow eyebrow--center reveal-up">
            {t("eyebrow")}
          </span>

          <h1 className="font-display font-light tracking-[0.12em] text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl mt-7 reveal-up" style={{ animationDelay: "0.1s" }}>
            {t("brand")}
          </h1>

          <div className="hairline-gold max-w-[140px] mt-7 reveal-up" style={{ animationDelay: "0.2s" }} />

          <h2 className="font-poppins font-light text-snow/90 text-lg sm:text-xl md:text-2xl leading-relaxed tracking-wide max-w-2xl mx-auto mt-7 reveal-up" style={{ animationDelay: "0.3s" }}>
            {t("headline")}
          </h2>
        </div>

        <div className="mt-10 sm:mt-11 reveal-up" style={{ animationDelay: "0.42s" }}>
          <div className="flex justify-center items-center">
            <Link
              href="/our-property"
              className="btn-lux-solid group"
              data-testid="button-view-destinations"
            >
              <span className="relative z-10">{t("cta")}</span>
            </Link>
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce z-20"
        aria-hidden="true"
      >
        <ChevronDown className="w-5 h-5 text-snow opacity-80" />
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, 
            transparent 0%, 
            rgba(12, 12, 12, 0.05) 15%, 
            rgba(12, 12, 12, 0.15) 30%, 
            rgba(12, 12, 12, 0.35) 50%, 
            rgba(12, 12, 12, 0.65) 70%, 
            rgba(12, 12, 12, 0.85) 85%, 
            rgb(12, 12, 12) 100%)`,
        }}
      ></div>
    </section>
  );
}
