export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseSlugAndId(
  slug: string,
): { slug: string; id: string } | null {
  const hexMatch = slug.match(/^(.+)-([a-f0-9]{24})$/i);
  if (hexMatch) return { slug: hexMatch[1], id: hexMatch[2] };
  const numMatch = slug.match(/^(.+)-(\d+)$/);
  if (numMatch) return { slug: numMatch[1], id: numMatch[2] };
  return null;
}

export function detectListingSource(id: string): "guesty" | "hostaway" {
  return /^[a-f0-9]{24}$/i.test(id) ? "guesty" : "hostaway";
}

export function createPropertySlug(name: string, id: number | string): string {
  return `${slugify(name)}-${id}`;
}
