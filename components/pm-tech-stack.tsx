"use client";

import { useTranslations } from "next-intl";
import {
  Check,
  Globe,
  Camera,
  ShieldCheck,
  Calendar,
  FileText,
  ClipboardList,
} from "lucide-react";
import CollapsibleSection from "@/components/collapsible-section";

/** Single restrained data accent used inside the white product mockups. */
const ACCENT = "#3d7bd6";

/* ── Third-party platforms that plug into Silqhaus OS ──
   Monochrome wordmark lockups keep the strip on-brand; swap in official
   SVG/PNG marks here later if desired. */
const CONNECTORS = [
  {
    key: "pms",
    logo: (
      <span className="text-white text-[26px] font-semibold tracking-tight">
        Guesty
      </span>
    ),
  },
  {
    key: "pricing",
    logo: (
      <span className="text-white text-[26px] tracking-tight">
        <span className="font-semibold">Price</span>
        <span className="font-light">Labs</span>
      </span>
    ),
  },
  {
    key: "data",
    logo: (
      <span className="text-white text-[26px] tracking-tight">
        <span className="font-semibold">Air</span>
        <span className="font-light tracking-[0.08em]">DNA</span>
      </span>
    ),
  },
] as const;

/* ── Product mockup: Silqhaus OS operations dashboard ── */
function CardOS() {
  const rows = [
    { name: "Silq Beachfront 4BR", status: "Check-in 3:00 PM", tone: "accent" },
    { name: "PUM5 Pool Villa", status: "Cleaning in progress", tone: "muted" },
    { name: "Andaman Sky Penthouse", status: "Occupied · night 3", tone: "muted" },
    { name: "Bangtao Garden Villa", status: "Checkout 11:00 AM", tone: "muted" },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-neutral-100">
        <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
        <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
        <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
        <span className="ml-2 text-neutral-400 text-xs font-medium">
          Silqhaus OS
        </span>
        <span className="ml-auto text-[10px] text-neutral-400">Today</span>
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-neutral-900 font-semibold text-sm">
            Today · Operations
          </p>
          <span className="text-[11px] text-neutral-400">12 properties</span>
        </div>
        <div className="space-y-2">
          {rows.map((r) => (
            <div
              key={r.name}
              className="flex items-center gap-3 rounded-xl border border-neutral-100 px-3 py-2.5"
            >
              <span className="w-8 h-8 rounded-lg bg-neutral-100 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-neutral-900 truncate">
                  {r.name}
                </p>
                <p className="text-[11px] text-neutral-400 truncate">
                  {r.status}
                </p>
              </div>
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  background: r.tone === "accent" ? ACCENT : "#d4d4d4",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Product mockup: Mali AI guest chat ── */
function CardMali() {
  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
          style={{ background: ACCENT }}
        >
          M
        </span>
        <div className="leading-tight">
          <p className="text-[13px] font-semibold text-neutral-900">Mali</p>
          <p className="text-[11px] text-neutral-400 flex items-center gap-1">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: ACCENT }}
            />
            AI Guest Manager · online
          </p>
        </div>
      </div>
      <div className="p-4 space-y-2.5">
        <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-neutral-100 px-3.5 py-2 text-[12.5px] text-neutral-700">
          请问几点可以入住？
        </div>
        <div
          className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm px-3.5 py-2 text-[12.5px] text-white"
          style={{ background: "#171717" }}
        >
          您好！入住时间为下午 3 点起 😊 需要我帮您安排提前入住吗？
        </div>
        <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-neutral-100 px-3.5 py-2 text-[12.5px] text-neutral-700">
          Can we get late checkout?
        </div>
        <div
          className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm px-3.5 py-2 text-[12.5px] text-white"
          style={{ background: "#171717" }}
        >
          Absolutely — I've arranged a 1 PM checkout for you. Anything else? 🌴
        </div>
      </div>
      <div className="px-4 py-2.5 border-t border-neutral-100 flex items-center gap-2 text-[11px] text-neutral-400">
        <Globe className="w-3.5 h-3.5" />
        Replies in seconds · 24/7 · any language
      </div>
    </div>
  );
}

/* ── Product mockup: staff app task, photo-verified (phone frame) ── */
function CardStaff() {
  const checks = ["Pool skimmed & tested", "Linens replaced", "Amenities restocked"];
  return (
    <div className="mx-auto w-[240px] rounded-[2rem] border-[6px] border-neutral-900 bg-neutral-900 shadow-2xl shadow-black/50">
      <div className="rounded-[1.5rem] bg-white overflow-hidden">
        <div className="px-4 pt-4 pb-3">
          <p className="text-[11px] text-neutral-400">Task · PUM5 Pool Villa</p>
          <p className="text-[15px] font-semibold text-neutral-900">
            Turnover clean
          </p>
        </div>
        <div className="grid grid-cols-2 gap-1.5 px-4">
          {["Before", "After"].map((label) => (
            <div
              key={label}
              className="relative aspect-[4/3] rounded-lg bg-neutral-100 flex items-end p-1.5"
            >
              <Camera className="absolute inset-0 m-auto w-5 h-5 text-neutral-300" />
              <span className="relative text-[9px] font-medium text-neutral-500 bg-white/80 rounded px-1">
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 space-y-2">
          {checks.map((c) => (
            <div key={c} className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                style={{ background: ACCENT }}
              >
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              </span>
              <span className="text-[12px] text-neutral-700">{c}</span>
            </div>
          ))}
        </div>
        <div className="px-4 py-2.5 border-t border-neutral-100 flex items-center gap-1.5 text-[10.5px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5" style={{ color: ACCENT }} />
          Completed 10:42 · verified · by Nong A.
        </div>
      </div>
    </div>
  );
}

/* ── Product mockup: homeowner portal ── */
function CardPortal() {
  const docs = [
    { icon: FileText, label: "March statement", meta: "PDF" },
    { icon: ClipboardList, label: "Task history", meta: "24 logged" },
    { icon: Calendar, label: "Booking calendar", meta: "6 upcoming" },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-neutral-400">Owner Portal</p>
          <p className="text-[13px] font-semibold text-neutral-900">
            Silq Beachfront 4BR
          </p>
        </div>
        <span className="text-[10px] rounded-full bg-neutral-100 px-2 py-1 text-neutral-500">
          Live
        </span>
      </div>
      <div className="p-4">
        {/* calendar strip */}
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: 12 }).map((_, i) => {
            const booked = [2, 3, 4, 7, 8].includes(i);
            return (
              <span
                key={i}
                className="flex-1 h-7 rounded-md"
                style={{
                  background: booked ? ACCENT : "#f1f1f1",
                  opacity: booked ? 1 : 1,
                }}
              />
            );
          })}
        </div>
        <div className="space-y-2">
          {docs.map((d) => (
            <div
              key={d.label}
              className="flex items-center gap-3 rounded-xl border border-neutral-100 px-3 py-2.5"
            >
              <span className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                <d.icon className="w-4 h-4 text-neutral-500" />
              </span>
              <span className="text-[13px] font-medium text-neutral-900 flex-1">
                {d.label}
              </span>
              <span className="text-[11px] text-neutral-400">{d.meta}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PmTechStack() {
  const t = useTranslations("propertyManagement.techStack");
  const steps = [
    { key: "os", card: <CardOS /> },
    { key: "mali", card: <CardMali /> },
    { key: "staff", card: <CardStaff /> },
    { key: "portal", card: <CardPortal /> },
  ] as const;

  return (
    <CollapsibleSection
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
      className="bg-ink"
    >
      {/* Compact 2×2 product cards */}
      <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
          {steps.map((s, i) => (
            <div
              key={s.key}
              className="flex flex-col rounded-2xl border border-line bg-white/[0.02] p-5 sm:p-6"
            >
              <div className="flex items-start gap-3.5 mb-5">
                <span className="shrink-0 mt-0.5 inline-flex items-center justify-center w-8 h-8 rounded-lg border border-line text-white/60 text-xs font-medium">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-white text-lg sm:text-xl font-semibold tracking-tight leading-snug">
                    {t(`steps.${s.key}.title`)}
                  </h3>
                  <p className="text-white/55 mt-1.5 text-sm leading-relaxed">
                    {t(`steps.${s.key}.desc`)}
                  </p>
                </div>
              </div>
              <div className="mt-auto flex flex-col justify-center rounded-xl bg-white/[0.03] border border-line p-4 sm:p-5 h-[420px] sm:h-[452px]">
                {s.card}
              </div>
            </div>
          ))}
        </div>

        {/* Connectors — best-in-class third-party platforms that plug into the OS */}
        <div className="mt-16 sm:mt-20 pt-12 sm:pt-14 border-t border-line">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 mb-9 sm:mb-11">
            <div className="max-w-2xl">
              <span className="eyebrow mb-4">{t("connectors.eyebrow")}</span>
              <h3 className="font-display text-white text-2xl sm:text-3xl md:text-[2.5rem] font-light leading-[1.1] tracking-tight mt-4 normal-case text-balance">
                {t("connectors.title")}
              </h3>
              <p className="text-white/60 mt-4 text-base sm:text-lg leading-relaxed">
                {t("connectors.intro")}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-white/70">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: ACCENT }}
              />
              {t("connectors.badge")}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {CONNECTORS.map((c) => (
              <div
                key={c.key}
                className="group flex flex-col rounded-2xl border border-line bg-white/[0.02] p-6 transition-colors duration-300 hover:bg-white/[0.045] hover:border-white/15"
              >
                <span className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-white/40">
                  {t(`connectors.items.${c.key}.category`)}
                </span>
                <div className="mt-5 mb-6 flex min-h-[40px] flex-1 items-center">
                  {c.logo}
                </div>
                <p className="text-white/55 text-sm leading-relaxed">
                  {t(`connectors.items.${c.key}.role`)}
                </p>
              </div>
            ))}
          </div>
        </div>
    </CollapsibleSection>
  );
}
