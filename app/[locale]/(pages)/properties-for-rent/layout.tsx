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
    namespace: "propertiesForRent.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}/properties-for-rent`,
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
      canonical: `${baseUrl}/${locale}/properties-for-rent`,
      languages: {
        en: `${baseUrl}/en/properties-for-rent`,
        th: `${baseUrl}/th/properties-for-rent`,
        "x-default": `${baseUrl}/en/properties-for-rent`,
      },
    },
    robots: { index: true, follow: true },
  };
}

export default function PropertiesForRentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
