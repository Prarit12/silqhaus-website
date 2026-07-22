import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Sparkles, TrendingUp, Handshake, type LucideIcon } from "lucide-react";

/** The "why we're different" recap — three audiences, three reasons each,
 * as open editorial columns (not a nine-card grid) on the ink surface. */
export default async function WhySilqhaus() {
  const t = await getTranslations("home.whyDifferent");

  const AUDIENCES: {
    key: "guests" | "owners" | "partners";
    label: string;
    Icon: LucideIcon;
    reasons: { title: string; body: string }[];
  }[] = (["guests", "owners", "partners"] as const).map((key) => ({
    key,
    label: t(`${key}.label`),
    Icon: { guests: Sparkles, owners: TrendingUp, partners: Handshake }[key],
    reasons: [1, 2, 3].map((n) => ({
      title: t(`${key}.r${n}Title`),
      body: t(`${key}.r${n}Body`),
    })),
  }));

  return (
    <section className="bg-ink-2 border-t border-line py-16 sm:py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl">
          <span className="eyebrow mb-5">{t("eyebrow")}</span>
          <h2 className="font-display font-light text-white text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight mt-5 normal-case text-balance">
            {t("title")}
          </h2>
          <p className="text-white/65 text-base sm:text-lg leading-relaxed mt-5">
            {t("description")}
          </p>
        </div>

        {/* Cinematic anchor image */}
        <div className="relative mt-10 sm:mt-12 aspect-[21/9] rounded-2xl sm:rounded-3xl overflow-hidden ring-1 ring-line">
          <Image
            src="/photos/why-silqhaus.jpg"
            alt={t("imageAlt")}
            fill
            sizes="(max-width: 1280px) 100vw, 1216px"
            quality={82}
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* Three audiences, three reasons each */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
          {AUDIENCES.map((a, i) => (
            <div
              key={a.key}
              className={i > 0 ? "md:border-l md:border-line md:pl-8" : ""}
            >
              {/* Audience header */}
              <div className="flex items-center gap-3 pb-6 border-b border-line">
                <span className="inline-flex w-9 h-9 shrink-0 items-center justify-center rounded-full border border-line text-white/80">
                  <a.Icon className="w-4 h-4" aria-hidden="true" />
                </span>
                <h3 className="font-display text-white text-xl font-light tracking-tight">
                  {a.label}
                </h3>
              </div>

              {/* Reasons */}
              <ul className="divide-y divide-line">
                {a.reasons.map((r) => (
                  <li key={r.title} className="py-5">
                    <p className="text-white font-medium text-[15px] leading-snug">
                      {r.title}
                    </p>
                    <p className="text-white/60 text-sm leading-relaxed mt-1.5 text-pretty">
                      {r.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
