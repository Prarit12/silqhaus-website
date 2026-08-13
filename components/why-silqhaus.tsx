import { getTranslations } from "next-intl/server";
import WhyDifferentGallery, {
  type WhyDifferentReason,
} from "@/components/why-different-gallery";

/** The "why we're different" recap — nine reasons across three audiences,
 * presented as cards on a scroll-rotated wheel over the ink surface. */
export default async function WhySilqhaus() {
  const t = await getTranslations("home.whyDifferent");

  const reasons: WhyDifferentReason[] = (
    ["guests", "owners", "partners"] as const
  ).flatMap((audience) =>
    [1, 2, 3].map((n) => ({
      audience,
      label: t(`${audience}.label`),
      title: t(`${audience}.r${n}Title`),
      body: t(`${audience}.r${n}Body`),
    })),
  );

  return (
    <section className="bg-ink-2 border-t border-line py-16 sm:py-20 md:pt-28 md:pb-0">
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
      </div>

      {/* Nine reasons on the wheel */}
      <WhyDifferentGallery reasons={reasons} scrollHint={t("scrollHint")} />
    </section>
  );
}
