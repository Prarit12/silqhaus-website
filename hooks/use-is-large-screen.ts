"use client";
import { useEffect, useState } from "react";

/**
 * True at ≥768px. Gates mounting the Leaflet map so it never initializes in a
 * hidden container (mobile shows the list; the map is a full-screen overlay).
 */
export function useIsLargeScreen(): boolean {
  const [isLg, setIsLg] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = () => setIsLg(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isLg;
}
