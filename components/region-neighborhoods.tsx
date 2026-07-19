"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

type NodeSpec = {
  x: number;
  y: number;
  /** Which side of the dot the label sits on. */
  side?: "left" | "right";
};

/** Neighborhood maps per region — a generated map image + node overlay. */
const MAPS: Record<
  string,
  { image: string; nodes: Record<string, NodeSpec> }
> = {
  bangkok: {
    image: "/experiences/bangkok/map.jpg",
    nodes: {
      chatuchakArea: { x: 330, y: 205, side: "right" },
      ari: { x: 240, y: 240, side: "right" },
      ratchada: { x: 368, y: 271, side: "right" },
      dusit: { x: 222, y: 288, side: "left" },
      khaosan: { x: 162, y: 337, side: "right" },
      rattanakosin: { x: 172, y: 384, side: "left" },
      siam: { x: 271, y: 406, side: "right" },
      yaowarat: { x: 198, y: 443, side: "left" },
      sukhumvit: { x: 368, y: 445, side: "right" },
      thonglor: { x: 433, y: 472, side: "left" },
      riverside: { x: 217, y: 522, side: "left" },
      silomSathorn: { x: 294, y: 503, side: "right" },
      phraKhanong: { x: 480, y: 528, side: "left" },
      bangKrachao: { x: 452, y: 592, side: "left" },
    },
  },
};

export default function RegionNeighborhoods({
  region,
  areaKeys,
}: {
  region: string;
  areaKeys: string[];
}) {
  const t = useTranslations("experiences");
  const g = (key: string) => t(`guides.${region}.${key}`);
  const [active, setActive] = useState<string | null>(null);
  const map = MAPS[region];

  return (
    <section className="pb-20 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 mb-9 sm:mb-11">
          <h2 className="font-display text-white text-3xl sm:text-4xl font-light leading-[1.08] tracking-tight normal-case text-balance">
            {g("areas.title")}
          </h2>
          <p className="text-white/55 max-w-md text-base leading-relaxed">
            {g("areas.intro")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10 items-start">
          {/* Area list — hover lights the map */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
            {areaKeys.map((a) => (
              <div
                key={a}
                onMouseEnter={() => setActive(a)}
                onMouseLeave={() => setActive(null)}
                onClick={() => setActive(active === a ? null : a)}
                className={`border-t border-line py-4 px-3 -mx-3 rounded-lg cursor-pointer transition-colors duration-300 ${
                  active === a ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                }`}
              >
                <h3
                  className={`flex items-center gap-2.5 font-semibold tracking-tight transition-colors duration-300 ${
                    active === a ? "text-white" : "text-white/85"
                  }`}
                >
                  {/* Mirrors the map node — fills when this area is lit */}
                  <span
                    className={`inline-block w-2 h-2 shrink-0 rounded-full border transition-all duration-300 ${
                      active === a
                        ? "bg-white border-white shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                        : "border-white/40"
                    }`}
                    aria-hidden="true"
                  />
                  {g(`areas.items.${a}.name`)}
                </h3>
                <p className="text-white/55 text-sm mt-1.5 leading-relaxed pl-[18px]">
                  {g(`areas.items.${a}.desc`)}
                </p>
              </div>
            ))}
          </div>

          {/* Generated map — nodes glow on hover */}
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
              {/* Soften edges into the panel */}
              <div className="absolute inset-0 shadow-[inset_0_0_60px_30px_rgba(13,13,13,0.55)]" />
              {/* Interaction hint */}
              <div className="absolute inset-x-0 bottom-4 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/55 px-3.5 py-1.5 text-xs font-medium text-white/75 backdrop-blur-sm">
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                      active ? "bg-white" : "bg-white/50 animate-pulse"
                    }`}
                  />
                  {g("areas.hint")}
                </span>
              </div>
              <svg
                viewBox="0 0 520 694"
                className="absolute inset-0 w-full h-full"
              >
                <defs>
                  <filter id="node-glow" x="-200%" y="-200%" width="500%" height="500%">
                    <feGaussianBlur stdDeviation="10" />
                  </filter>
                </defs>

                {Object.entries(map.nodes).map(([key, n]) => {
                  const isActive = active === key;
                  const label = g(`areas.items.${key}.name`)
                    .split(" (")[0]
                    .split(" & ")[0];
                  const pillW = label.length * 7.4 + 22;
                  const pillX = n.side === "left" ? n.x - 15 - pillW : n.x + 15;
                  return (
                    <g
                      key={key}
                      onMouseEnter={() => setActive(key)}
                      onMouseLeave={() => setActive(null)}
                      style={{ cursor: "pointer" }}
                    >
                      {/* glow */}
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r="16"
                        fill="white"
                        filter="url(#node-glow)"
                        style={{
                          opacity: isActive ? 0.5 : 0,
                          transition: "opacity 350ms ease-out",
                        }}
                      />
                      {/* halo ring */}
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r="9"
                        fill="none"
                        stroke="white"
                        strokeWidth="1"
                        style={{
                          opacity: isActive ? 0.8 : 0.18,
                          transition: "opacity 300ms ease-out",
                        }}
                      />
                      {/* core dot */}
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r="4"
                        style={{
                          fill: isActive
                            ? "rgba(255,255,255,1)"
                            : "rgba(255,255,255,0.45)",
                          transition: "fill 300ms ease-out",
                        }}
                      />
                      <rect
                        x={pillX}
                        y={n.y - 12}
                        width={pillW}
                        height={24}
                        rx={12}
                        style={{
                          fill: isActive
                            ? "rgba(255,255,255,0.96)"
                            : "rgba(8,8,8,0.72)",
                          stroke: isActive
                            ? "rgba(255,255,255,0)"
                            : "rgba(255,255,255,0.28)",
                          strokeWidth: 1,
                          transition: "fill 300ms ease-out, stroke 300ms ease-out",
                        }}
                      />
                      <text
                        x={pillX + pillW / 2}
                        y={n.y + 4.5}
                        textAnchor="middle"
                        fontSize="13"
                        fontWeight="600"
                        style={{
                          fill: isActive ? "#0d0d0d" : "rgba(255,255,255,0.9)",
                          transition: "fill 300ms ease-out",
                        }}
                      >
                        {label}
                      </text>
                      {/* generous invisible hit area */}
                      <circle cx={n.x} cy={n.y} r="26" fill="transparent" />
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
