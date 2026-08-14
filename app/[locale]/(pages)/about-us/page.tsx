"use client";

import { Phone, Compass, Eye } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import OtaRatingsRow from "@/components/ota-ratings-row";
import { OTAReviews } from "@/components/ota-reviews";
import WhySilqhaus from "@/components/why-silqhaus";

/** Leadership — names are proper nouns, roles come from i18n. */
const LEADERS: {
  name: string;
  initials: string;
  roleKey: string;
  featured?: boolean;
}[] = [
  { name: "Prarit Kantong", initials: "PK", roleKey: "ceo", featured: true },
  { name: "Piriya Kantong", initials: "PK", roleKey: "coo", featured: true },
  { name: "Earn Laroeng", initials: "EL", roleKey: "cmo" },
  { name: "Lara Cohen", initials: "LC", roleKey: "gmPhuket" },
  { name: "Tim Horton", initials: "TH", roleKey: "gmPattaya" },
];

/** Photo-ready placeholder: swaps for a portrait without layout change. */
function PortraitSlot({
  initials,
  large,
}: {
  initials: string;
  large?: boolean;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_65%)]">
      <span
        className={`font-display font-light text-white/[0.08] select-none ${
          large ? "text-8xl sm:text-9xl" : "text-7xl"
        }`}
        aria-hidden="true"
      >
        {initials}
      </span>
    </div>
  );
}

export default function AboutUs() {
  const t = useTranslations("aboutUs");

  return (
    <main className="min-h-screen bg-ink">
      {/* Hero — centered statement + direct line */}
      <section className="pt-36 sm:pt-44 pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="eyebrow eyebrow--center mb-6">
            {t("hero.subtitle")}
          </span>
          <h1 className="font-display text-white text-4xl sm:text-5xl md:text-6xl font-light leading-[1.06] tracking-tight normal-case text-balance mt-6">
            {t.rich("hero.title", {
              b: (chunks) => <strong className="font-bold">{chunks}</strong>,
            })}
          </h1>
          <p className="text-white/60 mt-6 text-lg leading-relaxed max-w-2xl mx-auto">
            {t("hero.description")}
          </p>
          <a
            href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE_TEL}`}
            className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-white text-ink px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-neutral-200"
          >
            <Phone className="w-4 h-4" />
            {t("hero.cta")}
          </a>
        </div>

        {/* Wide team-photo slot — placeholder until the real photo is shot */}
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-16">
          <div className="relative aspect-[16/7] sm:aspect-[21/8] rounded-2xl sm:rounded-3xl border border-line overflow-hidden bg-white/[0.02]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_70%)]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <span className="font-display text-white/20 text-2xl sm:text-3xl font-light tracking-tight">
                Silqhaus
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/25">
                {t("hero.photoSoon")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-16 sm:py-20 border-t border-line bg-ink-2">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-white/70">
                <Compass className="w-3.5 h-3.5" />
                {t("mission.label")}
              </span>
              <p className="text-white text-xl sm:text-2xl font-light leading-snug tracking-tight mt-6 text-balance">
                {t("mission.text")}
              </p>
            </div>
            <div className="md:border-l md:border-line md:pl-16">
              <span className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-white/70">
                <Eye className="w-3.5 h-3.5" />
                {t("vision.label")}
              </span>
              <p className="text-white text-xl sm:text-2xl font-light leading-snug tracking-tight mt-6 text-balance">
                {t("vision.text")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Silqhaus — the "Different by design" pillars, moved off the
          homepage to sit with the mission and vision. */}
      <WhySilqhaus />

      {/* Leadership */}
      <section className="py-20 sm:py-24 border-t border-line">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-6 items-end mb-12 sm:mb-14">
            <h2 className="font-display text-white text-4xl sm:text-5xl font-light leading-[1.05] tracking-tight normal-case text-balance">
              {t.rich("team.title", {
                b: (chunks) => <strong className="font-bold">{chunks}</strong>,
              })}
            </h2>
            <p className="text-white/60 text-base sm:text-lg leading-relaxed lg:max-w-md lg:justify-self-end">
              {t("team.intro")}
            </p>
          </div>

          {/* Featured pair */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {LEADERS.filter((l) => l.featured).map((l) => (
              <div
                key={l.name}
                className="group relative aspect-[4/3] rounded-2xl border border-line bg-white/[0.02] overflow-hidden transition-colors duration-300 hover:border-white/20"
              >
                <PortraitSlot initials={l.initials} large />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white font-semibold text-lg tracking-tight">
                    {l.name}
                  </p>
                  <p className="text-white/60 text-sm mt-0.5">
                    {t(`team.roles.${l.roleKey}`)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Supporting trio */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {LEADERS.filter((l) => !l.featured).map((l) => (
              <div
                key={l.name}
                className="group relative aspect-[4/3] sm:aspect-[4/5] rounded-2xl border border-line bg-white/[0.02] overflow-hidden transition-colors duration-300 hover:border-white/20"
              >
                <PortraitSlot initials={l.initials} />
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white font-semibold tracking-tight">
                    {l.name}
                  </p>
                  <p className="text-white/60 text-sm mt-0.5">
                    {t(`team.roles.${l.roleKey}`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story + facts */}
      <section className="py-20 sm:py-24 border-t border-line bg-ink-2">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12 lg:items-center">
            <div>
              <h2 className="font-display text-white text-4xl sm:text-5xl font-light leading-[1.05] tracking-tight normal-case text-balance">
                {t.rich("story.title", {
                  b: (chunks) => (
                    <strong className="font-bold">{chunks}</strong>
                  ),
                })}
              </h2>
              <p className="text-white/60 mt-6 text-lg leading-relaxed max-w-xl">
                {t("story.intro")}
              </p>
            </div>
            <div className="space-y-10 lg:pl-16 lg:border-l lg:border-line">
              {(["one", "two", "three"] as const).map((k) => (
                <div key={k}>
                  <p className="font-display text-white text-5xl sm:text-6xl font-light tracking-tight">
                    {t(`story.stats.${k}.value`)}
                  </p>
                  <p className="text-white/60 mt-2.5 leading-relaxed max-w-md">
                    {t(`story.stats.${k}.label`)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Ratings banner — the 4.99 average, platform by platform */}
          <div className="mt-14 sm:mt-16 rounded-2xl sm:rounded-3xl border border-line bg-white/[0.02] px-6 py-9 sm:px-10 sm:py-11">
            <p className="text-center text-white/60 text-sm sm:text-base">
              {t("story.ratingsTitle")}
            </p>
            <div className="mt-8">
              <OtaRatingsRow />
            </div>
          </div>

          {/* What guests say — live reviews across platforms */}
          <OTAReviews />
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 sm:py-24 border-t border-line">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-white text-3xl sm:text-4xl font-light leading-[1.08] tracking-tight normal-case text-balance">
            {t("cta.title")}
          </h2>
          <p className="text-white/60 mt-5 text-lg leading-relaxed">
            {t("cta.description")}
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3.5 justify-center">
            <Link
              href="/property-management"
              className="rounded-full bg-white text-ink px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-neutral-200"
            >
              {t("cta.propertyManagement")}
            </Link>
            <Link
              href="/our-property"
              className="rounded-full border border-line text-white px-7 py-3.5 text-sm font-semibold transition-colors hover:border-white/40"
            >
              {t("cta.browseProperties")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
