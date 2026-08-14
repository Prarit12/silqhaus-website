import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/wordpress/blogs";
import { getAllVacationListings } from "@/lib/destinations";
import { createPropertySlug } from "@/lib/slugify";
import { DESTINATION_REGIONS } from "@/config/destination-regions";
import { EXPERIENCE_REGIONS } from "@/config/experience-regions";
import { fetchListings, type PMSListingType } from "@/lib/silqhaus-pms/listings";

const locales = ["en", "th"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.silqhaus.com";

  const staticPages = [
    { url: "", priority: 1.0 },
    { url: "/about-us", priority: 0.8 },
    { url: "/our-story", priority: 0.5 },
    { url: "/our-property", priority: 0.9 },
    { url: "/properties-for-rent", priority: 0.8 },
    { url: "/properties-for-sale", priority: 0.8 },
    { url: "/guides", priority: 0.8 },
    { url: "/experiences", priority: 0.7 },
    ...EXPERIENCE_REGIONS.filter((r) => r.hasGuide).map((r) => ({
      url: `/experiences/${r.key}`,
      priority: 0.7,
    })),
    { url: "/destination", priority: 0.7 },
    ...DESTINATION_REGIONS.map((r) => ({
      url: `/destination/${r.key}`,
      priority: 0.7,
    })),
    { url: "/property-management", priority: 0.7 },
    { url: "/contact-us", priority: 0.6 },
    { url: "/terms-of-use", priority: 0.3 },
    { url: "/privacy-policy", priority: 0.3 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${page.url}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}${page.url}`]),
        ),
      },
    })),
  );

  let blogEntries: MetadataRoute.Sitemap = [];
  let propertyEntries: MetadataRoute.Sitemap = [];
  let pmsEntries: MetadataRoute.Sitemap = [];

  try {
    const result = await getPosts();
    const posts = result.posts || [];

    blogEntries = posts.map(
      (post: { slug: string; modified?: string; date?: string }) => ({
        url: `${baseUrl}/en/guides/${post.slug}`,
        lastModified: new Date(post.modified || post.date || new Date()),
        changeFrequency: "monthly" as const,
        priority: 0.6,
        alternates: {
          languages: {
            en: `${baseUrl}/en/guides/${post.slug}`,
            "x-default": `${baseUrl}/en/guides/${post.slug}`,
          },
        },
      }),
    );
  } catch (error) {
    console.error("Failed to fetch blog posts for sitemap:", error);
  }

  try {
    // Hostaway + Guesty merged — the same inventory the site renders.
    const listings = await getAllVacationListings();

    propertyEntries = listings.map((listing) => {
      const slug = createPropertySlug(listing.name, listing.id);
      return {
        url: `${baseUrl}/en/our-property/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.85,
        alternates: {
          languages: {
            en: `${baseUrl}/en/our-property/${slug}`,
            "x-default": `${baseUrl}/en/our-property/${slug}`,
          },
        },
      };
    });
  } catch (error) {
    console.error("Failed to fetch property listings for sitemap:", error);
  }

  const pmsSurfaces: Array<{ type: PMSListingType; basePath: string }> = [
    { type: "RENT", basePath: "properties-for-rent" },
    { type: "SALE", basePath: "properties-for-sale" },
  ];
  for (const surface of pmsSurfaces) {
    try {
      const seen = new Set<string>();
      let page = 1;
      let totalPages = 1;
      do {
        const res = await fetchListings({
          type: surface.type,
          page,
          pageSize: 50,
        });
        totalPages = res.pagination?.totalPages ?? 1;
        for (const listing of res.data || []) {
          if (!listing.slug || seen.has(listing.slug)) continue;
          seen.add(listing.slug);
          const url = `${baseUrl}/en/${surface.basePath}/${listing.slug}`;
          pmsEntries.push({
            url,
            lastModified: new Date(
              listing.updatedAt || listing.publishedAt || Date.now(),
            ),
            changeFrequency: "weekly" as const,
            priority: 0.7,
            alternates: {
              languages: { en: url, "x-default": url },
            },
          });
        }
        page++;
      } while (page <= totalPages && page <= 10);
    } catch (error) {
      console.error(
        `Failed to fetch ${surface.type} PMS listings for sitemap:`,
        error,
      );
    }
  }

  return [...staticEntries, ...propertyEntries, ...pmsEntries, ...blogEntries];
}
