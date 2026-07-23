"use client";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { toggleFavorite as toggleFavoriteStore } from "@/lib/pms-saved-store";
import type { FavoriteSide, FavoriteSnapshot } from "@/lib/pms-saved-store";
import { useIsFavorite } from "@/hooks/use-pms-saved";

interface PMSFavoriteButtonProps {
  listingId: string;
  side: FavoriteSide;
  snapshot: FavoriteSnapshot;
  variant?: "card" | "detail";
  /** Replaces the card variant's default corner/stacking classes. */
  positionClass?: string;
}

export function PMSFavoriteButton({
  listingId,
  side,
  snapshot,
  variant = "card",
  positionClass,
}: PMSFavoriteButtonProps) {
  const t = useTranslations("pmsFavorites");
  const active = useIsFavorite(listingId, side);

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteStore(listingId, side, snapshot);
  };

  const label = active ? t("removeFavorite") : t("addFavorite");

  const baseCard = `${positionClass ?? "absolute bottom-3 right-3 z-10"} w-9 h-9 rounded-full bg-black/55 backdrop-blur-sm border border-white/15 hover:border-[#ffffff] flex items-center justify-center transition-colors`;
  const baseDetail =
    "inline-flex items-center gap-2 rounded-full border border-white/15 hover:border-[#ffffff] bg-[#0a0a0a] text-white text-sm font-poppins px-4 py-2 transition-colors";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={variant === "card" ? baseCard : baseDetail}
      data-testid={`pms-favorite-toggle-${listingId}`}
    >
      <Heart
        className={`w-4 h-4 ${
          active ? "fill-[#E11D48] text-[#E11D48]" : "text-white"
        }`}
        strokeWidth={2}
      />
      {variant === "detail" && <span>{active ? t("saved") : t("save")}</span>}
    </button>
  );
}
