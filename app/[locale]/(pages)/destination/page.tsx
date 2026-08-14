import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { DESTINATION_REGIONS } from "@/config/destination-regions";
import { getAllVacationListings, regionCounts } from "@/lib/destinations";

export const revalidate = 3600;

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 text-[34px] leading-[1.1] md:text-5xl font-bold tracking-tight text-ink text-balance">
          {t("indexTitle")}
        </h1>
        <p className="mt-4 text-[15px] md:text-base leading-relaxed text-neutral-600 max-w-[65ch]">
          {t("indexSubtitle")}
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DESTINATION_REGIONS.map((r) => {
            const name = tRegions(`${r.key}.name`);
            const count = counts[r.key] ?? 0;
            return (
              <Link
                key={r.key}
                href={`/destination/${r.key}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden"
              >
                <Image
                  src={r.img}
                  alt={name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="flex items-center gap-1.5 text-white/85 text-[13px] font-medium">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                    {count > 0
                      ? t("homesCount", { count })
                      : t("comingSoonShort")}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-white text-xl font-semibold">
                    {t("title", { region: name })}
                    <ArrowRight
                      className="w-5 h-5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      aria-hidden="true"
                    />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
