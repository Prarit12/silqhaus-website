"use client";

import { useTranslations } from "next-intl";
import { Check, Headphones, ShieldCheck, Sparkles, Wifi, Zap } from "lucide-react";

/**
 * "Your monthly journey" — the how-it-works strip as line-art cartoons:
 * ink strokes, brand-orange accents, soft neutral blobs, hand-drawn arrows
 * between steps. Pure inline SVG, no assets.
 */

const INK = "#171717";
const ORANGE = "#F38338";
const ORANGE_DEEP = "#C46A33";
const BLOB = "#ECEAE4";

const stroke = {
  stroke: INK,
  strokeWidth: 2.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

function PickHome() {
  return (
    <svg viewBox="0 0 140 110" className="w-full h-auto" aria-hidden="true">
      <ellipse cx="70" cy="88" rx="56" ry="14" fill={BLOB} />
      <circle cx="26" cy="52" r="12" fill={BLOB} />
      <circle cx="116" cy="46" r="14" fill={BLOB} />
      {/* small side houses */}
      <path {...stroke} d="M10 72v-14l10-8 10 8v14h-20Z" />
      <path {...stroke} d="M112 70v-12l9-7 9 7v12h-18Z" />
      {/* magnifier */}
      <circle cx="70" cy="46" r="27" {...stroke} fill="#fff" />
      <path
        d="M89 67l14 14"
        stroke={ORANGE_DEEP}
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* house inside the lens */}
      <path d="M56 44l14-12 14 12" {...stroke} stroke={ORANGE} />
      <path {...stroke} d="M60 44v14h20V44" />
      <path {...stroke} d="M67 58v-8h6v8" />
      {/* sparkle ticks */}
      <path {...stroke} d="M42 18l2 5M50 14l1 5M35 26l4 3" />
    </svg>
  );
}

function PickDate() {
  return (
    <svg viewBox="0 0 140 110" className="w-full h-auto" aria-hidden="true">
      <ellipse cx="70" cy="90" rx="52" ry="12" fill={BLOB} />
      <circle cx="116" cy="40" r="14" fill={BLOB} />
      {/* calendar card */}
      <rect x="32" y="28" width="76" height="60" rx="9" {...stroke} fill="#fff" />
      <path {...stroke} d="M50 28v-9M90 28v-9" />
      <path {...stroke} strokeWidth={2.2} d="M32 44h76" />
      {/* day dots */}
      <g fill={INK} opacity="0.35">
        <circle cx="46" cy="56" r="2.4" />
        <circle cx="60" cy="56" r="2.4" />
        <circle cx="74" cy="56" r="2.4" />
        <circle cx="88" cy="56" r="2.4" />
        <circle cx="46" cy="68" r="2.4" />
        <circle cx="60" cy="68" r="2.4" />
        <circle cx="46" cy="80" r="2.4" />
      </g>
      {/* the chosen move-in day */}
      <rect x="80" y="62" width="16" height="14" rx="4" fill={ORANGE} />
      <path
        d="M84 69l2.5 2.5 5-5"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* sparkle ticks */}
      <path {...stroke} d="M22 34l2 5M30 28l1 5M118 74l4 3" />
      <path d="M120 18l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5 2.5-6Z" fill={ORANGE} />
    </svg>
  );
}

function MonthlyRate() {
  return (
    <svg viewBox="0 0 140 110" className="w-full h-auto" aria-hidden="true">
      <ellipse cx="70" cy="90" rx="52" ry="12" fill={BLOB} />
      <circle cx="30" cy="36" r="13" fill={BLOB} />
      {/* house */}
      <path {...stroke} d="M46 82V50l24-20 24 20v32" />
      <path {...stroke} d="M42 82h56" />
      <path {...stroke} d="M62 82V64h16v18" />
      <path {...stroke} d="M80 44h8v8" />
      {/* string from the eave to the tag */}
      <path {...stroke} d="M94 50c6 4 8 8 8 14" />
      {/* hanging price tag */}
      <g transform="rotate(-14 108 74)">
        <rect x="92" y="62" width="36" height="23" rx="7" fill={ORANGE} />
        <circle cx="99" cy="73.5" r="2.6" fill="#fff" />
        <text
          x="114"
          y="79"
          textAnchor="middle"
          fontSize="15"
          fontWeight="700"
          fill="#fff"
        >
          ฿
        </text>
      </g>
      {/* sparkle ticks */}
      <path {...stroke} d="M34 22l2 5M42 18l1 5M27 30l4 3" />
    </svg>
  );
}

function SummaryDoc() {
  return (
    <svg viewBox="0 0 140 110" className="w-full h-auto" aria-hidden="true">
      <ellipse cx="70" cy="90" rx="50" ry="12" fill={BLOB} />
      <circle cx="30" cy="38" r="13" fill={BLOB} />
      {/* the quote sheet */}
      <rect x="42" y="20" width="58" height="72" rx="7" {...stroke} fill="#fff" />
      <path {...stroke} strokeWidth={2.2} d="M52 36h28M52 46h36M52 56h22" />
      <path {...stroke} strokeWidth={2.2} d="M50 68h42" />
      {/* total row: orange price chip + line */}
      <rect x="52" y="75" width="18" height="10" rx="3" fill={ORANGE} />
      <path {...stroke} strokeWidth={2.2} d="M76 80h14" />
      {/* ฿ badge */}
      <circle cx="104" cy="30" r="12" fill={ORANGE} />
      <text
        x="104"
        y="35.5"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="#fff"
      >
        ฿
      </text>
      {/* sparkles */}
      <path {...stroke} d="M26 68l2 5M20 78l4 3" />
      <path d="M118 62l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4Z" fill={ORANGE_DEEP} />
    </svg>
  );
}

function ConfirmChat() {
  return (
    <svg viewBox="0 0 140 110" className="w-full h-auto" aria-hidden="true">
      <ellipse cx="70" cy="90" rx="50" ry="12" fill={BLOB} />
      <circle cx="104" cy="30" r="16" fill={BLOB} />
      {/* document behind */}
      <path
        {...stroke}
        d="M84 32h26c2 0 4 2 4 4v34c0 2-2 4-4 4H84c-2 0-4-2-4-4V36c0-2 2-4 4-4Z"
      />
      <path {...stroke} d="M89 62h16M89 68h10" />
      <circle cx="97" cy="48" r="7" {...stroke} />
      {/* chat bubble in front */}
      <path
        d="M22 34c0-5 4-9 9-9h34c5 0 9 4 9 9v20c0 5-4 9-9 9H43l-11 10v-10h-1c-5 0-9-4-9-9V34Z"
        {...stroke}
        fill="#fff"
      />
      <circle cx="39" cy="42" r="1.8" fill={INK} />
      <circle cx="49" cy="42" r="1.8" fill={INK} />
      <path {...stroke} d="M38 50c3 3 9 3 12 0" />
      {/* orange check spark */}
      <circle cx="70" cy="26" r="9" fill={ORANGE} />
      <path
        d="M66.5 26.5l2.5 2.5 4.5-5"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function MoveIn() {
  return (
    <svg viewBox="0 0 140 110" className="w-full h-auto" aria-hidden="true">
      <ellipse cx="72" cy="92" rx="52" ry="12" fill={BLOB} />
      <circle cx="34" cy="66" r="16" fill={BLOB} />
      {/* person */}
      <circle cx="76" cy="26" r="9" {...stroke} fill="#fff" />
      <path {...stroke} d="M83 30l3-3M85 24h3" />
      <path {...stroke} d="M74 35c-2 10-2 16 2 22" />
      <path {...stroke} d="M76 57l-10 22M76 57l12 20" />
      <path {...stroke} d="M73 40l-14 10" />
      {/* suitcase */}
      <rect
        x="42"
        y="52"
        width="17"
        height="24"
        rx="4"
        {...stroke}
        fill="#fff"
      />
      <path {...stroke} d="M50 52v-6" />
      <circle cx="50" cy="80" r="3" {...stroke} />
      <path d="M47 62h7" stroke={ORANGE} strokeWidth="2.4" strokeLinecap="round" />
      {/* sparkles */}
      <path
        d="M112 44l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z"
        fill={ORANGE}
      />
      <path
        d="M122 70l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4Z"
        fill={ORANGE_DEEP}
      />
    </svg>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 64 28"
      className="hidden lg:block w-16 h-auto shrink-0 mt-8"
      aria-hidden="true"
    >
      <path
        d="M4 22C20 6 40 4 54 10"
        stroke={INK}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M46 6l9 3-5 8"
        stroke={INK}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

const BENEFITS = [
  { key: "incUtilities", icon: Zap },
  { key: "incWifi", icon: Wifi },
  { key: "incCleaning", icon: Sparkles },
  { key: "incService", icon: Headphones },
  { key: "incTaxes", icon: ShieldCheck },
] as const;

const WIZARD_STEPS = [
  { art: PickHome },
  { art: PickDate },
  { art: MonthlyRate },
  { art: SummaryDoc },
  { art: ConfirmChat },
] as const;

/**
 * The journey strip IS the wizard stepper: each cartoon is a clickable
 * step with its STEP label and title, dimmed until reachable.
 */
export function MonthlyJourneyStepper({
  step,
  complete,
  reachable,
  onSelect,
  className = "",
}: {
  step: number;
  complete: boolean[];
  reachable: boolean[];
  onSelect: (n: number) => void;
  className?: string;
}) {
  const t = useTranslations("monthlyInquiry.quote");
  return (
    <div className={className}>
      <p className="text-[15px] font-semibold text-ink">
        {t("journeyTitle")}
      </p>
      <ol
        className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 lg:flex lg:items-start lg:gap-2"
        aria-label="Steps"
      >
        {WIZARD_STEPS.map(({ art: Art }, i) => {
          const n = i + 1;
          const active = step === n;
          const isComplete = complete[i];
          const isReachable = reachable[i];
          return (
            <li key={n} className="contents lg:contents">
              {i > 0 && <Arrow />}
              <button
                type="button"
                onClick={() => isReachable && onSelect(n)}
                disabled={!isReachable}
                aria-current={active ? "step" : undefined}
                className={`flex flex-col items-center text-center lg:flex-1 transition-opacity disabled:cursor-not-allowed ${
                  active
                    ? "opacity-100"
                    : isComplete
                      ? "opacity-80 hover:opacity-100"
                      : isReachable
                        ? "opacity-60 hover:opacity-100"
                        : "opacity-35"
                }`}
              >
                <div className="w-full max-w-[150px]">
                  <Art />
                </div>
                <p
                  className={`mt-2 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide ${
                    active ? "text-ink" : "text-neutral-500"
                  }`}
                >
                  {isComplete && !active && (
                    <Check
                      className="w-3.5 h-3.5 text-green-700"
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                  )}
                  {t("stepLabel", { n })}
                </p>
                <p
                  className={`mt-0.5 text-sm font-medium ${
                    active ? "text-ink" : "text-neutral-500"
                  }`}
                >
                  {t(`step${n}Title`)}
                </p>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** The "Benefits of booking monthly" panel — sits on the hero's warm band. */
export function MonthlyBenefits({ className = "" }: { className?: string }) {
  const t = useTranslations("monthlyInquiry.quote");
  return (
    <div
      className={`rounded-2xl bg-white border border-neutral-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-5 sm:px-7 py-5 sm:py-6 ${className}`}
    >
      <p className="text-[17px] font-bold text-ink">{t("benefitsTitle")}</p>
      <div className="mt-4 flex flex-wrap gap-x-8 gap-y-4 lg:justify-between">
        {BENEFITS.map(({ key, icon: Icon }) => (
          <span
            key={key}
            className="flex items-center gap-2.5 text-sm font-semibold text-ink"
          >
            <span className="w-9 h-9 rounded-full bg-[#F5F4F0] grid place-items-center shrink-0">
              <Icon
                className="w-[18px] h-[18px] text-ink"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>
            {t(key)}
          </span>
        ))}
      </div>
    </div>
  );
}
