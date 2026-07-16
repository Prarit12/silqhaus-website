import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  fetchListing,
  fetchSimilarListings,
} from "@/lib/silqhaus-pms/listings";
import { PMSPropertyDetail } from "@/components/pms-property-detail";
import { PMSDetailError } from "@/components/pms-detail-error";

function isUpstreamNotFound(err: unknown): boolean {
  return err instanceof Error && /\b404\b|not found/i.test(err.message);
}

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.silqhaus.com";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "pmsPropertyDetail",
  });
  try {
    const listing = await fetchListing(slug);
    if (!listing.listingType?.includes("RENT")) {
      return {
        title: t("notFound"),
        robots: { index: false, follow: false },
      };
    }
    const location = [listing.city, listing.state].filter(Boolean).join(", ");
    const title = `${listing.title}${location ? ` — ${location}` : ""} | Silqhaus`;
    const tList = await getTranslations({
      locale,
      namespace: "propertiesForRent.metadata",
    });
    const description =
      (listing.description || "").replace(/\s+/g, " ").slice(0, 155) ||
      tList("description");
    return {
      title,
      description,
      alternates: {
        canonical: `${baseUrl}/${locale}/properties-for-rent/${listing.slug}`,
      },
      openGraph: {
        title,
        description,
        type: "website",
      },
    };
  } catch {
    return {
      title: t("notFound"),
      robots: { index: false, follow: false },
    };
  }
}

export default async function PropertyForRentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let listing;
  try {
    listing = await fetchListing(slug);
  } catch (err) {
    if (isUpstreamNotFound(err)) {
      notFound();
    }
    return <PMSDetailError basePath="properties-for-rent" />;
  }
  if (!listing || !listing.listingType?.includes("RENT")) {
    notFound();
  }
  let similarListings: (typeof listing)[] = [];
  try {
    similarListings = await fetchSimilarListings(listing.id, listing);
  } catch (err) {
    console.error("[silqhaus-pms] similar listings error:", err);
  }
  return (
    <PMSPropertyDetail
      listing={listing}
      basePath="properties-for-rent"
      similarListings={similarListings}
    />
  );
}
