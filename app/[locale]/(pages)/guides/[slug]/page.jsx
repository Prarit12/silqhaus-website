import { getPosts } from "@/lib/wordpress/blogs";
import BlogPostClient from "./blog-post-client";

const stripHtml = (s = "") => s.replace(/<[^>]*>/g, "");
const decodeEntities = (s = "") => {
  return s
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(num))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ");
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.silqhaus.com";

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const result = await getPosts();
  const posts = result.posts || [];
  const post = posts.find((p) => p.slug === decodedSlug);

  if (!post) {
    return {
      title: "Guide Not Found | Silqhaus",
      description: "The requested guide could not be found.",
    };
  }

  const title = decodeEntities(stripHtml(post.title || "Blog"));
  const excerpt = decodeEntities(stripHtml(post.excerpt || "")).slice(0, 160);
  const image = post.feature_image || post.post_thumbnail?.URL || "";

  return {
    title: `${title} | Silqhaus Guides`,
    description: excerpt,
    openGraph: {
      title: title,
      description: excerpt,
      url: `${baseUrl}/${locale}/guides/${decodedSlug}`,
      siteName: "Silqhaus",
      locale: locale === "th" ? "th_TH" : "en_US",
      type: "article",
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: excerpt,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: `${baseUrl}/en/guides/${decodedSlug}`,
      languages: {
        en: `${baseUrl}/en/guides/${decodedSlug}`,
        th: `${baseUrl}/th/guides/${decodedSlug}`,
        "x-default": `${baseUrl}/en/guides/${decodedSlug}`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function GuidePostPage({ params }) {
  const { slug, locale } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const result = await getPosts();
  const posts = result.posts || [];
  const post = posts.find((p) => p.slug === decodedSlug);

  const toDateOnly = (iso) => (iso ? iso.slice(0, 10) : "");
  const pubDate = toDateOnly(post?.date);
  const modDate = toDateOnly(post?.modified) || pubDate;

  const articleJsonLd = post
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: decodeEntities(stripHtml(post.title || "")),
        description: decodeEntities(stripHtml(post.excerpt || ""))
          .slice(0, 160)
          .trim(),
        image: post.feature_image || post.post_thumbnail?.URL || "",
        datePublished: pubDate,
        dateModified: modDate,
        author: {
          "@type": "Organization",
          name: "Silqhaus",
          url: "https://www.silqhaus.com",
        },
        publisher: {
          "@type": "Organization",
          name: "Silqhaus",
          url: "https://www.silqhaus.com",
          logo: {
            "@type": "ImageObject",
            url: "https://www.silqhaus.com/logos/silqhaus-logo-navigation.png",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${baseUrl}/${locale}/guides/${decodedSlug}`,
        },
      }
    : null;

  const postTitle = post
    ? decodeEntities(stripHtml(post.title || ""))
    : "Guide";
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
        name: "Guides",
        item: `${baseUrl}/${locale}/guides`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: postTitle,
      },
    ],
  };

  return (
    <>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogPostClient slug={decodedSlug} initialPost={post} />
    </>
  );
}
