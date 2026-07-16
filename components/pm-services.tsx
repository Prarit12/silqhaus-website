"use client";

import { useTranslations } from "next-intl";
import {
  MessageSquare,
  TrendingUp,
  Calendar,
  Wrench,
  Camera,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const ACCENT = "#3d7bd6";

type Svc = {
  key: string;
  icon: LucideIcon;
  span: string;
  featured?: boolean;
};

const SERVICES: Svc[] = [
  {
    key: "guestCommunication",
    icon: MessageSquare,
    span: "sm:col-span-2 lg:col-span-2",
    featured: true,
  },
  { key: "pricing", icon: TrendingUp, span: "lg:col-span-1" },
  { key: "booking", icon: Calendar, span: "lg:col-span-1" },
  { key: "maintenance", icon: Wrench, span: "lg:col-span-1" },
  { key: "photography", icon: Camera, span: "lg:col-span-1" },
  { key: "compliance", icon: ShieldCheck, span: "sm:col-span-2 lg:col-span-3" },
];

export default function PmServices() {
  const t = useTranslations("propertyManagement.services");

  return (
    <section className="bg-ink py-24 sm:py-28 md:py-32 border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <h2 className="font-display text-white text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] tracking-tight normal-case text-balance">
            {t("title")}
          </h2>
          <p className="text-white/60 mt-6 text-lg leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.key}
                className={`group relative overflow-hidden rounded-2xl border border-line bg-white/[0.02] p-6 sm:p-7 transition-all duration-300 hover:bg-white/[0.045] hover:border-white/20 ${s.span} ${
                  s.featured ? "sm:p-8" : ""
                }`}
              >
                {/* accent glow on hover */}
                <div
                  className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `${ACCENT}22` }}
                  aria-hidden="true"
                />
                <div className="relative">
                  <div
                    className={`rounded-xl bg-white/[0.06] border border-line flex items-center justify-center mb-5 ${
                      s.featured ? "w-12 h-12" : "w-11 h-11"
                    }`}
                  >
                    <Icon
                      className={`text-white ${s.featured ? "w-6 h-6" : "w-5 h-5"}`}
                    />
                  </div>
                  <h3
                    className={`text-white font-semibold tracking-tight ${
                      s.featured ? "text-xl sm:text-2xl" : "text-lg"
                    }`}
                  >
                    {t(`items.${s.key}.title`)}
                  </h3>
                  <p
                    className={`text-white/55 mt-2.5 leading-relaxed ${
                      s.featured ? "text-[15px] max-w-md" : "text-sm"
                    }`}
                  >
                    {t(`items.${s.key}.description`)}
                  </p>
                  <span
                    className="mt-5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
                    style={{
                      color: ACCENT,
                      borderColor: `${ACCENT}55`,
                      background: `${ACCENT}12`,
                    }}
                  >
                    <Sparkles className="w-3 h-3" />
                    {t(`items.${s.key}.tag`)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
