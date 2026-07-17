"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import CollapsibleSection from "@/components/collapsible-section";

const MEMBERS = [
  { img: "/property-management/team/1.jpg", roleKey: "roles.guest" },
  { img: "/property-management/team/2.jpg", roleKey: "roles.housekeeping" },
  { img: "/property-management/team/3.jpg", roleKey: "roles.maintenance" },
  { img: "/property-management/team/4.jpg", roleKey: "roles.operations" },
];

/** The SOPs every staff member is trained on and held to. */
const STANDARDS = ["sop", "trust", "checkinout", "maintenance", "response", "training"] as const;

export default function PmTeam() {
  const t = useTranslations("propertyManagement.team");

  return (
    <CollapsibleSection
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
      className="bg-ink-2"
    >
      {/* The standards — what our people are trained on, not who they know */}
      <div className="mb-12 sm:mb-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-9">
        {STANDARDS.map((k) => (
          <div key={k} className="flex items-start gap-3.5">
            <span className="mt-0.5 inline-flex w-6 h-6 shrink-0 rounded-full items-center justify-center bg-white/90">
              <Check className="w-3.5 h-3.5 text-ink" strokeWidth={3} />
            </span>
            <div>
              <h3 className="text-white font-semibold leading-snug tracking-tight text-balance">
                {t(`standards.${k}.title`)}
              </h3>
              <p className="text-white/55 text-sm mt-2 leading-relaxed">
                {t(`standards.${k}.desc`)}
              </p>
            </div>
          </div>
        ))}
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
    </CollapsibleSection>
  );
}
