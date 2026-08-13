"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  MapPin,
  ShieldCheck,
  X,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * MonthlyFinder partner pop-up: warm illustrated header in the journey
 * cartoon language, the "same standard, all of Thailand" benefits, and a
 * copyable first-booking promo code.
 */

export const PARTNER_PROMO_CODE = "MONTHLY30";

const INK = "#171717";
const ORANGE = "#F38338";
const ORANGE_DEEP = "#C46A33";
const BLOB = "#ECEAE4";

const stroke = {
  stroke: INK,
  strokeWidth: 2.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

function PartnerArt() {
  return (
    <svg viewBox="0 0 320 150" className="w-full h-auto" aria-hidden="true">
      <ellipse cx="160" cy="132" rx="118" ry="13" fill={BLOB} />
      <circle cx="52" cy="44" r="15" fill={BLOB} />
      <circle cx="268" cy="88" r="18" fill={BLOB} />

      {/* sun */}
      <circle cx="272" cy="30" r="11" fill={ORANGE} />
      <path
        d="M272 12v-5M286 17l4-4M290 30h5"
        stroke={ORANGE_DEEP}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* birds */}
      <path {...stroke} strokeWidth={2} d="M92 26c3-3 6-3 9 0c3-3 6-3 9 0" />
      <path {...stroke} strokeWidth={2} d="M118 16c2.5-2.5 5-2.5 7.5 0c2.5-2.5 5-2.5 7.5 0" />

      {/* palm */}
      <path {...stroke} d="M56 128c-2-24 2-42 10-55" />
      <path {...stroke} d="M66 73c-10-6-21-6-30 0c10-9 22-11 30-6" />
      <path {...stroke} d="M66 73c-1-10 2-19 10-25c-6 9-7 18-4 24" />
      <path {...stroke} d="M66 73c7-7 17-9 26-6c-10 0-19 4-23 10" />
      <circle cx="64" cy="78" r="2.8" fill={ORANGE} />

      {/* map pin with a home inside — homes all over the map */}
      <path
        {...stroke}
        d="M160 122c-22-26-34-42-34-60a34 34 0 1 1 68 0c0 18-12 34-34 60Z"
        fill="#fff"
      />
      <path {...stroke} strokeWidth={2.2} d="M146 62l14-12 14 12" />
      <path {...stroke} strokeWidth={2.2} d="M149 62v16h22V62" />
      <path
        d="M157 78v-9c0-1.7 1.3-3 3-3s3 1.3 3 3v9Z"
        fill={ORANGE}
      />

      {/* hanging -30% tag */}
      <path {...stroke} d="M190 52c8 3 12 8 13 15" />
      <g transform="rotate(-12 220 78)">
        <rect x="196" y="64" width="52" height="26" rx="8" fill={ORANGE} />
        <circle cx="205" cy="77" r="2.6" fill="#fff" />
        <text
          x="228"
          y="83"
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill="#fff"
        >
          -30%
        </text>
      </g>

      {/* sparkles */}
      <path d="M236 34l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5 2.5-6Z" fill={ORANGE} />
      <path d="M104 96l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4Z" fill={ORANGE_DEEP} />
    </svg>
  );
}

interface MonthlyPartnerPopupProps {
  open: boolean;
  onClose: () => void;
}

export function MonthlyPartnerPopup({ open, onClose }: MonthlyPartnerPopupProps) {
  const t = useTranslations("monthlyInquiry.quote");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(PARTNER_PROMO_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the code is still visible to retype */
    }
  };

  const benefits = [
    { key: "partnerBenefit1", icon: MapPin },
    { key: "partnerBenefit2", icon: Zap },
    { key: "partnerBenefit3", icon: ShieldCheck },
  ] as const;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t("partnerTitle")}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40 animate-in fade-in duration-200 motion-reduce:animate-none"
        aria-label={t("partnerLater")}
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 motion-reduce:animate-none">
        {/* Illustrated header on the hero's warm band */}
        <div className="bg-[#F5F4F0] px-8 pt-5">
          <PartnerArt />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("partnerLater")}
          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full grid place-items-center bg-white/80 text-neutral-500 hover:text-ink hover:bg-white transition-colors"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="p-6 sm:p-7">
          <h2 className="text-xl font-bold normal-case tracking-normal text-ink text-balance">
            {t("partnerTitle")}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
            {t("partnerBody")}
          </p>

          {/* Same Silqhaus standard — everything monthly */}
          <ul className="mt-4 space-y-2.5">
            {benefits.map(({ key, icon: Icon }) => (
              <li
                key={key}
                className="flex items-center gap-2.5 text-sm font-medium text-ink"
              >
                <span className="w-8 h-8 rounded-full bg-[#F5F4F0] grid place-items-center shrink-0">
                  <Icon
                    className="w-4 h-4 text-ink"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </span>
                {t(key)}
              </li>
            ))}
          </ul>

          {/* First-booking promo code */}
          <div className="mt-5 rounded-xl border border-dashed border-neutral-400 bg-[#F5F4F0] px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-neutral-600">
                {t("partnerPromoLabel")}
              </p>
              <p className="mt-0.5 text-lg font-bold tracking-[0.12em] text-ink">
                {PARTNER_PROMO_CODE}
              </p>
            </div>
            <button
              type="button"
              onClick={copyCode}
              className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-ink text-white text-[13px] font-semibold hover:bg-neutral-800 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  {t("partnerCopied")}
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  {t("partnerCopy")}
                </>
              )}
            </button>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
            <a
              href="https://www.monthlyfinder.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-full bg-ink bg-[linear-gradient(90deg,#09081F_0%,#382124_45%,#673929_65%,#95522E_80%,#C46A33_92%,#F38338_100%)] text-white hover:text-white text-[15px] font-semibold hover:opacity-90 transition-opacity"
            >
              {t("partnerCta")}
              <ExternalLink className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="h-12 px-5 rounded-full border border-neutral-300 text-[15px] font-semibold text-ink hover:border-ink transition-colors"
            >
              {t("partnerLater")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
