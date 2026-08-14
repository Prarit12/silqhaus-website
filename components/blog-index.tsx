"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string | null;
};

function useDateFormatter() {
  const locale = useLocale();
  return useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-US", {
        dateStyle: "long",
      }),
    [locale],
  );
}

function Thumb({ src, alt }: { src: string; alt: string }) {
  if (!src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white/[0.04]">
        <span className="font-display text-white/20 text-lg font-light">
          Silqhaus
        </span>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, 33vw"
      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
    />
  );
}

const PAGE_SIZE = 9;

export default function BlogIndex({ posts }: { posts: BlogPost[] }) {
  const t = useTranslations("guidesPage");
  const fmt = useDateFormatter();
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const formatDate = (d: string | null) => {
    if (!d) return "";
    const parsed = new Date(d);
    return Number.isNaN(parsed.getTime()) ? "" : fmt.format(parsed);
  };

  const q = query.trim().toLowerCase();
  const filtered = q
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q),
      )
    : posts;

  const featured = posts.slice(0, 3);
  const latest = posts.slice(3, 7);

  return (
    <div className="min-h-screen bg-ink">
      {/* Hero — chip, title, search */}
      <section className="pt-36 sm:pt-44 pb-14 sm:pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex rounded-full border border-line px-4 py-1.5 text-xs font-medium tracking-[0.14em] uppercase text-white/70">
            {t("chip")}
          </span>
          <h1 className="font-display text-white text-4xl sm:text-5xl md:text-6xl font-light leading-[1.06] tracking-tight normal-case text-balance mt-7">
            {t.rich("title", {
              b: (chunks) => <strong className="font-bold">{chunks}</strong>,
            })}
          </h1>
          <p className="text-white/60 mt-6 text-lg leading-relaxed">
            {t("description")}
          </p>

          <form
            className="mt-9 flex items-center gap-3 max-w-xl mx-auto"
            onSubmit={(e) => e.preventDefault()}
            role="search"
          >
            <label className="relative flex-1">
              <span className="sr-only">{t("searchPlaceholder")}</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                placeholder={t("searchPlaceholder")}
                className="w-full rounded-full border border-line bg-white/[0.04] pl-11 pr-5 py-3.5 text-sm text-white placeholder:text-white/45 outline-none transition-colors focus:border-white/40"
              />
            </label>
            <button
              type="submit"
              className="shrink-0 rounded-full bg-white text-ink px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-neutral-200"
            >
              {t("searchCta")}
            </button>
          </form>
        </div>
      </section>

      {/* Articles + sidebar */}
      <section className="pb-24 sm:pb-28">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-x-14 gap-y-16">
            {/* Main column */}
            <div>
              <div className="flex items-center gap-5 mb-8">
                <h2 className="shrink-0 text-white font-semibold text-2xl tracking-tight">
                  {q ? t("results") : t("allStories")}
                </h2>
                <span className="h-px flex-1 bg-line" aria-hidden="true" />
              </div>

              {filtered.length === 0 ? (
                <p className="text-white/55 py-16 text-center">
                  {posts.length === 0 ? t("noPosts") : t("noResults")}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.slice(0, visibleCount).map((p) => (
                    <Link
                      key={p.slug}
                      href={`/guides/${p.slug}`}
                      className="group relative aspect-[3/4] rounded-2xl overflow-hidden ring-1 ring-line"
                    >
                      <Thumb src={p.image} alt={p.title} />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/5"
                        aria-hidden="true"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-5">
                        {p.date && (
                          <span className="inline-flex rounded-full border border-white/25 bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white/85 backdrop-blur-sm">
                            {formatDate(p.date)}
                          </span>
                        )}
                        <h3 className="text-white font-semibold text-lg leading-snug tracking-tight mt-3 text-balance">
                          {p.title}
                        </h3>
                        {p.excerpt && (
                          <p className="text-white/65 text-sm mt-2 leading-relaxed line-clamp-3">
                            {p.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {filtered.length > visibleCount && (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="rounded-full border border-line bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink"
                  >
                    {t("seeMore")}
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            {posts.length > 0 && (
              <aside className="space-y-12">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="shrink-0 text-white font-semibold text-xl tracking-tight">
                      {t("featured")}
                    </h2>
                    <span className="h-px flex-1 bg-line" aria-hidden="true" />
                  </div>
                  <div className="space-y-6">
                    {featured.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/guides/${p.slug}`}
                        className="group flex items-start gap-4"
                      >
                        <span className="relative w-[72px] h-[72px] shrink-0 rounded-xl overflow-hidden ring-1 ring-line">
                          <Thumb src={p.image} alt="" />
                        </span>
                        <span>
                          {p.date && (
                            <span className="block text-white/45 text-xs">
                              {formatDate(p.date)}
                            </span>
                          )}
                          <span className="block text-white font-semibold text-sm leading-snug mt-1.5 line-clamp-3 transition-colors group-hover:text-white/80">
                            {p.title}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {latest.length > 0 && (
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="shrink-0 text-white font-semibold text-xl tracking-tight">
                        {t("latest")}
                      </h2>
                      <span className="h-px flex-1 bg-line" aria-hidden="true" />
                    </div>
                    <div className="space-y-6">
                      {latest.map((p) => (
                        <Link
                          key={p.slug}
                          href={`/guides/${p.slug}`}
                          className="group flex items-start gap-4"
                        >
                          <span className="relative w-[72px] h-[72px] shrink-0 rounded-xl overflow-hidden ring-1 ring-line">
                            <Thumb src={p.image} alt="" />
                          </span>
                          <span>
                            {p.date && (
                              <span className="block text-white/45 text-xs">
                                {formatDate(p.date)}
                              </span>
                            )}
                            <span className="block text-white font-semibold text-sm leading-snug mt-1.5 line-clamp-3 transition-colors group-hover:text-white/80">
                              {p.title}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
