"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
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

type Pin = { x: number; y: number; side: "left" | "right" };

/** Map image + per-item pin positions, keyed to the region's map crop. */
const MAPS: Record<string, { image: string; pins: Record<string, Pin> }> = {
  bangkok: {
    image: "/experiences/bangkok/map.jpg",
    pins: {
      "transport:river": { x: 188, y: 505, side: "left" },
      "shopping:malls:s1": { x: 271, y: 406, side: "right" }, // Siam Paragon
      "shopping:malls:s2": { x: 214, y: 520, side: "left" }, // ICONSIAM
      "shopping:malls:s3": { x: 408, y: 452, side: "right" }, // EM District
      "shopping:markets:s1": { x: 330, y: 205, side: "right" }, // Chatuchak
      "shopping:markets:s2": { x: 302, y: 360, side: "right" }, // Pratunam
      "shopping:markets:s3": { x: 196, y: 440, side: "left" }, // Sampeng
      "shopping:night:s1": { x: 476, y: 452, side: "left" }, // Talad Rot Fai
      "shopping:night:s2": { x: 220, y: 486, side: "right" }, // Warehouse 30
      "shopping:night:s3": { x: 200, y: 566, side: "left" }, // Asiatique
    },
  },
};

const shortLabel = (name: string) =>
  name.split(" & ")[0].split(" (")[0].split(", ")[0];

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
  const [active, setActive] = useState<string | null>(null);
  const map = MAPS[region];
  const pins = map?.pins ?? {};

  const toggle = (id: string) =>
    setOpen((o) => ({ ...o, [id]: !o[id] }));

  // A leaf row — plain function (not a component) so state changes don't remount it.
  const row = (id: string, name: string, desc: string, Icon?: LucideIcon) => {
    const hasPin = !!pins[id];
    return (
      <div
        key={id}
        onMouseEnter={hasPin ? () => setActive(id) : undefined}
        onMouseLeave={hasPin ? () => setActive(null) : undefined}
        className={`flex items-start gap-3.5 border-t border-line py-3.5 px-2 -mx-2 rounded-lg transition-colors duration-300 ${
          hasPin ? "cursor-pointer" : ""
        } ${active === id ? "bg-white/[0.06]" : hasPin ? "hover:bg-white/[0.03]" : ""}`}
      >
        {Icon && (
          <span className="mt-0.5 inline-flex w-9 h-9 shrink-0 items-center justify-center rounded-full border border-line text-white/70">
            <Icon className="w-4 h-4" strokeWidth={1.5} />
          </span>
        )}
        <div className="min-w-0">
          <h4 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-white">
            {hasPin && (
              <span
                className={`inline-block w-1.5 h-1.5 shrink-0 rounded-full border transition-all duration-300 ${
                  active === id
                    ? "bg-white border-white shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                    : "border-white/40"
                }`}
                aria-hidden="true"
              />
            )}
            {name}
          </h4>
          <p className="text-white/55 text-[13px] mt-1 leading-relaxed">
            {desc}
          </p>
        </div>
      </div>
    );
  };

  // A collapsible group shell — also a plain function.
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 sm:mb-12">
          <h2 className="font-display text-white text-3xl sm:text-4xl font-light leading-[1.08] tracking-tight normal-case text-balance">
            {g("practical.title")}
          </h2>
          <p className="text-white/60 mt-4 text-lg leading-relaxed">
            {g("practical.lead")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10 items-start">
          {/* Collapsible groups */}
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
                      `transport:${k}`,
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
                  <div className="space-y-6">
                    {shoppingKeys.map((grp) => (
                      <div key={grp}>
                        <h5 className="text-white/45 text-[11px] font-medium uppercase tracking-[0.18em] mb-1">
                          {g(`shopping.groups.${grp}.title`)}
                        </h5>
                        {(["s1", "s2", "s3"] as const).map((s) =>
                          row(
                            `shopping:${grp}:${s}`,
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
                  {goodKeys.map((k) =>
                    row(
                      `good:${k}`,
                      g(`good.items.${k}.name`),
                      g(`good.items.${k}.desc`),
                    ),
                  )}
                </>,
              )}
          </div>

          {/* Shared map — pins glow on hover */}
          {map && (
            <div
              className="hidden lg:block sticky top-28 relative aspect-[3/4] rounded-3xl border border-line overflow-hidden bg-ink-2"
              aria-hidden="true"
            >
              <Image
                src={map.image}
                alt=""
                fill
                sizes="600px"
                className="object-cover object-center opacity-90"
              />
              <div className="absolute inset-0 shadow-[inset_0_0_60px_30px_rgba(13,13,13,0.55)]" />
              <div className="absolute inset-x-0 bottom-4 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/55 px-3.5 py-1.5 text-xs font-medium text-white/75 backdrop-blur-sm">
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                      active ? "bg-white" : "bg-white/50 animate-pulse"
                    }`}
                  />
                  {g("practical.hint")}
                </span>
              </div>
              <svg viewBox="0 0 520 694" className="absolute inset-0 w-full h-full">
                <defs>
                  <filter
                    id="practical-glow"
                    x="-200%"
                    y="-200%"
                    width="500%"
                    height="500%"
                  >
                    <feGaussianBlur stdDeviation="10" />
                  </filter>
                </defs>
                {Object.entries(pins).map(([id, n]) => {
                  const isActive = active === id;
                  const parts = id.split(":");
                  const name = shortLabel(
                    parts[0] === "transport"
                      ? g(`transport.items.${parts[1]}.name`)
                      : g(`shopping.groups.${parts[1]}.${parts[2]}.name`),
                  );
                  const pillW = name.length * 7.4 + 22;
                  const pillX = n.side === "left" ? n.x - 14 - pillW : n.x + 14;
                  return (
                    <g key={id} style={{ pointerEvents: "none" }}>
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r="16"
                        fill="white"
                        filter="url(#practical-glow)"
                        style={{
                          opacity: isActive ? 0.5 : 0,
                          transition: "opacity 350ms ease-out",
                        }}
                      />
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r="4"
                        style={{
                          fill: isActive
                            ? "rgba(255,255,255,1)"
                            : "rgba(255,255,255,0.4)",
                          transition: "fill 300ms ease-out",
                        }}
                      />
                      {isActive && (
                        <>
                          <rect
                            x={pillX}
                            y={n.y - 12}
                            width={pillW}
                            height={24}
                            rx={12}
                            fill="rgba(255,255,255,0.96)"
                          />
                          <text
                            x={pillX + pillW / 2}
                            y={n.y + 4.5}
                            textAnchor="middle"
                            fontSize="13"
                            fontWeight="600"
                            fill="#0d0d0d"
                          >
                            {name}
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
