export interface BlogPost {
  author: string | null;
  date: string | null;
  title: string | null;
  slug: string | null;
  excerpt: string | null;
  feature_image: string | null;
  post_thumbnail: {
    URL: string;
    width: number;
    height: number;
  } | null;
  content: string | null;
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const response = await fetch("/api/wordpress/posts");
  if (!response.ok) {
    throw new Error("Failed to fetch blog posts");
  }
  return response.json();
}

export async function fetchBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const posts = await fetchBlogPosts();
  return posts.find((post) => post.slug === slug) || null;
}
