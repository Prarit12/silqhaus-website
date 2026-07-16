"use client";

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
const fmtDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d)
    ? iso
    : d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

export default function BlogPostClient({ slug, initialPost }) {
  const post = initialPost;

  if (!post) {
    return (
      <div className="min-h-screen bg-ivory">
        <div className="max-w-3xl mx-auto p-8 text-bronze/70">
          Post not found.
        </div>
      </div>
    );
  }

  const title = decodeEntities(stripHtml(post.title || ""));
  const date = post.date;
  const img = post.feature_image || post?.post_thumbnail?.URL || "";

  return (
    <div className="min-h-screen bg-ivory">
      {img ? (
        <div className="max-w-7xl mx-auto overflow-hidden">
          <img
            src={img}
            alt={title || "Blog image"}
            className="w-full h-72 md:h-96 object-cover"
          />
        </div>
      ) : null}

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-bronze mb-3">
          {title}
        </h1>
        {date && (
          <div className="text-sm text-bronze/60 mb-8">
            <time dateTime={date}>{fmtDate(date)}</time>
          </div>
        )}

        <article
          className="prose prose-lg max-w-none prose-headings:text-bronze prose-a:text-bronze"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />
      </main>
    </div>
  );
}
