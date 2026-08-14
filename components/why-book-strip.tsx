import { getTranslations } from "next-intl/server";
import {
  BadgePercent,
  CalendarX2,
  Headset,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

/**
 * "Why book with Silqhaus" — the four booking reassurances as one slim
 * band where the homepage's "Different by design" section used to sit
 * (that moved to About Us). Icons ride inline with the titles and the
 * columns share the site's hairline grammar — no icon-over-card grid.
 */
export default async function WhyBookStrip() {
  const t = await getTranslations("home.whyBook");

  const items: Array<{ Icon: LucideIcon; title: string; text: string }> = [
    {
      Icon: BadgePercent,
      title: t("bestPricingTitle"),
      text: t("bestPricingText"),
    },
    {
      Icon: CalendarX2,
      title: t("cancellationsTitle"),
      text: t("cancellationsText"),
    },
    { Icon: Headset, title: t("serviceTitle"), text: t("serviceText") },
    { Icon: Sparkles, title: t("cleaningTitle"), text: t("cleaningText") },
  ];

  return (
    <section className="bg-ink-2 border-t border-line py-16 sm:py-20 md:py-24">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="eyebrow">{t("eyebrow")}</span>
          <h2 className="font-display font-light text-white text-4xl sm:text-5xl leading-[1.05] tracking-tight mt-5 normal-case text-balance">
            {t("title")}
          </h2>
        </div>

        <div className="mt-12 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 sm:gap-x-10 lg:gap-x-0 lg:divide-x lg:divide-line">
          {items.map(({ Icon, title, text }) => (
            <div key={title} className="lg:px-8 lg:first:pl-0 lg:last:pr-0">
              <div className="flex items-center gap-3">
                <Icon
                  className="w-5 h-5 text-white/80 shrink-0"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <h3 className="text-white text-[17px] font-semibold tracking-tight">
                  {title}
                </h3>
              </div>
              <p className="mt-3 text-white/60 text-[15px] leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
