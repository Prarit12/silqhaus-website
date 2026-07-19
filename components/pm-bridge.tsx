"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowDown } from "lucide-react";

/**
 * Bridge between the hero pitch and the chapter rows below it:
 * a short identity statement — who Silqhaus is — plus a cue that
 * the sections underneath open on click.
 */
export default function PmBridge() {
  const t = useTranslations("propertyManagement.bridge");

  return (
    <section className="relative bg-ink py-24 sm:py-28 md:py-36 border-t border-line overflow-hidden">
      {/* Villa photo, held back so the statement stays the subject */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/property-management/hero-2026.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="eyebrow eyebrow--center mb-6">{t("eyebrow")}</span>
        <p className="font-display text-white/60 text-3xl sm:text-4xl md:text-[2.75rem] font-light leading-[1.25] tracking-tight normal-case text-balance mt-6">
          {t.rich("statement", {
            b: (chunks) => (
              <strong className="font-normal text-white">{chunks}</strong>
            ),
          })}
        </p>
        <p className="mt-10 inline-flex items-center gap-2.5 text-sm text-white/50">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line">
            <ArrowDown className="w-3.5 h-3.5" strokeWidth={1.5} />
          </span>
          {t("cue")}
        </p>
      </div>
    </section>
  );
}
