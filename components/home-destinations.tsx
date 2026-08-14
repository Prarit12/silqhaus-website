import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
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

        {/* Region covers — every card is a destination page */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
          {regions.map(({ region, homes }) => {
            const name = tRegions(`${region.key}.name`);
            return (
              <Link
                key={region.key}
                href={`/destination/${region.key}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-line transition-all duration-500 hover:ring-white/30"
              >
                <Image
                  src={region.img}
                  alt={name}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  quality={80}
                  className="object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-105"
                />
                {/* Top-left name notch — the clean signature label */}
                <div className="absolute top-0 left-0 bg-white rounded-br-2xl pl-3.5 pr-5 py-2.5 shadow-sm">
                  <p className="text-ink font-semibold text-[15px] sm:text-base tracking-tight">
                    {name}
                  </p>
                </div>
                <span className="absolute bottom-3 left-3 rounded-full bg-black/45 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                  {homes.length > 0
                    ? t("homesCount", { count: homes.length })
                    : t("comingSoonShort")}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Crawlable home links, by destination */}
        <div className="mt-12 sm:mt-14 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {withHomes.map(({ region, homes }) => {
            const name = tRegions(`${region.key}.name`);
            return (
              <div key={region.key}>
                <Link
                  href={`/destination/${region.key}`}
                  className="group inline-flex items-center gap-2 text-white text-lg font-medium hover:underline underline-offset-4"
                >
                  {t("title", { region: name })}
                  <ArrowRight
                    className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity"
                    aria-hidden="true"
                  />
                </Link>
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                  {homes.map((home) => (
                    <li key={`${home.source}:${home.id}`}>
                      <Link
                        href={`/our-property/${createPropertySlug(home.name, home.id)}`}
                        className="text-sm text-white/65 hover:text-white transition-colors"
                      >
                        {displayPropertyName(home)}
                        {home.city ? ` · ${home.city}` : ""}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
