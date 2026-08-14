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
 * "Homes & destinations" — the homepage's crawlable internal-link block:
 * one visible column per region with inventory (destination-page lead link
 * plus every home as a named link), and a quiet row for the regions whose
 * pages are live but still filling up. Pure server-rendered anchors.
 */
export default async function HomeDestinations() {
  const t = await getTranslations("destinationPages");
  const tRegions = await getTranslations("experiences.regions.items");

  const all = await getAllVacationListings();
  const withHomes = DESTINATION_REGIONS.map((r) => ({
    region: r,
    homes: listingsForRegion(all, r),
  })).filter((x) => x.homes.length > 0);
  const withoutHomes = DESTINATION_REGIONS.filter(
    (r) => !withHomes.some((x) => x.region.key === r.key),
  );

  if (withHomes.length === 0) return null;

  return (
    <section className="bg-ink border-t border-line py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display font-light text-white text-3xl sm:text-4xl leading-[1.1] tracking-tight normal-case text-balance">
          {t("homeSectionTitle")}
        </h2>
        <p className="text-white/60 text-[15px] leading-relaxed mt-3 max-w-2xl">
          {t("homeSectionSubtitle")}
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
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

        {withoutHomes.length > 0 && (
          <div className="mt-10 pt-6 border-t border-line flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="text-white/45 text-[13px]">
              {t("moreDestinations")}
            </span>
            {withoutHomes.map((r) => (
              <Link
                key={r.key}
                href={`/destination/${r.key}`}
                className="text-[13px] text-white/65 hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                {t("title", { region: tRegions(`${r.key}.name`) })}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
