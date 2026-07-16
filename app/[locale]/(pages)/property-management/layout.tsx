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
    namespace: "propertyManagement.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}/property-management`,
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
      canonical: `${baseUrl}/${locale}/property-management`,
      languages: {
        en: `${baseUrl}/en/property-management`,
        th: `${baseUrl}/th/property-management`,
        "x-default": `${baseUrl}/en/property-management`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PropertyManagementLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const serviceDescription =
    locale === "th"
      ? "บริการจัดการอสังหาริมทรัพย์ให้เช่าระดับพรีเมียมในภูเก็ตและพัทยา ประเทศไทย รวมถึงการเพิ่มประสิทธิภาพรายได้ การดูแลบ้าน บริการแขก และการตลาดดิจิทัล"
      : "Premium vacation rental property management services in Phuket and Pattaya, Thailand. Including revenue optimization, housekeeping, guest services, and digital marketing.";

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Vacation Rental Property Management",
    provider: {
      "@type": "Organization",
      "@id": "https://www.silqhaus.com/#organization",
      name: "Silqhaus",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Phuket",
      },
      {
        "@type": "City",
        name: "Pattaya",
      },
    ],
    description: serviceDescription,
    url: `${baseUrl}/${locale}/property-management`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Property Management Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Revenue Management",
            description: "Dynamic pricing and revenue optimization",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Housekeeping",
            description: "Professional in-house cleaning and maintenance",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Guest Services",
            description: "24/7 guest communication and concierge",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Property Marketing",
            description: "Multi-channel listing and digital marketing",
          },
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {children}
    </>
  );
}
