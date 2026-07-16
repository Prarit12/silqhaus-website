const WP_API_URL = process.env.WP_API_URL;
const WP_SITE_ID = process.env.WP_SITE_ID;

export const getPosts = async () => {
  try {
    const url = `${WP_API_URL}/sites/${WP_SITE_ID}/posts/?order_by=date&number=100`;
    const wpRes = await fetch(url, { method: "GET" });

    if (!wpRes.ok) {
      console.log(
        "Failed to fetch posts from WP:",
        wpRes.status,
        wpRes.statusText,
      );
      const text = await wpRes.text();
      return {
        error: "WordPress get posts API error",
        details: text.slice(0, 400),
        status: wpRes.status,
      };
    }

    const json = await wpRes.json();
    const posts = Array.isArray(json?.posts) ? json.posts : [];

    const published = posts.map((p) => ({
      author: p?.author?.name ?? null,
      date: p?.modified ?? null,
      title: p?.title ?? null,
      slug: p?.slug ? decodeURIComponent(p.slug) : null,
      excerpt: p?.excerpt ?? null,
      feature_image: p?.featured_image ?? null,
      post_thumbnail: p?.post_thumbnail ?? null,
      content: p?.content ?? null,
    }));

    console.log(`Fetched ${published.length} published posts from WP.`);
    return { posts: published };
  } catch (error) {
    console.error("WP posts route failed:", error);
    return { error: "Error getting posts from Wordpress.", status: 500 };
  }
};
