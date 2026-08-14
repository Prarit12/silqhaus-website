import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight, CalendarDays, MapPin, Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { DESTINATION_REGIONS } from "@/config/destination-regions";
import { getAllVacationListings, regionCounts } from "@/lib/destinations";

export const revalidate = 3600;

/** "Getting to know Thailand" — the destinations overview as a guide:
 *  one editorial row per region (image beside character copy and a
 *  good-to-know line), linking to the region's vacation-rental page and
 *  its experiences guide. */
export default async function DestinationIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "destinationPages" });
  const tRegions = await getTranslations({
    locale,
    namespace: "experiences.regions.items",
  });

  const all = await getAllVacationListings();
  const counts = regionCounts(all);

  return (
    <main className="min-h-screen bg-white text-ink pt-14 md:pt-16">
      {/* Hero */}
      <div className="bg-[#F5F4F0] border-b border-neutral-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-[34px] leading-[1.1] md:text-5xl font-bold tracking-tight text-ink text-balance">
            {t("guide.title")}
          </h1>
          <p className="mt-4 text-[15px] md:text-base leading-relaxed text-neutral-600 max-w-[68ch]">
            {t("guide.intro")}
          </p>
        </div>
      </div>

      {/* Region guide rows */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-14 md:space-y-20">
          {DESTINATION_REGIONS.map((r, i) => {
            const name = tRegions(`${r.key}.name`);
            const count = counts[r.key] ?? 0;
            return (
              <section
                key={r.key}
                className={`md:grid md:grid-cols-2 md:gap-12 lg:gap-16 md:items-center ${
                  i > 0 ? "pt-14 md:pt-20 border-t border-neutral-100" : ""
                }`}
              >
                <Link
                  href={`/destination/${r.key}`}
                  className={`group block relative aspect-[4/3] rounded-2xl overflow-hidden ${
                    i % 2 === 1 ? "md:order-2" : ""
                  }`}
                >
                  <Image
                    src={r.img}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <span className="absolute left-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[13px] font-medium text-ink">
                    <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                    {count > 0
                      ? t("homesCount", { count })
                      : t("comingSoonShort")}
                  </span>
                </Link>

                <div className="mt-6 md:mt-0">
                  <h2 className="text-2xl md:text-3xl font-semibold normal-case tracking-normal text-ink">
                    {name}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-neutral-600 text-pretty">
                    {t(`guide.regions.${r.key}`)}
                  </p>
                  <p className="mt-3 text-[13px] leading-relaxed text-neutral-500">
                    {t(`guide.goodToKnow.${r.key}`)}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-2.5">
                    <Link
                      href={`/destination/${r.key}`}
                      className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-ink text-white hover:text-white text-sm font-semibold hover:bg-neutral-800 transition-colors"
                    >
                      <Search className="w-4 h-4" aria-hidden="true" />
                      {t("title", { region: name })}
                    </Link>
                    {r.hasGuide && (
                      <Link
                        href={`/experiences/${r.key}`}
                        className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full border border-neutral-300 text-sm font-semibold text-ink hover:text-ink hover:border-ink transition-colors"
                      >
                        {t("guideCta", { region: name })}
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Monthly cross-sell */}
        <div className="mt-16 rounded-2xl bg-[#F5F4F0] px-6 py-8 md:px-10 flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-[52ch]">
            <p className="text-lg font-semibold text-ink">
              {t("guide.monthlyTitle")}
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              {t("guide.monthlyBody")}
            </p>
          </div>
          <Link
            href="/monthly-inquiry"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-ink bg-[linear-gradient(90deg,#09081F_0%,#382124_45%,#673929_65%,#95522E_80%,#C46A33_92%,#F38338_100%)] text-white hover:text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <CalendarDays className="w-4 h-4" aria-hidden="true" />
            {t("monthlyCta")}
          </Link>
        </div>
      </div>
    </main>
  );
}
