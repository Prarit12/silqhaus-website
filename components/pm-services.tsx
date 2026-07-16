"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import CollapsibleSection from "@/components/collapsible-section";
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
  img: string;
  featured?: boolean;
};

const SERVICES: Svc[] = [
  {
    key: "guestCommunication",
    icon: MessageSquare,
    span: "sm:col-span-2 lg:col-span-2",
    img: "/property-management/services/guest.jpg",
    featured: true,
  },
  {
    key: "pricing",
    icon: TrendingUp,
    span: "lg:col-span-1",
    img: "/property-management/services/pricing.jpg",
  },
  {
    key: "booking",
    icon: Calendar,
    span: "lg:col-span-1",
    img: "/property-management/services/booking.jpg",
  },
  {
    key: "maintenance",
    icon: Wrench,
    span: "lg:col-span-1",
    img: "/property-management/services/maintenance.jpg",
  },
  {
    key: "photography",
    icon: Camera,
    span: "lg:col-span-1",
    img: "/property-management/services/photography.jpg",
  },
  {
    key: "compliance",
    icon: ShieldCheck,
    span: "sm:col-span-2 lg:col-span-3",
    img: "/property-management/services/compliance.jpg",
  },
];

export default function PmServices() {
  const t = useTranslations("propertyManagement.services");

  return (
    <CollapsibleSection
      eyebrow={t("subtitle")}
      title={t("title")}
      intro={t("description")}
      className="bg-ink"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {SERVICES.map((s) => {
            return (
              <div
                key={s.key}
                className={`group relative overflow-hidden rounded-2xl border border-line bg-white/[0.02] p-6 sm:p-7 transition-all duration-300 hover:bg-white/[0.045] hover:border-white/20 ${s.span} ${
                  s.featured ? "sm:p-8" : ""
                }`}
              >
                {/* meaning-photo: faint by default, revealed in full colour on hover */}
                <div
                  className="pointer-events-none absolute inset-0"
                  aria-hidden="true"
                >
                  <Image
                    src={s.img}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover object-center opacity-[0.13] grayscale transition-all duration-500 ease-out group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-[1.04]"
                  />
                  {/* default heavy scrim — keeps the card dark until hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/55 transition-opacity duration-500 group-hover:opacity-0" />
                  {/* hover scrim — light, so the photo shows through and text stays legible */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
                {/* accent glow on hover */}
                <div
                  className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `${ACCENT}22` }}
                  aria-hidden="true"
                />
                <div className="relative z-10">
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
    </CollapsibleSection>
  );
}
