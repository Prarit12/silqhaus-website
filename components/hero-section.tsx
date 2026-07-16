import { getTranslations } from "next-intl/server";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import HeroCarousel from "./hero-carousel";

export default async function HeroSection() {
  const t = await getTranslations("home.hero");

  return (
    <section className="relative h-screen sm:h-[80vh] md:h-[85vh] lg:h-[90vh] flex items-center justify-center">
      <HeroCarousel />
      <div className="relative z-30 text-left text-snow max-w-5xl px-4 mt-20 sm:mt-0">
        <div className="pt-[0px] pb-[0px] mt-[40px] mb-[40px] sm:mt-[50px] sm:mb-[50px] md:mt-[40px] md:mb-[40px] lg:mt-[50px] lg:mb-[50px] ml-[0px] mr-[0px]"></div>

        <div className="mt-4 mb-6 sm:mt-8 sm:mb-8 md:mt-6 md:mb-6 lg:mt-8 lg:mb-8 text-center mx-auto">
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-poppins tracking-widest text-white font-bold">
            {t("brand")}
          </h1>
          <h2 className="font-gilroy font-light text-snow opacity-95 text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight tracking-normal text-center w-[80%] lg:w-full mx-auto mt-4">
            {t("headline")}
          </h2>
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <div className="flex justify-center items-center">
            <Link
              href="/our-property"
              className="group relative overflow-hidden rounded-full bg-white text-[#7e6725] px-8 py-4 shadow-lg shadow-black/20 transform transition-all duration-300 hover:scale-[1.05] hover:shadow-xl hover:shadow-black/30 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white/50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-[#7e6725]/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 text-[14px] pl-[15px] pr-[15px] pt-[4px] pb-[4px] font-bold"
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
