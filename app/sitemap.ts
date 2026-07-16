import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/wordpress/blogs";
import { getHostAwayListings } from "@/lib/hostaway/listings";
import { createPropertySlug } from "@/lib/slugify";

const locales = ["en", "th"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.silqhaus.com";

  const staticPages = [
    { url: "", priority: 1.0 },
    { url: "/about-us", priority: 0.8 },
    { url: "/our-property", priority: 0.9 },
    { url: "/guides", priority: 0.8 },
    { url: "/experiences", priority: 0.7 },
    { url: "/destination", priority: 0.7 },
    { url: "/destination/phuket", priority: 0.7 },
    { url: "/destination/pattaya", priority: 0.7 },
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
    const listingsResponse = await getHostAwayListings();
    const listings = listingsResponse?.result || [];

    propertyEntries = listings.map(
      (listing: { id: number | string; name: string }) => {
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
      },
    );
  } catch (error) {
    console.error("Failed to fetch property listings for sitemap:", error);
  }

  return [...staticEntries, ...propertyEntries, ...blogEntries];
}
