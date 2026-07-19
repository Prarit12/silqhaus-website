import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  EXPERIENCE_CATEGORIES,
  EXPERIENCE_REGIONS,
} from "@/config/experience-regions";

const GUIDED = EXPERIENCE_REGIONS.filter((r) => r.hasGuide).map((r) => r.key);

export function generateStaticParams() {
  return GUIDED.map((region) => ({ region }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; region: string }>;
}) {
  const { locale, region } = await params;
  if (!GUIDED.includes(region as (typeof GUIDED)[number])) return {};
  const t = await getTranslations({ locale, namespace: "experiences" });
  return {
    title: t(`guides.${region}.metaTitle`),
    description: t(`guides.${region}.metaDescription`),
  };
}

export default async function RegionGuide({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  if (!GUIDED.includes(region as (typeof GUIDED)[number])) notFound();
  const t = await getTranslations("experiences");
  const g = (key: string) => t(`guides.${region}.${key}`);

  return (
    <main className="min-h-screen bg-ink">
      {/* ── Region hero ── */}
      <section className="relative h-[68vh] min-h-[480px] flex items-end overflow-hidden">
        <Image
          src={`/experiences/${region}/hero.jpg`}
          alt={g("heroAlt")}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink via-black/30 to-black/15"
          aria-hidden="true"
        />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
          <Link
            href="/experiences"
            className="inline-flex items-center gap-2 text-white/70 text-sm font-medium transition-colors hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("guides.allRegions")}
          </Link>
          <h1 className="font-display text-white text-5xl sm:text-6xl md:text-7xl font-light leading-[1.02] tracking-tight normal-case mt-5">
            {t(`regions.items.${region}.name`)}
          </h1>
          <p className="text-white/80 mt-4 text-lg sm:text-xl leading-relaxed max-w-2xl">
            {t(`regions.items.${region}.tagline`)}
          </p>
        </div>
      </section>

      {/* ── Editorial intro ── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-display text-white/65 text-2xl sm:text-[1.7rem] font-light leading-[1.4] tracking-tight text-balance">
            {g("intro")}
          </p>
        </div>
      </section>

      {/* ── The six lenses, in depth ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24 space-y-20 sm:space-y-28">
        {EXPERIENCE_CATEGORIES.map((c, i) => (
          <section
            key={c}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
          >
            <div
              className={`relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden ring-1 ring-line ${
                i % 2 === 1 ? "lg:order-2" : ""
              }`}
            >
              <Image
                src={`/experiences/${region}/${c}.jpg`}
                alt={t(`lenses.items.${c}.title`)}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
            <div>
              <h2 className="font-display text-white text-3xl sm:text-4xl font-light leading-[1.08] tracking-tight normal-case text-balance">
                {g(`categories.${c}.title`)}
              </h2>
              <p className="text-white/60 mt-4 text-lg leading-relaxed">
                {g(`categories.${c}.lead`)}
              </p>
              <div className="mt-8 space-y-6">
                {(["s1", "s2", "s3"] as const).map((s) => (
                  <div key={s} className="border-t border-line pt-5">
                    <h3 className="text-white font-semibold tracking-tight">
                      {g(`categories.${c}.spots.${s}.name`)}
                    </h3>
                    <p className="text-white/55 text-sm mt-1.5 leading-relaxed">
                      {g(`categories.${c}.spots.${s}.desc`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* ── Footer nav ── */}
      <section className="py-16 sm:py-20 border-t border-line bg-ink-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-white/50 text-sm">{t("guides.moreComing")}</p>
            <p className="text-white font-semibold text-lg mt-1">
              {t("guides.stayLine")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3.5">
            <Link
              href="/experiences"
              className="inline-flex items-center gap-2 rounded-full border border-line text-white/80 px-6 py-3 text-sm font-medium transition-colors hover:border-white/40 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("guides.allRegions")}
            </Link>
            <Link
              href="/our-property"
              className="inline-flex items-center gap-2 rounded-full bg-white text-ink px-6 py-3 text-sm font-semibold transition-colors hover:bg-neutral-200"
            >
              {t("closer.stayCta")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
