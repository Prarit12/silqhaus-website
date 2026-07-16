"use client";

import Image from "next/image";
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
    <section className="bg-ink py-24 sm:py-28 md:py-32 border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="eyebrow mb-5">{t("subtitle")}</span>
          <h2 className="font-display text-white text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] tracking-tight normal-case text-balance mt-5">
            {t("title")}
          </h2>
          <p className="text-white/60 mt-6 text-lg leading-relaxed">
            {t("description")}
          </p>
        </div>

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

        {/* Distribution — the booking platforms we list every home on */}
        <div className="mt-4 sm:mt-5 rounded-2xl sm:rounded-3xl border border-line bg-white/[0.02] px-6 py-9 sm:px-10 sm:py-11">
          <p className="text-center text-white/60 text-sm sm:text-base">
            {t("distribution.title")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14 lg:gap-x-16">
            {/* Airbnb — Bélo mark + wordmark */}
            <span className="inline-flex items-center gap-2 text-white/80 transition-colors duration-300 hover:text-white">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12.001 18.275c-1.353-1.697-2.148-3.184-2.413-4.457-.263-1.027-.16-1.848.291-2.465.477-.71 1.188-1.056 2.121-1.056s1.643.345 2.12 1.063c.446.61.558 1.432.286 2.465-.291 1.298-1.085 2.785-2.412 4.458zm9.601 1.14c-.185 1.246-1.034 2.28-2.2 2.783-2.253.98-4.483-.583-6.392-2.704 3.157-3.951 3.74-7.028 2.385-9.018-.795-1.14-1.933-1.695-3.394-1.695-2.944 0-4.563 2.49-3.927 5.382.37 1.565 1.352 3.343 2.917 5.332-.98 1.085-1.91 1.856-2.732 2.333-.636.344-1.245.558-1.828.609-2.679.399-4.778-2.2-3.825-4.88.132-.345.395-.98.845-1.961l.025-.053c1.464-3.178 3.242-6.79 5.285-10.795l.053-.132.58-1.116c.45-.822.635-1.19 1.351-1.643.346-.21.77-.315 1.246-.315.954 0 1.698.558 2.016 1.007.158.239.345.557.582.953l.558 1.089.08.159c2.041 4.004 3.821 7.608 5.279 10.794l.026.025.533 1.22.318.764c.243.613.294 1.222.213 1.858zm1.22-2.39c-.186-.583-.505-1.271-.9-2.094v-.03c-1.889-4.006-3.642-7.608-5.307-10.844l-.111-.163C15.317 1.461 14.468 0 12.001 0c-2.44 0-3.476 1.695-4.535 3.898l-.081.16c-1.669 3.236-3.421 6.843-5.303 10.847v.053l-.559 1.22c-.21.504-.317.768-.345.847C-.172 20.74 2.611 24 5.98 24c.027 0 .132 0 .265-.027h.372c1.75-.213 3.554-1.325 5.384-3.317 1.829 1.989 3.635 3.104 5.382 3.317h.372c.133.027.239.027.265.027 3.37.003 6.152-3.261 4.802-6.975z" />
              </svg>
              <span className="text-[21px] font-medium tracking-tight">
                airbnb
              </span>
            </span>

            {/* Booking.com */}
            <span className="text-[21px] font-bold tracking-tight text-white/80 transition-colors duration-300 hover:text-white">
              Booking.com
            </span>

            {/* Expedia */}
            <span className="text-[21px] font-semibold tracking-tight text-white/80 transition-colors duration-300 hover:text-white">
              Expedia
            </span>

            {/* Agoda */}
            <span className="text-[21px] font-bold lowercase tracking-tight text-white/80 transition-colors duration-300 hover:text-white">
              agoda
            </span>

            {/* Vrbo */}
            <span className="text-[21px] font-semibold tracking-tight text-white/80 transition-colors duration-300 hover:text-white">
              Vrbo
            </span>

            {/* Trip.com */}
            <span className="text-[21px] font-semibold tracking-tight text-white/80 transition-colors duration-300 hover:text-white">
              Trip.com
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
