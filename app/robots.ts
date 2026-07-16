import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://silqhaus.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/guest-login/", "/favorites/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
