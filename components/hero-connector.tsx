"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Geometry = {
  x1: number;
  y1: number;
  vx: number;
  y2: number;
  x2: number;
} | null;

/**
 * Lays out the hero headline (left) and search panel (right, below), and
 * draws a thin elbow connector between them — dot at the headline's edge,
 * a rounded 90° turn, and a dot beside the panel. Desktop only; measured
 * live so it survives any viewport or copy change.
 */
export default function HeroConnector({
  headline,
  search,
}: {
  headline: ReactNode;
  search: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geometry>(null);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    const head = headRef.current;
    const panel = searchRef.current?.firstElementChild as HTMLElement | null;
    if (!wrap || !head || !panel) return;
    if (window.innerWidth < 1024) {
      setGeo(null);
      return;
    }
    const w = wrap.getBoundingClientRect();
    const h = head.getBoundingClientRect();
    const p = panel.getBoundingClientRect();
    const x1 = h.right - w.left + 20; // dot just right of the headline
    const y1 = h.top - w.top + h.height * 0.3; // at the first-line height
    const x2 = p.left - w.left - 8; // dot touching the panel's left edge
    const vx = x1 + (x2 - x1) / 2; // drop centered in the corridor
    const y2 = p.top - w.top + p.height / 2; // into the panel's mid height
    if (vx - x1 < 24 || x2 - vx < 24 || y2 - y1 < 60) {
      setGeo(null); // not enough room for the line to read cleanly
      return;
    }
    setGeo({ x1, y1, vx, y2, x2 });
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const r = 12; // corner radius

  return (
    <div ref={wrapRef} className="relative">
      <div ref={headRef} className="max-w-2xl lg:w-fit">
        {headline}
      </div>

      <div
        ref={searchRef}
        className="mt-9 sm:mt-10 lg:mt-16 lg:flex lg:justify-end"
      >
        {search}
      </div>

      {geo && (
        <svg
          className="pointer-events-none absolute inset-0 hidden lg:block w-full h-full"
          aria-hidden="true"
        >
          <path
            d={`M ${geo.x1} ${geo.y1} H ${geo.vx - r} Q ${geo.vx} ${geo.y1} ${geo.vx} ${geo.y1 + r} V ${geo.y2 - r} Q ${geo.vx} ${geo.y2} ${geo.vx + r} ${geo.y2} H ${geo.x2}`}
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="1.5"
          />
          <circle cx={geo.x1} cy={geo.y1} r="3.5" fill="rgba(255,255,255,0.85)" />
          <circle cx={geo.x2} cy={geo.y2} r="3.5" fill="rgba(255,255,255,0.85)" />
        </svg>
      )}
    </div>
  );
}
