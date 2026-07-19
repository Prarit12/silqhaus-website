import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  ArrowLeft,
  ArrowRight,
  Plane,
  TrainFront,
  TramFront,
  Ship,
  CarTaxiFront,
  Bike,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  EXPERIENCE_CATEGORIES,
  EXPERIENCE_REGIONS,
} from "@/config/experience-regions";
import {
  REGION_HIGHLIGHTS,
  REGION_SPOT_GUIDES,
  REGION_SPOT_COUNTS,
  REGION_AREAS,
  REGION_SHOPPING,
  REGION_TRANSPORT,
  REGION_THINGS_COUNT,
} from "@/config/region-highlights";
import RegionNeighborhoods from "@/components/region-neighborhoods";

const TRANSPORT_ICONS: Record<string, LucideIcon> = {
  airports: Plane,
  airportRail: TrainFront,
  rail: TramFront,
  river: Ship,
  ride: CarTaxiFront,
  moto: Bike,
};

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
  const tAttr = await getTranslations(`destination.${region}.attractions`);
  const g = (key: string) => t(`guides.${region}.${key}`);
  const highlights = REGION_HIGHLIGHTS[region] ?? [];
  const spotGuides = REGION_SPOT_GUIDES[region] ?? {};
  const areas = REGION_AREAS[region] ?? [];
  const shoppingGroups = REGION_SHOPPING[region] ?? [];
  const transportItems = REGION_TRANSPORT[region] ?? [];
  const thingsCount = REGION_THINGS_COUNT[region] ?? 0;

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

      {/* ── Highlights — real photos, linked to blog guides where they exist ── */}
      {highlights.length > 0 && (
        <section className="pb-20 sm:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 mb-9 sm:mb-11">
              <h2 className="font-display text-white text-3xl sm:text-4xl font-light leading-[1.08] tracking-tight normal-case text-balance">
                {g("highlightsTitle")}
              </h2>
              <p className="text-white/55 max-w-md text-base leading-relaxed">
                {g("highlightsIntro")}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {highlights.map((b) => {
                const inner = (
                  <>
                    <Image
                      src={b.img}
                      alt={tAttr(`${b.key}.name`)}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent"
                      aria-hidden="true"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
                      <p className="text-white font-semibold text-sm sm:text-[15px] tracking-tight">
                        {tAttr(`${b.key}.name`)}
                      </p>
                      {b.link && (
                        <p className="text-white/60 text-xs mt-0.5 inline-flex items-center gap-1">
                          {t("guides.readGuide")}
                          <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </p>
                      )}
                    </div>
                  </>
                );
                const classes =
                  "group relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden ring-1 ring-line";
                return b.link ? (
                  <Link key={b.key} href={b.link} className={classes}>
                    {inner}
                  </Link>
                ) : (
                  <div key={b.key} className={classes}>
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

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
              {(() => {
                const spotCount = REGION_SPOT_COUNTS[region]?.[c] ?? 3;
                const compact = spotCount > 3;
                return (
                  <>
                    <h2 className="font-display text-white text-3xl sm:text-4xl font-light leading-[1.08] tracking-tight normal-case text-balance">
                      {g(`categories.${c}.title`)}
                    </h2>
                    <p
                      className={`text-white/60 mt-4 leading-relaxed ${
                        compact ? "text-base" : "text-lg"
                      }`}
                    >
                      {g(`categories.${c}.lead`)}
                    </p>
                    <div
                      className={
                        compact
                          ? "mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8"
                          : "mt-8 space-y-6"
                      }
                    >
                      {Array.from(
                        { length: spotCount },
                        (_, si) => `s${si + 1}`,
                      ).map((s) => {
                        const guide = spotGuides[c]?.[s];
                        return (
                          <div
                            key={s}
                            className={`border-t border-line ${
                              compact ? "py-3.5" : "pt-5"
                            }`}
                          >
                            <h3
                              className={`text-white font-semibold tracking-tight ${
                                compact ? "text-[15px]" : ""
                              }`}
                            >
                              {g(`categories.${c}.spots.${s}.name`)}
                            </h3>
                            <p
                              className={`text-white/55 leading-relaxed ${
                                compact ? "text-[13px] mt-1" : "text-sm mt-1.5"
                              }`}
                            >
                              {g(`categories.${c}.spots.${s}.desc`)}
                            </p>
                            {guide && (
                              <Link
                                href={guide}
                                className={`inline-flex items-center gap-1.5 font-medium text-white/75 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white ${
                                  compact ? "mt-2 text-[13px]" : "mt-2.5 text-sm"
                                }`}
                              >
                                {t("guides.readGuide")}
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </div>
          </section>
        ))}
      </div>

      {/* ── Neighborhoods — the interactive map, after the deep dives ── */}
      {areas.length > 0 && (
        <RegionNeighborhoods
          region={region}
          areaKeys={areas}
          transportKeys={transportItems}
        />
      )}

      {/* ── Shopping culture ── */}
      {shoppingGroups.length > 0 && (
        <section className="py-20 sm:py-24 border-t border-line bg-ink-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10 sm:mb-12">
              <h2 className="font-display text-white text-3xl sm:text-4xl font-light leading-[1.08] tracking-tight normal-case text-balance">
                {g("shopping.title")}
              </h2>
              <p className="text-white/60 mt-4 text-lg leading-relaxed">
                {g("shopping.lead")}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-12">
              {shoppingGroups.map((grp) => (
                <div key={grp}>
                  <h3 className="text-white/45 text-xs font-medium uppercase tracking-[0.18em] mb-2">
                    {g(`shopping.groups.${grp}.title`)}
                  </h3>
                  {(["s1", "s2", "s3"] as const).map((s) => (
                    <div key={s} className="border-t border-line py-4">
                      <h4 className="text-white font-semibold tracking-tight">
                        {g(`shopping.groups.${grp}.${s}.name`)}
                      </h4>
                      <p className="text-white/55 text-sm mt-1.5 leading-relaxed">
                        {g(`shopping.groups.${grp}.${s}.desc`)}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Getting there & around (standalone when there's no map section) ── */}
      {transportItems.length > 0 && areas.length === 0 && (
        <section className="py-20 sm:py-24 border-t border-line">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10 sm:mb-12">
              <h2 className="font-display text-white text-3xl sm:text-4xl font-light leading-[1.08] tracking-tight normal-case text-balance">
                {g("transport.title")}
              </h2>
              <p className="text-white/60 mt-4 text-lg leading-relaxed">
                {g("transport.lead")}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-9">
              {transportItems.map((item) => {
                const Icon = TRANSPORT_ICONS[item] ?? TrainFront;
                return (
                  <div key={item} className="flex items-start gap-4">
                    <span className="mt-0.5 inline-flex w-10 h-10 shrink-0 items-center justify-center rounded-full border border-line text-white/70">
                      <Icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
                    </span>
                    <div>
                      <h3 className="text-white font-semibold tracking-tight">
                        {g(`transport.items.${item}.name`)}
                      </h3>
                      <p className="text-white/55 text-sm mt-1.5 leading-relaxed">
                        {g(`transport.items.${item}.desc`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── The numbered checklist ── */}
      {thingsCount > 0 && (
        <section className="py-20 sm:py-24 border-t border-line bg-ink-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10 sm:mb-12">
              <h2 className="font-display text-white text-3xl sm:text-4xl font-light leading-[1.08] tracking-tight normal-case text-balance">
                {g("things.title")}
              </h2>
              <p className="text-white/60 mt-4 text-lg leading-relaxed">
                {g("things.lead")}
              </p>
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10">
              {Array.from({ length: thingsCount }, (_, i) => i + 1).map(
                (num) => (
                  <li
                    key={num}
                    className="flex items-baseline gap-4 border-t border-line py-3.5"
                  >
                    <span className="shrink-0 w-7 text-white/35 text-sm font-medium tabular-nums">
                      {String(num).padStart(2, "0")}
                    </span>
                    <span className="text-white/80 text-[15px] leading-relaxed">
                      {g(`things.items.i${num}`)}
                    </span>
                  </li>
                ),
              )}
            </ol>
          </div>
        </section>
      )}

      {/* ── Footer nav ── */}
      <section className="py-16 sm:py-20 border-t border-line bg-ink-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-white/50 text-sm">{t("guides.moreComing")}</p>
            <p className="text-white font-semibold text-lg mt-1">
              {g("stayLine")}
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
