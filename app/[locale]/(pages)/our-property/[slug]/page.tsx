import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getHostAwayListingById } from "@/lib/hostaway/listings";
import { getGuestyListingById } from "@/lib/guesty/listings";
import {
  parseSlugAndId,
  createPropertySlug,
  detectListingSource,
} from "@/lib/slugify";
import { Suspense, cache } from "react";
import PropertyDetails from "./property-client";

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface PropertyLike {
  id: number | string;
  name: string;
  description?: string;
  city?: string;
  state?: string;
  countryCode?: string;
  personCapacity?: number;
  bedroomsNumber?: number;
  bathroomsNumber?: number;
  listingImages?: Array<{ url: string; caption?: string | null }>;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

const getPropertyById = cache(
  async (
    slug: string,
  ): Promise<{
    id: string;
    listing: PropertyLike;
    source: "hostaway" | "guesty";
  } | null> => {
    const parsed = parseSlugAndId(slug);
    const id = parsed?.id || slug;
    const primary = detectListingSource(id);

    const tryHostaway = async () => {
      try {
        const response = await getHostAwayListingById(id);
        if (!response?.result) return null;
        const r = response.result as PropertyLike;
        return { id, listing: r, source: "hostaway" as const };
      } catch {
        return null;
      }
    };

    const tryGuesty = async () => {
      try {
        const listing = await getGuestyListingById(id);
        if (!listing) return null;
        const p: PropertyLike = listing;
        return { id, listing: p, source: "guesty" as const };
      } catch {
        return null;
      }
    };

    if (primary === "guesty") {
      return (await tryGuesty()) || (await tryHostaway());
    }
    return (await tryHostaway()) || (await tryGuesty());
  },
);

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.silqhaus.com";
  const t = await getTranslations({
    locale,
    namespace: "propertyDetail.metadata",
  });

  const data = await getPropertyById(slug);
  if (!data) {
    return {
      title: t("notFoundTitle"),
      description: t("notFoundDescription"),
    };
  }

  const { listing } = data;
  const canonicalSlug = createPropertySlug(listing.name, listing.id);

  const propertyName = listing.name || t("fallbackName");
  const location = [listing.city, listing.state].filter(Boolean).join(", ");
  const locationText = location ? t("inLocation", { location }) : "";

  const rawDescription = listing.description || "";
  const cleanDescription = stripHtml(rawDescription);
  const shortDescription = truncateText(cleanDescription, 155);

  const features: string[] = [];
  if (listing.bedroomsNumber)
    features.push(t("bedrooms", { count: listing.bedroomsNumber }));
  if (listing.bathroomsNumber)
    features.push(t("bathrooms", { count: listing.bathroomsNumber }));
  if (listing.personCapacity)
    features.push(t("sleeps", { count: listing.personCapacity }));
  const featuresText = features.length > 0 ? ` - ${features.join(", ")}` : "";

  const title = t("titleTemplate", {
    name: propertyName,
    location: locationText,
  });
  const description =
    locale === "th"
      ? t("descriptionFallback", {
          name: propertyName,
          location: locationText,
          features: featuresText,
        })
      : shortDescription ||
        t("descriptionFallback", {
          name: propertyName,
          location: locationText,
          features: featuresText,
        });

  const firstImage = listing.listingImages?.[0]?.url;
  const images = firstImage
    ? [{ url: firstImage, width: 1200, height: 630, alt: propertyName }]
    : [];

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/our-property/${canonicalSlug}`,
      siteName: "Silqhaus",
      images,
      locale: locale === "th" ? "th_TH" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: firstImage ? [firstImage] : [],
    },
    alternates: {
      canonical: `${baseUrl}/en/our-property/${canonicalSlug}`,
      languages: {
        en: `${baseUrl}/en/our-property/${canonicalSlug}`,
        "x-default": `${baseUrl}/en/our-property/${canonicalSlug}`,
      },
    },
  };
}

export default async function PropertyPage({
  params,
  searchParams,
}: PageProps) {
  const { slug, locale } = await params;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations({
    locale,
    namespace: "propertyDetail.metadata",
  });

  const data = await getPropertyById(slug);
  if (!data) {
    notFound();
  }

  const { id, listing, source } = data;
  const canonicalSlug = createPropertySlug(listing.name, listing.id);

  if (slug !== canonicalSlug) {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(resolvedSearchParams)) {
      if (value) {
        const v = Array.isArray(value) ? value[0] : value;
        if (v) qs.set(key, v);
      }
    }
    const qsStr = qs.toString();
    redirect(
      `/${locale}/our-property/${canonicalSlug}${qsStr ? `?${qsStr}` : ""}`,
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.silqhaus.com";
  const propertyImages = (listing.listingImages || [])
    .slice(0, 5)
    .map((img) => img.url);
  const propertyName = listing.name || t("fallbackName");
  const location = [listing.city, listing.state].filter(Boolean).join(", ");
  const locationText = location ? t("inLocation", { location }) : "";
  const features: string[] = [];
  if (listing.bedroomsNumber)
    features.push(t("bedrooms", { count: listing.bedroomsNumber }));
  if (listing.bathroomsNumber)
    features.push(t("bathrooms", { count: listing.bathroomsNumber }));
  if (listing.personCapacity)
    features.push(t("sleeps", { count: listing.personCapacity }));
  const featuresText = features.length > 0 ? ` - ${features.join(", ")}` : "";

  const jsonLdDescription =
    locale === "th"
      ? t("descriptionFallback", {
          name: propertyName,
          location: locationText,
          features: featuresText,
        })
      : stripHtml(listing.description || "") ||
        t("descriptionFallback", {
          name: propertyName,
          location: locationText,
          features: featuresText,
        });

  const propertySchema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: listing.name || t("fallbackName"),
    description: jsonLdDescription,
    url: `${baseUrl}/${locale}/our-property/${canonicalSlug}`,
    image: propertyImages,
    address: {
      "@type": "PostalAddress",
      addressLocality: listing.city || "",
      addressRegion: listing.state || "",
      addressCountry: listing.countryCode || "",
    },
    numberOfRooms: listing.bedroomsNumber || 0,
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Bedrooms",
        value: listing.bedroomsNumber || 0,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Bathrooms",
        value: listing.bathroomsNumber || 0,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Max Guests",
        value: listing.personCapacity || 0,
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("breadcrumbHome"),
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumbProperties"),
        item: `${baseUrl}/${locale}/our-property`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: listing.name || t("fallbackName"),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Suspense fallback={null}>
        <PropertyDetails
          propertyId={id}
          source={source}
          initialListing={listing}
        />
      </Suspense>
    </>
  );
}
