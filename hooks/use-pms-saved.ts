"use client";
import { useCallback, useSyncExternalStore } from "react";
import {
  type FavoriteRef,
  type FavoriteSide,
  type FavoriteSnapshot,
  type PMSSavedSearch,
  addSavedSearch,
  deleteSavedSearch as deleteSavedSearchStore,
  isFavorite as isFavoriteStore,
  readFavorites,
  readSavedSearches,
  renameSavedSearch as renameSavedSearchStore,
  subscribeSaved,
  toggleFavorite as toggleFavoriteStore,
} from "@/lib/pms-saved-store";
import type { PMSFilterState, PMSPageSide } from "@/hooks/use-pms-filters";

const EMPTY_FAVS: FavoriteRef[] = [];
const EMPTY_SAVED: PMSSavedSearch[] = [];

export function usePMSFavorites() {
  const favorites = useSyncExternalStore(
    subscribeSaved,
    () => readFavorites(),
    () => EMPTY_FAVS,
  );

  const toggle = useCallback(
    (id: string, side: FavoriteSide, snapshot: FavoriteSnapshot) =>
      toggleFavoriteStore(id, side, snapshot),
    [],
  );

  const isFavorite = useCallback(
    (id: string, side: FavoriteSide) =>
      favorites.some((f) => f.id === id && f.side === side),
    [favorites],
  );

  return { favorites, count: favorites.length, toggle, isFavorite };
}

/** SSR-safe single-listing check that re-renders on store changes. */
export function useIsFavorite(id: string, side: FavoriteSide): boolean {
  return useSyncExternalStore(
    subscribeSaved,
    () => isFavoriteStore(id, side),
    () => false,
  );
}

export function usePMSSavedSearches(side?: PMSPageSide) {
  const searches = useSyncExternalStore(
    subscribeSaved,
    () => readSavedSearches(side),
    () => EMPTY_SAVED,
  );

  const save = useCallback(
    (input: { name: string; side: PMSPageSide; state: PMSFilterState }) =>
      addSavedSearch(input),
    [],
  );
  const remove = useCallback((id: string) => deleteSavedSearchStore(id), []);
  const rename = useCallback(
    (id: string, name: string) => renameSavedSearchStore(id, name),
    [],
  );

  return { searches, count: searches.length, save, remove, rename };
}
