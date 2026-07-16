import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.silqhaus.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "ourProperty.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}/our-property`,
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
      canonical: `${baseUrl}/${locale}/our-property`,
      languages: {
        en: `${baseUrl}/en/our-property`,
        th: `${baseUrl}/th/our-property`,
        "x-default": `${baseUrl}/en/our-property`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function OurPropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
