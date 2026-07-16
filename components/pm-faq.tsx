"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Phone } from "lucide-react";

/** Question keys per category — content lives in the i18n messages. */
const CATEGORIES = {
  fees: ["q1", "q2", "q3", "q4", "q5", "q6", "q7"],
  start: ["q1", "q2", "q3", "q4", "q5", "q6", "q7"],
  care: ["q1", "q2", "q3", "q4", "q5", "q6", "q7"],
  tech: ["q1", "q2", "q3", "q4", "q5", "q6", "q7"],
} as const;

type CategoryKey = keyof typeof CATEGORIES;

const TABS: CategoryKey[] = ["fees", "start", "care", "tech"];

/** Circled question marker — same motif as the comparison table's "?". */
function QBadge({ inverted }: { inverted?: boolean }) {
  return (
    <span
      className={`inline-flex w-9 h-9 shrink-0 rounded-full items-center justify-center text-[15px] font-semibold leading-none ${
        inverted
          ? "bg-ink text-white"
          : "border border-line text-white/60"
      }`}
      aria-hidden="true"
    >
      ?
    </span>
  );
}

export default function PmFaq() {
  const t = useTranslations("propertyManagement.faq");
  const [tab, setTab] = useState<CategoryKey>("fees");
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const colsRef = useRef<HTMLDivElement>(null);

  const selectTab = (key: CategoryKey) => {
    setTab(key);
    setExpanded(false);
  };

  // Only show the fade + "see all" control when the collapsed container
  // actually hides content — re-checked on tab switch and resize.
  useEffect(() => {
    const measure = () => {
      const el = colsRef.current;
      if (!el) return;
      setOverflowing(el.scrollHeight > el.clientHeight + 16);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [tab, expanded]);

  const questions = CATEGORIES[tab];
  const collapsed = !expanded && overflowing;

  return (
    <section className="bg-ink-2 py-24 sm:py-28 border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — heading left, direct line right */}
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-white text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] tracking-tight normal-case text-balance">
              {t("title")}
            </h2>
            <p className="text-white/60 mt-5 text-lg leading-relaxed">
              {t("description")}
            </p>
          </div>
          <a
            href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE_TEL}`}
            className="inline-flex items-center gap-2.5 rounded-full bg-white text-ink px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-neutral-200"
          >
            <Phone className="w-4 h-4" />
            {t("contact")}
          </a>
        </div>

        {/* Category tabs */}
        <div className="mt-10 sm:mt-12 inline-flex max-w-full overflow-x-auto rounded-full border border-line p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => selectTab(key)}
              aria-pressed={tab === key}
              className={`whitespace-nowrap rounded-full px-4 sm:px-5 py-2 text-sm font-medium transition-colors ${
                tab === key
                  ? "bg-white text-ink"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {t(`tabs.${key}`)}
            </button>
          ))}
        </div>

        {/* Masonry of Q&As — collapsed to ~two rows with a fade, expandable */}
        <div className="relative mt-10 sm:mt-12">
          <div
            ref={colsRef}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start ${
              expanded ? "" : "max-h-[440px] sm:max-h-[480px] overflow-hidden"
            }`}
          >
            {questions.map((q, i) =>
              i === 0 ? (
                /* Featured question — the one owners ask first */
                <div
                  key={`${tab}-${q}`}
                  className="rounded-2xl bg-white p-6 sm:p-7"
                >
                  <QBadge inverted />
                  <h3 className="text-ink font-semibold text-lg leading-snug tracking-tight mt-5 text-balance">
                    {t(`categories.${tab}.${q}.q`)}
                  </h3>
                  <p className="text-neutral-600 text-[15px] mt-3 leading-relaxed">
                    {t(`categories.${tab}.${q}.a`)}
                  </p>
                </div>
              ) : (
                <div key={`${tab}-${q}`} className="px-1 py-4">
                  <QBadge />
                  <h3 className="text-white font-semibold text-[17px] leading-snug tracking-tight mt-4 text-balance">
                    {t(`categories.${tab}.${q}.q`)}
                  </h3>
                  <p className="text-white/55 text-[15px] mt-2.5 leading-relaxed">
                    {t(`categories.${tab}.${q}.a`)}
                  </p>
                </div>
              ),
            )}
          </div>

          {/* Fade + reveal control — only when content is actually hidden */}
          {collapsed && (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-44"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, var(--ink-2) 82%)",
              }}
              aria-hidden="true"
            />
          )}
          {(collapsed || expanded) && (
            <div
              className={`flex justify-center ${
                expanded ? "mt-2" : "absolute inset-x-0 bottom-5"
              }`}
            >
              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                aria-expanded={expanded}
                className="rounded-full border border-line bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink"
              >
                {expanded ? t("showLess") : t("seeAll")}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
