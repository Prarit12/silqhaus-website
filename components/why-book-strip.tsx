import { getTranslations } from "next-intl/server";
import {
  BadgePercent,
  CalendarX2,
  Headset,
  SprayCan,
  type LucideIcon,
} from "lucide-react";
import OtaRatingsRow from "@/components/ota-ratings-row";
import { OTAReviews } from "@/components/ota-reviews";

/**
 * "Why book with Silqhaus" — the four booking reassurances told as the
 * timeline of a stay (before you book → if plans change → during your
 * stay → between guests) on one connecting rail, anchored by the real
 * OTA scores. Sits where "Different by design" used to (now on About Us).
 */
export default async function WhyBookStrip() {
  const t = await getTranslations("home.whyBook");

  const moments: Array<{
    Icon: LucideIcon;
    stage: string;
    title: string;
    text: string;
  }> = [
    {
      Icon: BadgePercent,
      stage: t("bestPricingStage"),
      title: t("bestPricingTitle"),
      text: t("bestPricingText"),
    },
    {
      Icon: CalendarX2,
      stage: t("cancellationsStage"),
      title: t("cancellationsTitle"),
      text: t("cancellationsText"),
    },
    {
      Icon: Headset,
      stage: t("serviceStage"),
      title: t("serviceTitle"),
      text: t("serviceText"),
    },
    {
      Icon: SprayCan,
      stage: t("cleaningStage"),
      title: t("cleaningTitle"),
      text: t("cleaningText"),
    },
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

        {/* The four moments of a stay on one rail — horizontal on desktop,
            vertical on mobile. The rail running past the last node is the
            point: the cycle starts over for the next guest. */}
        <div className="relative mt-12 sm:mt-14">
          <div
            className="hidden lg:block absolute top-[3px] inset-x-0 h-px bg-line"
            aria-hidden="true"
          />
          <div
            className="lg:hidden absolute left-[3px] top-1.5 bottom-1.5 w-px bg-line"
            aria-hidden="true"
          />
          <ol className="grid grid-cols-1 lg:grid-cols-4 gap-y-10 lg:gap-x-10">
            {moments.map(({ Icon, stage, title, text }) => (
              <li key={title} className="relative pl-7 lg:pl-0 lg:pt-7">
                <span
                  className="absolute left-0 top-[5px] lg:top-0 w-[7px] h-[7px] rounded-full bg-white/80"
                  aria-hidden="true"
                />
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
                  {stage}
                </p>
                <div className="mt-3.5 flex items-center gap-3">
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
              </li>
            ))}
          </ol>
        </div>

        {/* The proof those habits earn — the same framed ratings banner and
            live review carousel as About Us */}
        <div className="mt-14 sm:mt-16 rounded-2xl sm:rounded-3xl border border-line bg-white/[0.02] px-6 py-9 sm:px-10 sm:py-11">
          <p className="text-center text-white/60 text-sm sm:text-base">
            {t("ratingsLead")}
          </p>
          <div className="mt-8">
            <OtaRatingsRow />
          </div>
        </div>
        <OTAReviews />
      </div>
    </section>
  );
}
