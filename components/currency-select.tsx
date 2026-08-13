"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Flag + code currency dropdown for the monthly quote, styled after the
 * header language switcher (inline SVG flags, no external assets).
 */

export const CURRENCY_OPTIONS = [
  { code: "THB", symbol: "฿" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "CNY", symbol: "¥" },
  { code: "RUB", symbol: "₽" },
] as const;
export type CurrencyCode = (typeof CURRENCY_OPTIONS)[number]["code"];

function Flag({ code }: { code: CurrencyCode }) {
  const svg = (() => {
    switch (code) {
      case "THB":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full" aria-hidden="true">
            <g fillRule="evenodd">
              <path fill="#f4f5f8" d="M0 0h640v480H0z" />
              <path fill="#2d2a4a" d="M0 162.5h640v160H0z" />
              <path fill="#a51931" d="M0 0h640v80H0zm0 400h640v80H0z" />
              <path fill="#f4f5f8" d="M0 80h640v82.5H0zm0 240h640v80H0z" />
            </g>
          </svg>
        );
      case "USD":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full" aria-hidden="true">
            <path fill="#fff" d="M0 0h640v480H0z" />
            <path
              fill="#B22234"
              d="M0 0h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0z"
            />
            <path fill="#3C3B6E" d="M0 0h256v259H0z" />
            <g fill="#fff">
              <circle cx="43" cy="45" r="10" />
              <circle cx="128" cy="45" r="10" />
              <circle cx="213" cy="45" r="10" />
              <circle cx="86" cy="100" r="10" />
              <circle cx="171" cy="100" r="10" />
              <circle cx="43" cy="155" r="10" />
              <circle cx="128" cy="155" r="10" />
              <circle cx="213" cy="155" r="10" />
              <circle cx="86" cy="210" r="10" />
              <circle cx="171" cy="210" r="10" />
            </g>
          </svg>
        );
      case "EUR":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full" aria-hidden="true">
            <path fill="#039" d="M0 0h640v480H0z" />
            <g fill="#FC0">
              <circle cx="320" cy="130" r="16" />
              <circle cx="375" cy="145" r="16" />
              <circle cx="415" cy="185" r="16" />
              <circle cx="430" cy="240" r="16" />
              <circle cx="415" cy="295" r="16" />
              <circle cx="375" cy="335" r="16" />
              <circle cx="320" cy="350" r="16" />
              <circle cx="265" cy="335" r="16" />
              <circle cx="225" cy="295" r="16" />
              <circle cx="210" cy="240" r="16" />
              <circle cx="225" cy="185" r="16" />
              <circle cx="265" cy="145" r="16" />
            </g>
          </svg>
        );
      case "CNY":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full" aria-hidden="true">
            <path fill="#EE1C25" d="M0 0h640v480H0z" />
            <path
              fill="#FF0"
              d="M120 50l15.7 48.4h50.9l-41.2 29.9 15.8 48.3L120 146.7l-41.2 29.9 15.8-48.3-41.2-29.9h50.9z"
            />
            <g fill="#FF0">
              <circle cx="232" cy="58" r="14" />
              <circle cx="272" cy="104" r="14" />
              <circle cx="272" cy="160" r="14" />
              <circle cx="232" cy="204" r="14" />
            </g>
          </svg>
        );
      case "RUB":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full" aria-hidden="true">
            <path fill="#fff" d="M0 0h640v160H0z" />
            <path fill="#0039A6" d="M0 160h640v160H0z" />
            <path fill="#D52B1E" d="M0 320h640v160H0z" />
          </svg>
        );
    }
  })();
  return (
    <span className="inline-flex w-6 h-[18px] rounded-[3px] overflow-hidden ring-1 ring-black/10 shrink-0">
      {svg}
    </span>
  );
}

interface CurrencySelectProps {
  value: CurrencyCode;
  onChange: (code: CurrencyCode) => void;
}

export function CurrencySelect({ value, onChange }: CurrencySelectProps) {
  const t = useTranslations("monthlyInquiry.quote");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("currencyLabel")}
        className="inline-flex items-center gap-2 h-9 pl-2.5 pr-3 rounded-full border border-neutral-300 bg-white text-[13px] font-semibold text-ink hover:border-ink transition-colors"
      >
        <Flag code={value} />
        {value}
        <ChevronDown
          className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t("currencyLabel")}
          className="absolute top-full right-0 z-50 mt-2 w-56 bg-white rounded-xl border border-neutral-200 shadow-xl overflow-hidden"
        >
          {CURRENCY_OPTIONS.map((c) => (
            <button
              key={c.code}
              type="button"
              role="option"
              aria-selected={value === c.code}
              onClick={() => {
                onChange(c.code);
                setOpen(false);
              }}
              className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 text-left transition-colors ${
                value === c.code ? "bg-neutral-50" : "hover:bg-neutral-50"
              }`}
            >
              <Flag code={c.code} />
              <span className="text-[13px] font-semibold text-ink">
                {c.code}
              </span>
              <span className="text-[13px] text-neutral-500 truncate">
                {t(`currencies.${c.code}`)}
              </span>
              {value === c.code && (
                <Check
                  className="w-4 h-4 ml-auto text-ink shrink-0"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
