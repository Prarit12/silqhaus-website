"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

// Reused imagery — the people and moments behind every stay.
const ORBS = [
  { src: "/property-management/team/3.jpg", size: 132, top: "30%", left: "46%" },
  { src: "/property-management/team/1.jpg", size: 96, top: "20%", left: "20%" },
  { src: "/property-management/team/4.jpg", size: 104, top: "24%", left: "72%" },
  { src: "/property-management/team/2.jpg", size: 68, top: "12%", left: "53%" },
  { src: "/property-management/services/guest.jpg", size: 66, top: "58%", left: "16%" },
  { src: "/property-management/services/maintenance.jpg", size: 78, top: "52%", left: "62%" },
  { src: "/property-management/services/photography.jpg", size: 88, top: "44%", left: "86%" },
  { src: "/property-management/services/booking.jpg", size: 60, top: "68%", left: "44%" },
  { src: "/property-management/services/pricing.jpg", size: 58, top: "62%", left: "30%" },
];

const POINTS = ["reply", "flex", "vendors", "anticipate", "onground"];

export default function PmGuestExperience() {
  const t = useTranslations("propertyManagement.guestExperience");

  return (
    <section className="bg-ink-2 py-24 sm:py-28 md:py-32 border-t border-line overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="eyebrow eyebrow--center mb-5">{t("eyebrow")}</span>
          <h2 className="font-display text-white text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] tracking-tight mt-6 normal-case text-balance">
            {t("title")}
          </h2>
          <p className="text-white/60 mt-6 text-lg leading-relaxed">
            {t("intro")}
          </p>
        </div>

        {/* Constellation of people & moments (desktop) */}
        <div className="relative mt-8 hidden lg:block h-[420px]">
          <svg
            viewBox="0 0 1000 460"
            className="absolute inset-0 w-full h-full"
            fill="none"
            stroke="white"
            strokeOpacity="0.06"
            strokeWidth="1"
            aria-hidden="true"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ellipse key={i} cx="500" cy="450" rx={i * 115} ry={i * 78} />
            ))}
            {[-2, -1, 0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M500 450 Q ${500 + i * 210} 120 500 20`}
              />
            ))}
          </svg>
          {ORBS.map((o, i) => (
            <div
              key={o.src}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden ring-1 ring-white/15 shadow-xl shadow-black/40"
              style={{
                width: o.size,
                height: o.size,
                top: o.top,
                left: o.left,
              }}
            >
              <Image
                src={o.src}
                alt=""
                fill
                sizes="140px"
                className="object-cover object-center grayscale opacity-90"
              />
            </div>
          ))}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
            style={{
              background:
                "linear-gradient(to bottom, transparent, var(--ink-2))",
            }}
          />
        </div>

        {/* Mobile: simple face cluster */}
        <div className="mt-10 flex justify-center gap-2 lg:hidden">
          {ORBS.slice(0, 5).map((o) => (
            <div
              key={o.src}
              className="relative w-14 h-14 rounded-full overflow-hidden ring-1 ring-white/15"
            >
              <Image
                src={o.src}
                alt=""
                fill
                sizes="56px"
                className="object-cover grayscale"
              />
            </div>
          ))}
        </div>

        {/* Guest-care points */}
        <div className="mt-14 lg:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-10">
          {POINTS.map((k) => (
            <div key={k}>
              <h3 className="text-white font-semibold text-lg leading-snug tracking-tight text-balance">
                {t(`points.${k}.title`)}
              </h3>
              <p className="text-white/55 text-sm mt-3 leading-relaxed">
                {t(`points.${k}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
