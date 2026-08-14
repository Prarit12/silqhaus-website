import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { DESTINATION_REGIONS } from "@/config/destination-regions";
import {
  getAllVacationListings,
  listingsForRegion,
} from "@/lib/destinations";
import HomeDestinationRow from "@/components/home-destination-row";
import HomeDestinationCovers from "@/components/home-destination-covers";

/**
 * The homepage's single destinations section: an SEO heading over the six
 * region covers (an auto-turning carousel, each cover linking its
 * /destination page with a live homes count), then per-region PropertyCard
 * rows. Data is fetched server-side so every link lands in the SSR HTML.
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
    <section className="bg-white pt-16 sm:pt-20 md:pt-28 pb-12 sm:pb-16">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — dark-on-white variant of the section grammar */}
        <div className="text-left mb-10 sm:mb-14 max-w-2xl">
          <span className="inline-flex items-center gap-3 text-neutral-500 text-[0.72rem] font-medium uppercase tracking-[0.3em]">
            <span className="w-8 h-px bg-neutral-300" aria-hidden="true" />
            {tCovers("eyebrow")}
          </span>
          <h2 className="font-display font-light text-ink text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight mt-5 normal-case text-balance">
            {t("homeSectionTitle")}
          </h2>
          <p className="text-neutral-600 text-base sm:text-lg leading-relaxed mt-5">
            {t("homeSectionSubtitle")}
          </p>
          <Link
            href="/destination"
            className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink hover:text-ink underline underline-offset-4 decoration-neutral-400 hover:decoration-ink transition-colors"
          >
            {tCovers("guideLink")}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Region covers — an auto-turning carousel, three big cards per
            view on desktop; every cover links its destination page. */}
        <HomeDestinationCovers
          covers={regions.map(({ region, homes }) => ({
            key: region.key,
            img: region.img,
            name: tRegions(`${region.key}.name`),
            sub:
              homes.length > 0
                ? t("homesCount", { count: homes.length })
                : t("comingSoonShort"),
          }))}
          prevLabel={tCovers("carouselPrev")}
          nextLabel={tCovers("carouselNext")}
        />

        {/* Homes by destination — swipeable card rows, one per region.
            Cards are the shared PropertyCard fed with server-fetched data,
            so every card link still lands in the SSR HTML. */}
        <div className="mt-12 sm:mt-16 space-y-12">
          {withHomes.map(({ region, homes }) => (
            <HomeDestinationRow
              key={region.key}
              homes={homes}
              href={`/destination/${region.key}`}
              title={t("title", { region: tRegions(`${region.key}.name`) })}
              countLabel={t("homesCount", { count: homes.length })}
              prevLabel={tCovers("rowPrev")}
              nextLabel={tCovers("rowNext")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
