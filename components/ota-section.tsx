import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { OTAReviews } from "@/components/ota-reviews";
import OtaRatingsRow from "@/components/ota-ratings-row";

export function OTASection() {
  const t = useTranslations("home.ota");

  return (
    <section className="relative py-20 sm:py-24 bg-ink-2 overflow-hidden">
      {/* Faint starfield texture, vignetted toward the edges */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.13) 1px, transparent 1.4px)",
          backgroundSize: "30px 30px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 35%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 35%, black, transparent)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Statement */}
        <h2 className="font-display text-center text-4xl sm:text-5xl md:text-[3.4rem] font-light text-white leading-[1.08] tracking-tight normal-case text-balance">
          {t("headlineB")}
        </h2>

        {/* Platform trust strip */}
        <div className="mt-12 sm:mt-14">
          <OtaRatingsRow />
        </div>

        {/* Live guest reviews — center-focused carousel */}
        <OTAReviews />

        {/* Direct-booking closer */}
        <p className="mt-12 sm:mt-14 text-center text-white/60 text-xl sm:text-2xl font-light leading-relaxed text-balance">
          {t("butIts")}{" "}
          <strong className="font-bold text-white">{t("cheaper")}</strong>{" "}
          {t("to")}{" "}
          <Link
            href="/our-property"
            className="text-white font-medium underline decoration-white/40 underline-offset-8 transition-colors hover:decoration-white"
          >
            {t("bookDirectly")}
          </Link>
        </p>
      </div>
    </section>
  );
}
