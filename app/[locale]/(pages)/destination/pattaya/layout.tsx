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
    namespace: "destination.pattaya.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}/destination/pattaya`,
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
      canonical: `${baseUrl}/${locale}/destination/pattaya`,
      languages: {
        en: `${baseUrl}/en/destination/pattaya`,
        th: `${baseUrl}/th/destination/pattaya`,
        "x-default": `${baseUrl}/en/destination/pattaya`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PattayaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "destination.pattaya" });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("faqs.q1"),
        acceptedAnswer: { "@type": "Answer", text: t("faqs.a1") },
      },
      {
        "@type": "Question",
        name: t("faqs.q2"),
        acceptedAnswer: { "@type": "Answer", text: t("faqs.a2") },
      },
      {
        "@type": "Question",
        name: t("faqs.q3"),
        acceptedAnswer: { "@type": "Answer", text: t("faqs.a3") },
      },
      {
        "@type": "Question",
        name: t("faqs.q4"),
        acceptedAnswer: { "@type": "Answer", text: t("faqs.a4") },
      },
    ],
  };

  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: "Pattaya, Thailand",
    description: t("metadata.description"),
    geo: {
      "@type": "GeoCoordinates",
      latitude: 12.9236,
      longitude: 100.8825,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pattaya",
      addressCountry: "TH",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Destinations",
        item: `${baseUrl}/${locale}/destination`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Pattaya",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
