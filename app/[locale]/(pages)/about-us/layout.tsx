import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.silqhaus.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutUs.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}/about-us`,
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
      canonical: `${baseUrl}/${locale}/about-us`,
      languages: {
        en: `${baseUrl}/en/about-us`,
        th: `${baseUrl}/th/about-us`,
        "x-default": `${baseUrl}/en/about-us`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
