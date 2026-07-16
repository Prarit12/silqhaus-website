"use client";
import { useCallback, useRef } from "react";
import { useRouter } from "@/i18n/navigation";

export function useHoverPrefetch() {
  const router = useRouter();
  const prefetched = useRef<Set<string>>(new Set());

  return useCallback(
    (href: string) => {
      const trigger = () => {
        if (prefetched.current.has(href)) return;
        prefetched.current.add(href);
        try {
          router.prefetch(href as any);
        } catch {}
      };
      return {
        onMouseEnter: trigger,
        onFocus: trigger,
        onTouchStart: trigger,
      };
    },
    [router],
  );
}
