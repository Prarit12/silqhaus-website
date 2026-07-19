"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  Plane,
  TrainFront,
  TramFront,
  Ship,
  CarTaxiFront,
  Bike,
  Navigation,
  ShoppingBag,
  Info,
  Plus,
  type LucideIcon,
} from "lucide-react";

const TRANSPORT_ICONS: Record<string, LucideIcon> = {
  airports: Plane,
  airportRail: TrainFront,
  rail: TramFront,
  river: Ship,
  ride: CarTaxiFront,
  moto: Bike,
};

export default function RegionPractical({
  region,
  transportKeys = [],
  shoppingKeys = [],
  goodKeys = [],
}: {
  region: string;
  transportKeys?: string[];
  shoppingKeys?: string[];
  goodKeys?: string[];
}) {
  const t = useTranslations("experiences");
  const g = (key: string) => t(`guides.${region}.${key}`);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setOpen((o) => ({ ...o, [id]: !o[id] }));

  // A leaf row — plain function so state changes don't remount it.
  const row = (name: string, desc: string, Icon?: LucideIcon) => (
    <div
      key={name}
      className="flex items-start gap-3.5 border-t border-line py-3.5"
    >
      {Icon && (
        <span className="mt-0.5 inline-flex w-9 h-9 shrink-0 items-center justify-center rounded-full border border-line text-white/70">
          <Icon className="w-4 h-4" strokeWidth={1.5} />
        </span>
      )}
      <div className="min-w-0">
        <h4 className="text-[15px] font-semibold tracking-tight text-white">
          {name}
        </h4>
        <p className="text-white/55 text-[13px] mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );

  // A collapsible group shell.
  const group = (
    id: string,
    Icon: LucideIcon,
    title: string,
    count: number,
    body: ReactNode,
  ) => {
    const isOpen = !!open[id];
    return (
      <div className="rounded-2xl border border-line bg-white/[0.02] overflow-hidden">
        <button
          type="button"
          onClick={() => toggle(id)}
          aria-expanded={isOpen}
          className="group flex w-full items-center gap-3.5 px-5 py-4 text-left"
        >
          <span className="inline-flex w-9 h-9 shrink-0 items-center justify-center rounded-full border border-line text-white/70">
            <Icon className="w-4 h-4" strokeWidth={1.5} />
          </span>
          <span className="flex-1 text-white font-semibold tracking-tight">
            {title}
          </span>
          <span className="text-white/40 text-sm tabular-nums">{count}</span>
          <span
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-white/60 transition-all duration-300 group-hover:border-white/40 group-hover:text-white ${
              isOpen ? "rotate-45" : ""
            }`}
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
          </span>
        </button>
        <div
          className="grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none"
          style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="px-5 pb-5 pt-1">{body}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 sm:py-24 border-t border-line bg-ink-2">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-12">
          <h2 className="font-display text-white text-3xl sm:text-4xl font-light leading-[1.08] tracking-tight normal-case text-balance">
            {g("practical.title")}
          </h2>
          <p className="text-white/60 mt-4 text-lg leading-relaxed max-w-2xl">
            {g("practical.lead")}
          </p>
        </div>

        <div className="space-y-4">
          {transportKeys.length > 0 &&
            group(
              "transport",
              Navigation,
              g("transport.title"),
              transportKeys.length,
              <>
                <p className="text-white/55 text-sm mb-4 leading-relaxed">
                  {g("transport.lead")}
                </p>
                {transportKeys.map((k) =>
                  row(
                    g(`transport.items.${k}.name`),
                    g(`transport.items.${k}.desc`),
                    TRANSPORT_ICONS[k] ?? TramFront,
                  ),
                )}
              </>,
            )}

          {shoppingKeys.length > 0 &&
            group(
              "shopping",
              ShoppingBag,
              g("shopping.title"),
              shoppingKeys.length * 3,
              <>
                <p className="text-white/55 text-sm mb-4 leading-relaxed">
                  {g("shopping.lead")}
                </p>
                <div className="space-y-6 sm:grid sm:grid-cols-3 sm:gap-x-8 sm:space-y-0">
                  {shoppingKeys.map((grp) => (
                    <div key={grp}>
                      <h5 className="text-white/45 text-[11px] font-medium uppercase tracking-[0.18em] mb-1">
                        {g(`shopping.groups.${grp}.title`)}
                      </h5>
                      {(["s1", "s2", "s3"] as const).map((s) =>
                        row(
                          g(`shopping.groups.${grp}.${s}.name`),
                          g(`shopping.groups.${grp}.${s}.desc`),
                        ),
                      )}
                    </div>
                  ))}
                </div>
              </>,
            )}

          {goodKeys.length > 0 &&
            group(
              "good",
              Info,
              g("good.title"),
              goodKeys.length,
              <>
                <p className="text-white/55 text-sm mb-4 leading-relaxed">
                  {g("good.lead")}
                </p>
                <div className="sm:grid sm:grid-cols-2 sm:gap-x-8">
                  {goodKeys.map((k) =>
                    row(
                      g(`good.items.${k}.name`),
                      g(`good.items.${k}.desc`),
                    ),
                  )}
                </div>
              </>,
            )}
        </div>
      </div>
    </section>
  );
}
