"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { MapPin, GraduationCap, Award } from "lucide-react";

const MEMBERS = [
  { img: "/property-management/team/1.jpg", roleKey: "roles.guest" },
  { img: "/property-management/team/2.jpg", roleKey: "roles.housekeeping" },
  { img: "/property-management/team/3.jpg", roleKey: "roles.maintenance" },
  { img: "/property-management/team/4.jpg", roleKey: "roles.operations" },
];

export default function PmTeam() {
  const t = useTranslations("propertyManagement.team");
  const chips = [
    { icon: MapPin, key: "chips.local" },
    { icon: GraduationCap, key: "chips.trained" },
    { icon: Award, key: "chips.standard" },
  ];

  return (
    <section className="bg-ink-2 py-24 sm:py-28 md:py-32 border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 sm:mb-16">
          <span className="eyebrow mb-5">{t("eyebrow")}</span>
          <h2 className="font-display text-white text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] tracking-tight mt-6 normal-case">
            {t("title")}
          </h2>
          <p className="text-white/60 mt-6 text-lg leading-relaxed">
            {t("intro")}
          </p>
          <div className="flex flex-wrap gap-2.5 mt-8">
            {chips.map((c) => (
              <span
                key={c.key}
                className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-white/80"
              >
                <c.icon className="w-4 h-4 text-white/60" />
                {t(c.key)}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {MEMBERS.map((m) => (
            <div
              key={m.roleKey}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden ring-1 ring-line"
            >
              <Image
                src={m.img}
                alt={t(m.roleKey)}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-medium text-sm">{t(m.roleKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
