import BlogIndex from "@/components/blog-index";
import { getPosts } from "@/lib/wordpress/blogs";

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

const titleFor = (p) => decodeEntities(stripHtml(p?.title || "Blog"));
const excerptFor = (p, maxWords = 28) => {
  const text = decodeEntities(stripHtml(p?.excerpt || ""));
  const words = text.trim().split(/\s+/);
  return words.length > maxWords
    ? words.slice(0, maxWords).join(" ") + "…"
    : text;
};
const imageFor = (p) => p?.feature_image || p?.post_thumbnail?.URL || "";

export default async function Blog() {
  const result = await getPosts();
  const posts = (result.posts || [])
    .filter((p) => p?.slug)
    .map((p) => ({
      slug: p.slug,
      title: titleFor(p),
      excerpt: excerptFor(p),
      image: imageFor(p),
      date: p.date ?? null,
    }));

  return <BlogIndex posts={posts} />;
}
