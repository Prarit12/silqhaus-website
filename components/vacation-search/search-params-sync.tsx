"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Pushes the router's search params into the filter state, and nothing else.
 *
 * `useSearchParams` opts its whole subtree out of static rendering, so it lives
 * alone in this leaf behind its own Suspense boundary: only this null-rendering
 * component bails out, and the search page around it still server-renders. That
 * server HTML is what crawlers (and the first paint) get.
 */
export function SearchParamsSync({
  onChange,
}: {
  onChange: (params: URLSearchParams) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    onChange(new URLSearchParams(searchParams.toString()));
  }, [searchParams, onChange]);

  return null;
}
