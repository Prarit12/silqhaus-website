"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Users, Home, Handshake, ArrowRight, Play } from "lucide-react";
import ContactChannels from "@/components/contact-channels";

const MODELS = [
  { key: "guests", Icon: Users },
  { key: "owners", Icon: Home },
  { key: "visibility", Icon: Handshake },
] as const;

const STEPS = ["s1", "s2", "s3", "s4"] as const;

/** The four mechanics spelled out under each partnership model. */
const ROWS = ["r1", "r2", "r3", "r4"] as const;

/** What a partner can see inside the Partner OS. */
const OS_ITEMS = ["live", "split", "statement", "noChasing"] as const;

export default function ContactAgency() {
  const t = useTranslations("contactAgency");

  return (
    <main className="min-h-screen bg-ink">
      {/* ── Hero ── */}
      <section className="relative h-[52vh] min-h-[420px] flex items-end overflow-hidden">
        <Image
          src="/photos/partner-agency-partners.jpg"
          alt={t("hero.alt")}
          fill
          priority
          sizes="100vw"
          // 21:9 source: bias the crop left so the two partners stay in
          // frame when narrow viewports crop the sides away.
          className="object-cover object-[38%_center] sm:object-center"
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

      {/* ── Three partnership models ── */}
      <section className="py-14 sm:py-20 border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 mb-9 sm:mb-11">
            <h2 className="font-display text-white text-3xl sm:text-4xl font-light leading-[1.08] tracking-tight normal-case text-balance">
              {t("models.title")}
            </h2>
            <p className="text-white/55 max-w-md text-base leading-relaxed">
              {t("models.intro")}
            </p>
          </div>

          {/* One band per model — the mechanics need more room than a card gives */}
          <div className="space-y-12 sm:space-y-14">
            {MODELS.map(({ key, Icon }, i) => (
              <div
                key={key}
                className="border-t border-line pt-7 grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-6"
              >
                {/* What it is */}
                <div className="lg:col-span-1">
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex w-10 h-10 shrink-0 items-center justify-center rounded-full border border-line text-white/70"
                      aria-hidden="true"
                    >
                      <Icon className="w-4 h-4" strokeWidth={1.5} />
                    </span>
                    <span className="text-white/35 text-sm font-medium tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-xl tracking-tight mt-4 text-balance">
                    {t(`models.items.${key}.title`)}
                  </h3>
                  <p className="text-white/60 text-[15px] mt-2.5 leading-relaxed">
                    {t(`models.items.${key}.desc`)}
                  </p>
                </div>

                {/* How it actually works */}
                <dl className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                  {ROWS.map((r) => (
                    <div key={r}>
                      <dt className="text-white/45 text-[11px] font-medium uppercase tracking-[0.14em]">
                        {t(`models.items.${key}.rows.${r}.label`)}
                      </dt>
                      <dd className="text-white/75 text-sm mt-1.5 leading-relaxed">
                        {t(`models.items.${key}.rows.${r}.value`)}
                      </dd>
                    </div>
                  ))}
                  <p className="sm:col-span-2 text-white/40 text-[13px] leading-relaxed border-t border-line pt-4">
                    {t(`models.items.${key}.note`)}
                  </p>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Transparent economics ── */}
      <section className="py-14 sm:py-20 border-b border-line bg-ink-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-9 sm:mb-11">
            <h2 className="font-display text-white text-3xl sm:text-4xl font-light leading-[1.08] tracking-tight normal-case text-balance">
              {t("economics.title")}
            </h2>
            <p className="text-white/60 mt-4 text-lg leading-relaxed">
              {t("economics.intro")}
            </p>
          </div>

          {/* Hub and spokes — the four things you can see all feed the one screen */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_minmax(300px,420px)_1fr] lg:gap-x-12 lg:items-center">
            {/* Left spokes */}
            <div className="order-2 lg:order-1 grid gap-8 lg:gap-12">
              {OS_ITEMS.slice(0, 2).map((k) => (
                <div key={k} className="relative lg:text-right">
                  <h3 className="text-white font-semibold text-[15px] tracking-tight">
                    {t(`economics.items.${k}.title`)}
                  </h3>
                  <p className="text-white/55 text-sm mt-1.5 leading-relaxed">
                    {t(`economics.items.${k}.desc`)}
                  </p>
                  <span
                    className="hidden lg:block absolute top-1/2 right-[-3rem] w-12 h-px bg-line"
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>

            {/* The screen itself — placeholder until the tour is filmed */}
            <div className="order-1 lg:order-2">
              <div className="relative aspect-video rounded-2xl border border-line bg-white/[0.03] overflow-hidden flex flex-col items-center justify-center text-center px-6">
                <span
                  className="inline-flex w-14 h-14 items-center justify-center rounded-full border border-white/25 text-white"
                  aria-hidden="true"
                >
                  <Play className="w-5 h-5 ml-0.5" strokeWidth={1.5} />
                </span>
                <p className="text-white font-semibold text-[15px] tracking-tight mt-4">
                  {t("economics.video.label")}
                </p>
                <p className="text-white/45 text-[13px] mt-1">
                  {t("economics.video.hint")}
                </p>
              </div>
            </div>

            {/* Right spokes */}
            <div className="order-3 grid gap-8 lg:gap-12">
              {OS_ITEMS.slice(2).map((k) => (
                <div key={k} className="relative">
                  <h3 className="text-white font-semibold text-[15px] tracking-tight">
                    {t(`economics.items.${k}.title`)}
                  </h3>
                  <p className="text-white/55 text-sm mt-1.5 leading-relaxed">
                    {t(`economics.items.${k}.desc`)}
                  </p>
                  <span
                    className="hidden lg:block absolute top-1/2 left-[-3rem] w-12 h-px bg-line"
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
          </div>

          <p className="font-display text-white/70 text-xl sm:text-2xl font-light leading-[1.4] tracking-tight mt-10 max-w-2xl text-balance lg:ml-auto lg:text-right">
            {t("economics.caption")}
          </p>
        </div>
      </section>

      {/* ── How it works — a genuine sequence, so the numbers carry information ── */}
      <section className="py-14 sm:py-20 border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-white text-3xl sm:text-4xl font-light leading-[1.08] tracking-tight normal-case text-balance mb-9 sm:mb-11">
            {t("how.title")}
          </h2>

          <ol className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-10">
            {STEPS.map((s, i) => (
              <li key={s} className="border-t border-line py-6">
                <div className="flex items-center gap-2.5">
                  <span className="text-white/35 text-sm font-medium tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {i < STEPS.length - 1 && (
                    <ArrowRight
                      className="w-3.5 h-3.5 text-white/20 hidden xl:block"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <h3 className="text-white font-semibold text-[15px] tracking-tight mt-3">
                  {t(`how.steps.${s}.title`)}
                </h3>
                <p className="text-white/55 text-sm mt-1.5 leading-relaxed">
                  {t(`how.steps.${s}.desc`)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Talk to us ── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          <div className="lg:col-span-3">
            <h2 className="font-display text-white text-3xl sm:text-4xl font-light leading-[1.08] tracking-tight normal-case text-balance">
              {t("cta.title")}
            </h2>
            <p className="text-white/60 mt-4 text-lg leading-relaxed max-w-xl">
              {t("cta.description")}
            </p>
          </div>

          <div className="lg:col-span-2 flex flex-col">
            <ContactChannels
              phoneTitle={t("cta.phone")}
              phoneDescription={t("cta.phoneDescription")}
              emailTitle={t("cta.email")}
              emailDescription={t("cta.emailDescription")}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
