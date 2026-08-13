"use client";

import { useEffect, useState } from "react";
import {
  Handshake,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { CircularGallery } from "@/components/ui/circular-gallery";

/**
 * The nine "Different by design" reasons on a scroll-rotated wheel.
 * Falls back to a simple stacked list when the user prefers reduced
 * motion (the wheel is pure decoration; the content is identical).
 */

const ICONS: Record<string, LucideIcon> = {
  guests: Sparkles,
  owners: TrendingUp,
  partners: Handshake,
};

export interface WhyDifferentReason {
  audience: "guests" | "owners" | "partners";
  label: string;
  title: string;
  body: string;
}

function ReasonCard({ reason }: { reason: WhyDifferentReason }) {
  const Icon = ICONS[reason.audience];
  return (
    <article className="w-[280px] sm:w-[330px] min-h-[220px] rounded-2xl border border-line bg-ink-2 shadow-[0_18px_50px_rgba(0,0,0,0.45)] p-6">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex w-8 h-8 shrink-0 items-center justify-center rounded-full border border-line text-white/80">
          <Icon className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
          {reason.label}
        </span>
      </div>
      <p className="mt-4 text-white font-medium text-[17px] leading-snug">
        {reason.title}
      </p>
      <p className="mt-2 text-white/60 text-sm leading-relaxed text-pretty">
        {reason.body}
      </p>
    </article>
  );
}

export default function WhyDifferentGallery({
  reasons,
  scrollHint,
}: {
  reasons: WhyDifferentReason[];
  scrollHint: string;
}) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (reducedMotion) {
    return (
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
        {reasons.map((r) => (
          <ReasonCard key={r.title} reason={r} />
        ))}
      </div>
    );
  }

  return (
    <div data-circular-scroll className="relative" style={{ height: "400vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <p className="absolute top-24 left-1/2 -translate-x-1/2 z-10 text-[13px] text-white/40">
          {scrollHint}
        </p>
        <CircularGallery
          items={reasons.map((r) => ({
            id: r.title,
            content: <ReasonCard reason={r} />,
          }))}
        />
      </div>
    </div>
  );
}
