import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Bath, BedDouble, Star, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { DESTINATION_REGIONS } from "@/config/destination-regions";
import {
  getAllVacationListings,
  listingsForRegion,
} from "@/lib/destinations";
import { displayPropertyName } from "@/config/property-names";
import { createPropertySlug } from "@/lib/slugify";

/**
 * The homepage's single destinations section: an SEO heading over the six
 * region covers (each linking to its /destination page, with a live homes
 * count), then crawlable per-region link columns — the destination lead
 * link plus every home as a named anchor. Server-rendered throughout.
 */
export default async function HomeDestinations() {
  const t = await getTranslations("destinationPages");
  const tCovers = await getTranslations("home.destinations");
  const tRegions = await getTranslations("experiences.regions.items");

  const all = await getAllVacationListings();
  const regions = DESTINATION_REGIONS.map((r) => ({
    region: r,
    homes: listingsForRegion(all, r),
  }));
  const withHomes = regions.filter((x) => x.homes.length > 0);

  return (
    <section className="bg-ink border-t border-line py-16 sm:py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-left mb-10 sm:mb-14 max-w-2xl">
          <span className="eyebrow mb-5">{tCovers("eyebrow")}</span>
          <h2 className="font-display font-light text-white text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight mt-5 normal-case text-balance">
            {t("homeSectionTitle")}
          </h2>
          <p className="text-white/60 text-base sm:text-lg leading-relaxed mt-5">
            {t("homeSectionSubtitle")}
          </p>
          <Link
            href="/destination"
            className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition-colors"
          >
            {tCovers("guideLink")}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Region covers — one slim row, every card a destination page */}
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-6 md:gap-4 md:overflow-visible md:pb-0">
          {regions.map(({ region, homes }) => {
            const name = tRegions(`${region.key}.name`);
            return (
              <Link
                key={region.key}
                href={`/destination/${region.key}`}
                className="group relative w-[150px] shrink-0 snap-start md:w-auto md:shrink aspect-[4/5] rounded-xl overflow-hidden ring-1 ring-line transition-all duration-500 hover:ring-white/30"
              >
                <Image
                  src={region.img}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 150px, 220px"
                  quality={80}
                  className="object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-105"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="text-white text-[15px] font-semibold tracking-tight">
                    {name}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-white/70">
                    {homes.length > 0
                      ? t("homesCount", { count: homes.length })
                      : t("comingSoonShort")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Homes by destination — swipeable card rows, one per region.
            Every card is a plain server-rendered link, so the whole
            portfolio stays crawlable as it grows. */}
        <div className="mt-12 sm:mt-16 space-y-12">
          {withHomes.map(({ region, homes }) => {
            const name = tRegions(`${region.key}.name`);
            return (
              <div key={region.key}>
                <div className="flex items-baseline justify-between gap-3">
                  <Link
                    href={`/destination/${region.key}`}
                    className="group inline-flex items-center gap-2 text-white text-lg sm:text-xl font-medium hover:underline underline-offset-4"
                  >
                    {t("title", { region: name })}
                    <ArrowRight
                      className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity"
                      aria-hidden="true"
                    />
                  </Link>
                  <span className="shrink-0 text-[13px] text-white/45">
                    {t("homesCount", { count: homes.length })}
                  </span>
                </div>
                <div className="mt-4 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {homes.map((home) => {
                    const title = displayPropertyName(home);
                    return (
                      <Link
                        key={`${home.source}:${home.id}`}
                        href={`/our-property/${createPropertySlug(home.name, home.id)}`}
                        className="group snap-start shrink-0 w-[240px] sm:w-[272px]"
                      >
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white/5 ring-1 ring-line">
                          {home.imageUrl && (
                            <Image
                              src={home.imageUrl}
                              alt={title}
                              fill
                              sizes="272px"
                              className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                            />
                          )}
                        </div>
                        <div className="mt-2.5 flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[15px] font-medium text-white truncate group-hover:underline underline-offset-2">
                              {title}
                            </p>
                            <p className="mt-0.5 text-[13px] text-white/55 truncate">
                              {[home.city, home.state]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                            <p className="mt-1 text-[12px] text-white/55 flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                              {home.bedroomsNumber ? (
                                <span className="inline-flex items-center gap-1">
                                  <BedDouble
                                    className="w-3.5 h-3.5"
                                    aria-hidden="true"
                                  />
                                  {home.bedroomsNumber}
                                </span>
                              ) : null}
                              {home.bathroomsNumber ? (
                                <span className="inline-flex items-center gap-1">
                                  <Bath
                                    className="w-3.5 h-3.5"
                                    aria-hidden="true"
                                  />
                                  {home.bathroomsNumber}
                                </span>
                              ) : null}
                              {home.personCapacity ? (
                                <span className="inline-flex items-center gap-1">
                                  <Users
                                    className="w-3.5 h-3.5"
                                    aria-hidden="true"
                                  />
                                  {home.personCapacity}
                                </span>
                              ) : null}
                            </p>
                          </div>
                          {home.averageReviewRating ? (
                            <span className="shrink-0 inline-flex items-center gap-1 text-[13px] text-white/85">
                              <Star
                                className="w-3.5 h-3.5 fill-white/85"
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
