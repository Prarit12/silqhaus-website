import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  BedDouble,
  Bath,
  CalendarDays,
  MapPin,
  Search,
  Star,
  Users,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  DESTINATION_REGIONS,
  destinationRegion,
} from "@/config/destination-regions";
import {
  getAllVacationListings,
  listingsForRegion,
} from "@/lib/destinations";
import { displayPropertyName } from "@/config/property-names";
import { createPropertySlug } from "@/lib/slugify";

export const revalidate = 3600;

export function generateStaticParams() {
  return DESTINATION_REGIONS.map((r) => ({ region: r.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; region: string }>;
}): Promise<Metadata> {
  const { locale, region } = await params;
  const r = destinationRegion(region);
  if (!r) return {};
  const t = await getTranslations({ locale, namespace: "destinationPages" });
  const tRegions = await getTranslations({
    locale,
    namespace: "experiences.regions.items",
  });
  const name = tRegions(`${r.key}.name`);
  return {
    title: t("metaTitle", { region: name }),
    description: t(`intros.${r.key}`),
  };
}

export default async function DestinationRegionPage({
  params,
}: {
  params: Promise<{ locale: string; region: string }>;
}) {
  const { locale, region } = await params;
  const r = destinationRegion(region);
  if (!r) notFound();

  const t = await getTranslations({ locale, namespace: "destinationPages" });
  const tRegions = await getTranslations({
    locale,
    namespace: "experiences.regions.items",
  });
  const tDetail = await getTranslations({
    locale,
    namespace: "propertyDetail",
  });
  const name = tRegions(`${r.key}.name`);

  const all = await getAllVacationListings();
  const homes = listingsForRegion(all, r);
  const otherRegionsWithHomes = DESTINATION_REGIONS.filter(
    (other) => other.key !== r.key && listingsForRegion(all, other).length > 0,
  );

  return (
    <main className="min-h-screen bg-white text-ink pt-14 md:pt-16">
      {/* Hero */}
      <div className="bg-[#F5F4F0] border-b border-neutral-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-[34px] leading-[1.1] md:text-5xl font-bold tracking-tight text-ink text-balance">
            {t("title", { region: name })}
          </h1>
          <p className="mt-4 text-[15px] md:text-base leading-relaxed text-neutral-600 max-w-[65ch]">
            {t(`intros.${r.key}`)}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <Link
              href={`/our-property?location=${encodeURIComponent(r.searchQ)}`}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-ink text-white hover:text-white text-sm font-semibold hover:bg-neutral-800 transition-colors"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              {t("searchCta", { region: name })}
            </Link>
            <Link
              href="/monthly-inquiry"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-neutral-300 bg-white text-sm font-semibold text-ink hover:text-ink hover:border-ink transition-colors"
            >
              <CalendarDays className="w-4 h-4" aria-hidden="true" />
              {t("monthlyCta")}
            </Link>
            {r.hasGuide && (
              <Link
                href={`/experiences/${r.key}`}
                className="inline-flex items-center gap-1.5 h-11 px-5 rounded-full border border-neutral-300 bg-white text-sm font-semibold text-ink hover:text-ink hover:border-ink transition-colors"
              >
                {t("guideCta", { region: name })}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Homes */}
        {homes.length > 0 ? (
          <section>
            <h2 className="text-xl md:text-2xl font-semibold normal-case tracking-normal text-ink">
              {t("homesIn", { count: homes.length, region: name })}
            </h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-9">
              {homes.map((home) => {
                const title = displayPropertyName(home);
                const href = `/our-property/${createPropertySlug(home.name, home.id)}`;
                return (
                  <Link
                    key={`${home.source}:${home.id}`}
                    href={href}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100">
                      {home.imageUrl && (
                        <Image
                          src={home.imageUrl}
                          alt={title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div className="mt-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold text-ink group-hover:underline underline-offset-2 truncate">
                          {title}
                        </p>
                        <p className="mt-0.5 text-sm text-neutral-500 truncate">
                          {[home.city, home.state].filter(Boolean).join(", ")}
                        </p>
                        <p className="mt-1 text-[13px] text-neutral-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                          {home.bedroomsNumber ? (
                            <span className="inline-flex items-center gap-1">
                              <BedDouble className="w-3.5 h-3.5" aria-hidden="true" />
                              {home.bedroomsNumber}
                            </span>
                          ) : null}
                          {home.bathroomsNumber ? (
                            <span className="inline-flex items-center gap-1">
                              <Bath className="w-3.5 h-3.5" aria-hidden="true" />
                              {home.bathroomsNumber}
                            </span>
                          ) : null}
                          {home.personCapacity ? (
                            <span className="inline-flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" aria-hidden="true" />
                              {home.personCapacity}
                            </span>
                          ) : null}
                        </p>
                      </div>
                      {home.averageReviewRating ? (
                        <span className="shrink-0 inline-flex items-center gap-1 text-sm text-ink">
                          <Star
                            className="w-3.5 h-3.5 fill-ink"
                            aria-hidden="true"
                          />
                          {(home.averageReviewRating > 5
                            ? home.averageReviewRating / 2
                            : home.averageReviewRating
                          ).toFixed(1)}
                        </span>
                      ) : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-neutral-200 bg-[#F5F4F0] px-6 py-10 text-center">
            <h2 className="text-xl font-semibold normal-case tracking-normal text-ink">
              {t("comingSoonTitle", { region: name })}
            </h2>
            <p className="mt-2 text-sm text-neutral-600 max-w-[52ch] mx-auto">
              {t("comingSoonBody", { region: name })}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              {otherRegionsWithHomes.map((other) => (
                <Link
                  key={other.key}
                  href={`/destination/${other.key}`}
                  className="inline-flex items-center h-10 px-4 rounded-full border border-neutral-300 bg-white text-sm font-semibold text-ink hover:text-ink hover:border-ink transition-colors"
                >
                  {t("title", { region: tRegions(`${other.key}.name`) })}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Areas we operate in */}
        {r.areaKeys.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl md:text-2xl font-semibold normal-case tracking-normal text-ink">
              {t("areasTitle", { region: name })}
            </h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              {r.areaKeys.map((areaKey) => (
                <div key={areaKey}>
                  <h3 className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                    <MapPin
                      className="w-4 h-4 text-neutral-500"
                      aria-hidden="true"
                    />
                    {t(`areaNames.${areaKey}`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 text-pretty">
                    {tDetail(`neighborhoods.${areaKey}`)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mt-14 max-w-3xl">
          <h2 className="text-xl md:text-2xl font-semibold normal-case tracking-normal text-ink">
            {t("faqTitle", { region: name })}
          </h2>
          <dl className="mt-5 divide-y divide-neutral-200 border-y border-neutral-200">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="py-5">
                <dt className="text-[15px] font-semibold text-ink">
                  {t(`faq.q${n}`, { region: name })}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-neutral-600 text-pretty">
                  {t(`faq.a${n}`, { region: name })}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Other destinations */}
        <section className="mt-14">
          <h2 className="text-[15px] font-semibold text-ink">
            {t("moreDestinations")}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {DESTINATION_REGIONS.filter((other) => other.key !== r.key).map(
              (other) => (
                <Link
                  key={other.key}
                  href={`/destination/${other.key}`}
                  className="inline-flex items-center h-10 px-4 rounded-full border border-neutral-300 text-sm font-medium text-ink hover:text-ink hover:border-ink transition-colors"
                >
                  {t("title", { region: tRegions(`${other.key}.name`) })}
                </Link>
              ),
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
