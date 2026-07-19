import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  EXPERIENCE_CATEGORIES,
  EXPERIENCE_REGIONS,
} from "@/config/experience-regions";

/** Per-region mosaic placement — editorial, not a uniform grid. */
const MOSAIC: Record<string, string> = {
  bangkok: "lg:col-span-7 h-[340px] sm:h-[360px] lg:h-[440px]",
  phuket: "lg:col-span-5 h-[340px] sm:h-[360px] lg:h-[440px]",
  chiangmai: "lg:col-span-5 h-[340px] sm:h-[360px] lg:h-[400px]",
  samui: "lg:col-span-7 h-[340px] sm:h-[360px] lg:h-[400px]",
  pattaya: "lg:col-span-6 h-[340px] sm:h-[360px] lg:h-[360px]",
  huahin: "lg:col-span-6 h-[340px] sm:h-[360px] lg:h-[360px]",
};

export default async function Experiences() {
  const t = await getTranslations("experiences");

  return (
    <main className="min-h-screen bg-ink">
      {/* ── Hero — Thailand, full bleed ── */}
      <section className="relative h-[82vh] min-h-[540px] flex items-end overflow-hidden">
        <Image
          src="/experiences/hero.jpg"
          alt={t("hero.heroAlt")}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink via-black/35 to-black/20"
          aria-hidden="true"
        />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24">
          <h1 className="font-display text-white text-5xl sm:text-6xl md:text-7xl font-light leading-[1.02] tracking-tight normal-case text-balance max-w-3xl">
            {t.rich("hero.title", {
              b: (chunks) => <strong className="font-bold">{chunks}</strong>,
            })}
          </h1>
          <p className="text-white/80 mt-6 text-lg sm:text-xl leading-relaxed max-w-2xl">
            {t("hero.description")}
          </p>
        </div>
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce z-10"
          aria-hidden="true"
        >
          <ChevronDown className="w-5 h-5 text-white/80" />
        </div>
      </section>

      {/* ── Thailand at a glance ── */}
      <section className="py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-display text-white/60 text-2xl sm:text-3xl md:text-[2.1rem] font-light leading-[1.35] tracking-tight text-balance">
            {t.rich("glance.statement", {
              b: (chunks) => (
                <strong className="font-normal text-white">{chunks}</strong>
              ),
            })}
          </p>
        </div>
      </section>

      {/* ── The six regions ── */}
      <section className="pb-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 mb-10 sm:mb-12">
            <h2 className="font-display text-white text-4xl sm:text-5xl font-light leading-[1.05] tracking-tight normal-case text-balance">
              {t("regions.title")}
            </h2>
            <p className="text-white/55 max-w-md text-base leading-relaxed">
              {t("regions.intro")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
            {EXPERIENCE_REGIONS.map((r) => {
              const card = (
                <>
                  <Image
                    src={r.img}
                    alt={t(`regions.items.${r.key}.name`)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 58vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5"
                    aria-hidden="true"
                  />
                  <span
                    className={`absolute top-4 right-4 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm ${
                      r.hasGuide
                        ? "bg-white text-ink"
                        : "bg-black/45 text-white/75 border border-white/20"
                    }`}
                  >
                    {r.hasGuide ? t("regions.explore") : t("regions.comingSoon")}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <h3 className="font-display text-white text-2xl sm:text-3xl font-normal tracking-tight normal-case">
                      {t(`regions.items.${r.key}.name`)}
                    </h3>
                    <p className="text-white/70 text-sm mt-1.5 leading-relaxed max-w-md">
                      {t(`regions.items.${r.key}.tagline`)}
                    </p>
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {EXPERIENCE_CATEGORIES.map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-white/25 bg-black/30 px-2 py-0.5 text-[10px] font-medium text-white/75 backdrop-blur-sm"
                        >
                          {t(`lenses.items.${c}.title`)}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              );
              const classes = `group relative overflow-hidden rounded-2xl sm:rounded-3xl ring-1 ring-line ${MOSAIC[r.key]}`;
              return r.hasGuide ? (
                <Link key={r.key} href={`/experiences/${r.key}`} className={classes}>
                  {card}
                </Link>
              ) : (
                <div key={r.key} className={classes}>
                  {card}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── The six lenses ── */}
      <section className="py-20 sm:py-24 border-t border-line bg-ink-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="font-display text-white text-4xl sm:text-5xl font-light leading-[1.05] tracking-tight normal-case text-balance">
                {t("lenses.title")}
              </h2>
              <p className="text-white/60 mt-5 text-lg leading-relaxed max-w-xl">
                {t("lenses.intro")}
              </p>
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
                {EXPERIENCE_CATEGORIES.map((c) => (
                  <div key={c}>
                    <h3 className="text-white font-semibold tracking-tight">
                      {t(`lenses.items.${c}.title`)}
                    </h3>
                    <p className="text-white/55 text-sm mt-1.5 leading-relaxed">
                      {t(`lenses.items.${c}.desc`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/5] lg:aspect-auto lg:h-full min-h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden ring-1 ring-line">
              <Image
                src="/experiences/culture.jpg"
                alt={t("lenses.imageAlt")}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── When to come ── */}
      <section className="py-20 sm:py-24 border-t border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-white text-3xl sm:text-4xl font-light leading-[1.08] tracking-tight normal-case text-balance mb-10 sm:mb-12">
            {t("travelPlanning.bestTime")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-9">
            {(["cool", "hot", "rainy"] as const).map((s) => (
              <div key={s}>
                <h3 className="text-white font-semibold text-lg leading-snug tracking-tight">
                  {t(`seasons.${s}.title`)}
                </h3>
                <p className="text-white/55 text-sm mt-2.5 leading-relaxed">
                  {t(`seasons.${s}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closer ── */}
      <section className="py-20 sm:py-24 border-t border-line bg-ink-2">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-white text-3xl sm:text-4xl font-light leading-[1.08] tracking-tight normal-case text-balance">
            {t("closer.title")}
          </h2>
          <p className="text-white/60 mt-5 text-lg leading-relaxed">
            {t("closer.description")}
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3.5 justify-center">
            <Link
              href="/guides"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-ink px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-neutral-200"
            >
              {t("closer.blogCta")}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/our-property"
              className="inline-flex items-center justify-center rounded-full border border-line text-white/80 px-7 py-3.5 text-sm font-medium transition-colors hover:border-white/40 hover:text-white"
            >
              {t("closer.stayCta")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
