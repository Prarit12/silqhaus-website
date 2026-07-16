import BlogCard from "@/components/blog-card";
import { getPosts } from "@/lib/wordpress/blogs";
import { getTranslations } from "next-intl/server";

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

export default async function Guides() {
  const t = await getTranslations("guidesPage");
  const result = await getPosts();
  const posts = result.posts || [];

  return (
    <div className="min-h-screen bg-black">
      <section className="pt-40 pb-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase">
              {t("title")}
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto font-light">
              {t("description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.length === 0 ? (
              <div className="col-span-full text-center text-bronze/70">
                {t("noPosts")}
              </div>
            ) : (
              posts.map((post) => (
                <BlogCard
                  key={post.slug}
                  imageSrc={imageFor(post)}
                  imgAltText={titleFor(post)}
                  title={titleFor(post)}
                  href={`/guides/${post.slug}`}
                  excerpt={excerptFor(post)}
                  date={post.date}
                  readNowText={t("readNow")}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
