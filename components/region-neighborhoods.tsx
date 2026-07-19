"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type NodeSpec = {
  x: number;
  y: number;
  /** Which side of the dot the label sits on. */
  side?: "left" | "right";
};

/** Stylized neighborhood maps per region — the river + node positions. */
const MAPS: Record<
  string,
  { river: string; nodes: Record<string, NodeSpec> }
> = {
  bangkok: {
    river:
      "M 218 -10 C 212 60 188 96 178 150 C 168 204 212 234 218 272 C 224 308 176 330 168 368 C 160 406 210 432 226 472 C 240 507 218 570 236 650",
    nodes: {
      ari: { x: 312, y: 168, side: "right" },
      ratchada: { x: 428, y: 236, side: "right" },
      khaosan: { x: 244, y: 244, side: "right" },
      rattanakosin: { x: 208, y: 300, side: "left" },
      siam: { x: 336, y: 322, side: "right" },
      yaowarat: { x: 252, y: 356, side: "left" },
      sukhumvit: { x: 408, y: 362, side: "right" },
      thonglor: { x: 462, y: 398, side: "right" },
      riverside: { x: 252, y: 432, side: "left" },
      silomSathorn: { x: 330, y: 442, side: "right" },
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

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,460px)] gap-x-14 gap-y-10 items-start">
          {/* Area list — hover lights the map */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
            {areaKeys.map((a) => (
              <div
                key={a}
                onMouseEnter={() => setActive(a)}
                onMouseLeave={() => setActive(null)}
                onClick={() => setActive(active === a ? null : a)}
                className={`border-t border-line py-4 px-3 -mx-3 rounded-lg cursor-default transition-colors duration-300 ${
                  active === a ? "bg-white/[0.05]" : ""
                }`}
              >
                <h3
                  className={`font-semibold tracking-tight transition-colors duration-300 ${
                    active === a ? "text-white" : "text-white/85"
                  }`}
                >
                  {g(`areas.items.${a}.name`)}
                </h3>
                <p className="text-white/55 text-sm mt-1.5 leading-relaxed">
                  {g(`areas.items.${a}.desc`)}
                </p>
              </div>
            ))}
          </div>

          {/* Stylized map — nodes glow on hover */}
          {map && (
            <div
              className="hidden lg:block sticky top-28 rounded-3xl border border-line bg-white/[0.02] p-6"
              aria-hidden="true"
            >
              <svg viewBox="0 0 520 640" className="w-full h-auto">
                <defs>
                  <filter id="node-glow" x="-200%" y="-200%" width="500%" height="500%">
                    <feGaussianBlur stdDeviation="10" />
                  </filter>
                </defs>

                {/* Chao Phraya */}
                <path
                  d={map.river}
                  fill="none"
                  stroke="rgba(255,255,255,0.16)"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                <path
                  d={map.river}
                  fill="none"
                  stroke="rgba(255,255,255,0.28)"
                  strokeWidth="1.5"
                />
                <text
                  x="150"
                  y="560"
                  fill="rgba(255,255,255,0.3)"
                  fontSize="11"
                  letterSpacing="2"
                  transform="rotate(-70 150 560)"
                >
                  CHAO PHRAYA
                </text>

                {Object.entries(map.nodes).map(([key, n]) => {
                  const isActive = active === key;
                  const labelX = n.side === "left" ? n.x - 14 : n.x + 14;
                  return (
                    <g
                      key={key}
                      onMouseEnter={() => setActive(key)}
                      onMouseLeave={() => setActive(null)}
                      style={{ cursor: "default" }}
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
                      <text
                        x={labelX}
                        y={n.y + 4}
                        textAnchor={n.side === "left" ? "end" : "start"}
                        fontSize="13"
                        style={{
                          fill: isActive
                            ? "rgba(255,255,255,0.95)"
                            : "rgba(255,255,255,0.55)",
                          transition: "fill 300ms ease-out",
                        }}
                      >
                        {g(`areas.items.${key}.name`).split(" (")[0].split(" & ")[0]}
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
