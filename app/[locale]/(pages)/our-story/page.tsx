"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

/** The twelve months, in the order they happened. */
const MILESTONES = [
  "founded",
  "pattaya",
  "licence",
  "os",
  "mali",
  "today",
] as const;

export default function OurStory() {
  const t = useTranslations("ourStory");

  return (
    <main className="min-h-screen bg-ink">
      {/* ── Hero ── */}
      <section className="relative h-[56vh] min-h-[440px] flex items-end overflow-hidden">
        <Image
          src="/photos/our-story-hero.jpg"
          alt={t("hero.alt")}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink via-black/25 to-black/10"
          aria-hidden="true"
        />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-16">
          <h1 className="font-display text-white text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] tracking-tight normal-case text-balance">
            {t("hero.title")}
          </h1>
          <p className="text-white/80 mt-4 text-lg sm:text-xl leading-relaxed max-w-2xl">
            {t("hero.description")}
          </p>
        </div>
      </section>

      {/* ── The idea, in one line ── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-display text-white text-2xl sm:text-3xl md:text-[2.25rem] font-light leading-[1.3] tracking-tight text-balance">
            {t("statement")}
          </p>
        </div>
      </section>

      {/* ── The beginning ── */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-white text-3xl sm:text-4xl font-light leading-[1.08] tracking-tight normal-case text-balance">
            {t("beginning.title")}
          </h2>
          <p className="text-white/65 mt-6 text-lg leading-relaxed text-pretty">
            {t("beginning.p1")}
          </p>
          <p className="text-white/65 mt-5 text-lg leading-relaxed text-pretty">
            {t("beginning.p2")}
          </p>
          <p className="text-white/65 mt-5 text-lg leading-relaxed text-pretty">
            {t("beginning.p3")}
          </p>
        </div>
      </section>

      {/* ── Timeline — a genuine sequence, so the dates carry the story ── */}
      <section className="py-16 sm:py-24 border-t border-line bg-ink-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 mb-10 sm:mb-14">
            <h2 className="font-display text-white text-3xl sm:text-4xl font-light leading-[1.08] tracking-tight normal-case text-balance">
              {t("timeline.title")}
            </h2>
            <p className="text-white/55 max-w-md text-base leading-relaxed">
              {t("timeline.intro")}
            </p>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12">
            {MILESTONES.map((k, i) => {
              const isLast = i === MILESTONES.length - 1;
              return (
                <li key={k} className="border-t border-line py-6">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full ${
                        isLast ? "bg-white" : "bg-white/35"
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className={`text-[11px] font-medium uppercase tracking-[0.14em] ${
                        isLast ? "text-white/70" : "text-white/45"
                      }`}
                    >
                      {t(`timeline.items.${k}.date`)}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-[17px] tracking-tight mt-3 text-balance">
                    {t(`timeline.items.${k}.title`)}
                  </h3>
                  <p className="text-white/55 text-sm mt-2 leading-relaxed">
                    {t(`timeline.items.${k}.desc`)}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── Founder quote ── */}
      <section className="py-16 sm:py-24 border-t border-line">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <figure>
            <blockquote className="font-display text-white text-2xl sm:text-3xl md:text-[2.25rem] font-light leading-[1.3] tracking-tight text-balance">
              {t("quote.text")}
            </blockquote>
            <figcaption className="mt-7 flex items-center gap-3.5">
              <span className="w-10 h-px bg-line" aria-hidden="true" />
              <span>
                <span className="block text-white font-semibold text-sm tracking-tight">
                  {t("quote.attribution")}
                </span>
                <span className="block text-white/50 text-[13px] mt-0.5">
                  {t("quote.role")}
                </span>
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── A hotel, decentralized ── */}
      <section className="py-16 sm:py-24 border-t border-line bg-ink-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-x-14 gap-y-6">
          <h2 className="lg:col-span-1 font-display text-white text-3xl sm:text-4xl font-light leading-[1.08] tracking-tight normal-case text-balance">
            {t("decentralized.title")}
          </h2>
          <div className="lg:col-span-2">
            <p className="text-white/65 text-lg leading-relaxed text-pretty">
              {t("decentralized.p1")}
            </p>
            <p className="text-white/65 mt-5 text-lg leading-relaxed text-pretty">
              {t("decentralized.p2")}
            </p>
          </div>
        </div>
      </section>

      {/* ── The system behind it ── */}
      <section className="py-16 sm:py-24 border-t border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-x-14 gap-y-6">
          <h2 className="lg:col-span-1 font-display text-white text-3xl sm:text-4xl font-light leading-[1.08] tracking-tight normal-case text-balance">
            {t("technology.title")}
          </h2>
          <div className="lg:col-span-2">
            <p className="text-white/65 text-lg leading-relaxed text-pretty">
              {t("technology.p1")}
            </p>
            <p className="text-white/65 mt-5 text-lg leading-relaxed text-pretty">
              {t("technology.p2")}
            </p>
          </div>
        </div>
      </section>

      {/* ── Philosophy & local knowledge — paired to vary the rhythm ── */}
      <section className="py-16 sm:py-24 border-t border-line bg-ink-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-10">
          {(["philosophy", "local"] as const).map((k) => (
            <div key={k} className="border-t border-line pt-6">
              <h2 className="font-display text-white text-2xl sm:text-3xl font-light leading-[1.1] tracking-tight normal-case text-balance">
                {t(`${k}.title`)}
              </h2>
              <p className="text-white/65 mt-4 text-[17px] leading-relaxed text-pretty">
                {t(`${k}.text`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Looking forward ── */}
      <section className="py-16 sm:py-24 border-t border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-x-14 gap-y-6">
          <h2 className="lg:col-span-1 font-display text-white text-3xl sm:text-4xl font-light leading-[1.08] tracking-tight normal-case text-balance">
            {t("forward.title")}
          </h2>
          <div className="lg:col-span-2">
            <p className="text-white/65 text-lg leading-relaxed text-pretty">
              {t("forward.p1")}
            </p>
            <p className="font-display text-white text-xl sm:text-2xl font-light leading-[1.4] tracking-tight mt-6 text-balance">
              {t("forward.p2")}
            </p>
          </div>
        </div>
      </section>

      {/* ── Close ── */}
      <section className="py-16 sm:py-20 border-t border-line bg-ink-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-display text-white text-2xl sm:text-3xl font-light leading-[1.1] tracking-tight normal-case text-balance">
              {t("cta.title")}
            </p>
            <p className="text-white/55 mt-2 text-base leading-relaxed">
              {t("cta.description")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3.5">
            <Link
              href="/our-property"
              className="inline-flex items-center gap-2 rounded-full bg-white text-ink px-6 py-3 text-sm font-semibold transition-colors hover:bg-neutral-200"
            >
              {t("cta.villas")}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact-owner"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 text-white px-6 py-3 text-sm font-medium transition-colors hover:border-white hover:bg-white/10"
            >
              {t("cta.partner")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
