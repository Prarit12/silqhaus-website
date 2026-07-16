"use client";
import { Heart } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { usePMSFavorites } from "@/hooks/use-pms-saved";

interface NavFavoritesLinkProps {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}

export function NavFavoritesLink({
  variant = "desktop",
  onNavigate,
}: NavFavoritesLinkProps) {
  const t = useTranslations("pmsFavorites");
  const { count } = usePMSFavorites();
  const label = t("navLabel");

  if (variant === "mobile") {
    return (
      <Link
        href="/favorites"
        onClick={onNavigate}
        className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-gold/10 transition-colors"
        data-testid="nav-favorites-link-mobile"
      >
        <span className="flex items-center gap-2 font-poppins text-snow">
          <Heart className="w-4 h-4" />
          {label}
        </span>
        {count > 0 && (
          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#ffffff] text-white text-[10px] font-bold leading-none">
            {count}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href="/favorites"
      aria-label={label}
      title={label}
      className="relative inline-flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 p-1.5 transition-colors duration-200"
      data-testid="nav-favorites-link"
    >
      <Heart className="w-5 h-5 text-white" />
      {count > 0 && (
        <span
          className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#ffffff] text-white text-[10px] font-bold leading-none"
          data-testid="nav-favorites-badge"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
