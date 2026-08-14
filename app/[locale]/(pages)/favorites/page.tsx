"use client";

import { useMemo } from "react";
import { Heart, ArrowRight, Bed, Bath, Users } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Link } from "@/i18n/navigation";
import { PMSListingCard } from "@/components/pms-listing-card";
import { usePMSFavorites } from "@/hooks/use-pms-saved";
import type {
  FavoriteRef,
  PMSFavoriteSnapshot,
  VacationFavoriteSnapshot,
} from "@/lib/pms-saved-store";
import { useHoverPrefetch } from "@/hooks/use-hover-prefetch";

function VacationFavoriteCard({
  snap,
  t,
}: {
  snap: VacationFavoriteSnapshot;
  t: ReturnType<typeof useTranslations>;
}) {
  const href = `/our-property/${snap.slug}`;
  const prefetchHandlers = useHoverPrefetch()(href);
  return (
    <Link
      href={href}
      prefetch={false}
      {...prefetchHandlers}
      className="block group"
      data-testid={`favorite-vacation-${snap.id}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl">
        {snap.imageUrl ? (
          <Image
            src={snap.imageUrl}
            alt={snap.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-white/5" />
        )}
      </div>
      <div className="mt-3">
        {(snap.city || snap.state) && (
          <p className="text-[#aaa] text-[10px] font-poppins uppercase tracking-wide mb-1">
            {[snap.city, snap.state].filter(Boolean).join(", ")}
          </p>
        )}
        <h3 className="text-white font-poppins font-bold text-[13px] leading-tight mb-1 line-clamp-2">
          {snap.name}
        </h3>
        <div className="flex items-center gap-2 text-[#aaa] mt-1">
          {snap.bedroomsNumber != null && (
            <span className="flex items-center gap-0.5">
              <Bed size={10} className="text-[#ffffff]" />
              <span className="font-poppins text-[12px]">
                {snap.bedroomsNumber}
              </span>
            </span>
          )}
          {snap.personCapacity != null && (
            <span className="flex items-center gap-0.5">
              <Users size={10} className="text-[#ffffff]" />
              <span className="font-poppins text-[12px]">
                {snap.personCapacity}
              </span>
            </span>
          )}
          {snap.bathroomsNumber != null && (
            <span className="flex items-center gap-0.5">
              <Bath size={10} className="text-[#ffffff]" />
              <span className="font-poppins text-[12px]">
                {snap.bathroomsNumber}
              </span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Favorites() {
  const t = useTranslations("favoritesPage");
  const { favorites } = usePMSFavorites();

  const groups = useMemo(() => {
    const vacation: VacationFavoriteSnapshot[] = [];
    const rent: PMSFavoriteSnapshot["listing"][] = [];
    const sale: PMSFavoriteSnapshot["listing"][] = [];
    for (const f of favorites as FavoriteRef[]) {
      if (f.side === "vacation" && f.snapshot.kind === "vacation") {
        vacation.push(f.snapshot);
      } else if (f.side === "rent" && f.snapshot.kind === "pms") {
        rent.push(f.snapshot.listing);
      } else if (f.side === "sale" && f.snapshot.kind === "pms") {
        sale.push(f.snapshot.listing);
      }
    }
    return { vacation, rent, sale };
  }, [favorites]);

  const totalCount = favorites.length;
  const hasAny =
    groups.vacation.length + groups.rent.length + groups.sale.length > 0;

  return (
    <main className="min-h-screen bg-ink text-snow">
      <Navigation />

      <section className="pt-32 pb-16">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-gilroy font-light mb-4">
              {t.rich("title", {
                gold: (chunks) => <span className="text-gold">{chunks}</span>,
              })}
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
            {totalCount > 0 && (
              <p
                className="mt-3 text-white/50 text-sm font-poppins"
                data-testid="favorites-count"
              >
                {t("count", { count: totalCount })}
              </p>
            )}
          </div>

          {!hasAny ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mb-8">
                <Heart className="w-12 h-12 text-gold" />
              </div>
              <h2 className="text-2xl font-gilroy mb-4">{t("emptyTitle")}</h2>
              <p className="text-white/60 text-center max-w-md mb-8">
                {t("emptyBody")}
              </p>
              <Link
                href="/our-property"
                className="btn-primary px-8 py-4 inline-flex items-center gap-2"
              >
                {t("explore")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-16">
              {groups.vacation.length > 0 && (
                <section data-testid="favorites-section-vacation">
                  <h2 className="text-2xl font-gilroy text-white mb-6">
                    {t("groupVacation")}
                    <span className="ml-2 text-white/50 text-base">
                      ({groups.vacation.length})
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {groups.vacation.map((snap) => (
                      <VacationFavoriteCard key={snap.id} snap={snap} t={t} />
                    ))}
                  </div>
                </section>
              )}

              {groups.rent.length > 0 && (
                <section data-testid="favorites-section-rent">
                  <h2 className="text-2xl font-gilroy text-white mb-6">
                    {t("groupRent")}
                    <span className="ml-2 text-white/50 text-base">
                      ({groups.rent.length})
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {groups.rent.map((l) => (
                      <PMSListingCard
                        key={l.id}
                        listing={l}
                        basePath="properties-for-rent"
                      />
                    ))}
                  </div>
                </section>
              )}

              {groups.sale.length > 0 && (
                <section data-testid="favorites-section-sale">
                  <h2 className="text-2xl font-gilroy text-white mb-6">
                    {t("groupSale")}
                    <span className="ml-2 text-white/50 text-base">
                      ({groups.sale.length})
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {groups.sale.map((l) => (
                      <PMSListingCard
                        key={l.id}
                        listing={l}
                        basePath="properties-for-sale"
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
