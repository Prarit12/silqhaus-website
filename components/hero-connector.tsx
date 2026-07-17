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
  cx: number;
  y2: number;
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
    const x1 = h.right - w.left + 28; // dot just right of the headline
    const y1 = h.top - w.top + h.height * 0.55;
    // Elbow drops onto the panel's top edge, a little inside its left end.
    const cx = Math.min(
      Math.max(x1 + 72, p.left - w.left + 56),
      p.right - w.left - 56,
    );
    const y2 = p.top - w.top - 6; // dot resting on the panel's top edge
    if (cx - x1 < 40 || y2 - y1 < 40) {
      setGeo(null); // not enough room for the line to read cleanly
      return;
    }
    setGeo({ x1, y1, cx, y2 });
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

  const r = 14; // corner radius

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
            d={`M ${geo.x1} ${geo.y1} H ${geo.cx - r} Q ${geo.cx} ${geo.y1} ${geo.cx} ${geo.y1 + r} V ${geo.y2}`}
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="1.5"
          />
          <circle cx={geo.x1} cy={geo.y1} r="3.5" fill="rgba(255,255,255,0.85)" />
          <circle cx={geo.cx} cy={geo.y2} r="3.5" fill="rgba(255,255,255,0.85)" />
        </svg>
      )}
    </div>
  );
}
