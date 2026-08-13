"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Scroll-driven circular gallery: items sit on a giant wheel whose top arc
 * crosses the viewport; scrolling the surrounding tall container (marked
 * with `data-circular-scroll`) rotates the wheel through every item. The
 * item nearest twelve o'clock is emphasized, neighbours fade and shrink.
 */

export interface CircularGalleryItem {
  id: string;
  content: ReactNode;
}

interface CircularGalleryProps {
  items: CircularGalleryItem[];
  /** Degrees between neighbouring cards on the wheel. */
  stepDeg?: number;
  className?: string;
}

export function CircularGallery({
  items,
  stepDeg = 30,
  className = "",
}: CircularGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [radius, setRadius] = useState(720);

  const sweep = stepDeg * Math.max(items.length - 1, 1);

  const layout = useCallback(
    (progress: number) => {
      const rotation = progress * sweep;
      items.forEach((_, i) => {
        const el = cardRefs.current[i];
        if (!el) return;
        const theta = i * stepDeg - rotation;
        const k = Math.max(0, 1 - Math.abs(theta) / stepDeg);
        const scale = 0.92 + 0.1 * k;
        el.style.transform = `translate(-50%, -50%) rotate(${theta}deg) translateY(-${radius}px) scale(${scale})`;
        el.style.opacity = String(0.45 + 0.55 * k);
        el.style.zIndex = String(100 - Math.round(Math.abs(theta)));
      });
    },
    [items, stepDeg, sweep, radius],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scroller = root.closest<HTMLElement>("[data-circular-scroll]");
    if (!scroller) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = scroller.getBoundingClientRect();
      const track = rect.height - window.innerHeight;
      const progress =
        track > 0 ? Math.min(1, Math.max(0, -rect.top / track)) : 0;
      layout(progress);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      setRadius(
        Math.max(
          420,
          Math.min(window.innerWidth * 0.62, window.innerHeight * 1.05),
        ),
      );
      schedule();
    };

    onResize();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
    };
  }, [layout]);

  return (
    <div ref={rootRef} className={`relative w-full h-full ${className}`}>
      {/* wheel origin: horizontally centred, pushed down so the top arc
          of the ring crosses the middle of the viewport */}
      <div
        className="absolute left-1/2 w-0 h-0"
        style={{ top: `calc(50% + ${radius}px)` }}
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 will-change-transform"
            style={{
              transform: `translate(-50%, -50%) rotate(${i * stepDeg}deg) translateY(-${radius}px)`,
            }}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
