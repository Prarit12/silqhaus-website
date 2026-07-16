import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import HeroSection from "@/components/hero-section";
import DestinationCovers from "@/components/destination-covers";
import PopularLocations from "@/components/popular-locations";
import { OTASection } from "@/components/ota-section";
// import newsletter from "@/components/newsletter";
// import Newsletter from "@/components/newsletter";
// import NewsletterSection from "@/components/newsletter";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.silqhaus.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.metadata" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}`,
      siteName: "Silqhaus",
      locale: locale === "th" ? "th_TH" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        th: `${baseUrl}/th`,
        "x-default": `${baseUrl}/en`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home.cta" });

  return (
    <>
      <div className="min-h-screen bg-[#0d0d0d00]">
        <HeroSection />
        <OTASection />
        <DestinationCovers />
        <PopularLocations />
        {/* <NewsletterSection /> */}
        {/* CTA Banner */}
        <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/cta-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div className="mb-6 sm:mb-8">
              <p className="text-brand-warm text-xs sm:text-sm font-poppins font-light tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-4">
                {t("subtitle")}
              </p>
            </div>
            <h2 className="font-gilroy font-bold text-white mb-6 sm:mb-8 text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight">
              {t("title")}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-brand-light/90 mb-8 sm:mb-10 md:mb-12 font-poppins font-light max-w-3xl mx-auto px-2 sm:px-4 md:px-8 lg:px-12">
              {t("descriptionPart1")}{" "}
              <span className="font-semibold">
                {t("descriptionHighlight1")}
              </span>{" "}
              {t("descriptionPart2")}{" "}
              <span className="font-semibold">
                {t("descriptionHighlight2")}
              </span>{" "}
              {t("descriptionPart3")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/our-property"
                className="btn-primary btn-xl text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5"
              >
                {t("button")}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
