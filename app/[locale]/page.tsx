import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import HeroSection from "@/components/hero-section";
import BookDirectBanner from "@/components/book-direct-banner";
import GuestFavorites from "@/components/guest-favorites";
import DestinationCovers from "@/components/destination-covers";
import WhySilqhaus from "@/components/why-silqhaus";
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
        <BookDirectBanner />
        <GuestFavorites />
        <DestinationCovers />
        <WhySilqhaus />
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
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/40" />
          <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div className="mb-7 flex justify-center">
              <span className="eyebrow eyebrow--center">{t("subtitle")}</span>
            </div>
            <h2 className="font-display font-light text-white mb-7 text-4xl sm:text-5xl md:text-6xl leading-[1.08] tracking-tight normal-case">
              {t("title")}
            </h2>
            <p className="text-base sm:text-lg text-snow/70 mb-10 md:mb-12 font-poppins font-light max-w-2xl mx-auto leading-relaxed">
              {t("descriptionPart1")}{" "}
              <span className="text-champagne">
                {t("descriptionHighlight1")}
              </span>{" "}
              {t("descriptionPart2")}{" "}
              <span className="text-champagne">
                {t("descriptionHighlight2")}
              </span>{" "}
              {t("descriptionPart3")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/our-property" className="btn-lux-solid">
                {t("button")}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
