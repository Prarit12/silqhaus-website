"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { KeyRound, Handshake, X, ArrowRight } from "lucide-react";

/**
 * "Partner with us" chooser — owners go to property management, agencies to
 * the partner page. Rendered on the ink surface so it reads as part of the
 * site rather than a generic light modal.
 */
export default function PartnerModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("navigation");
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape to close, and lock the page behind the dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const OPTIONS = [
    {
      key: "owner",
      href: "/property-management",
      Icon: KeyRound,
      title: t("partnerOwnerTitle"),
      desc: t("partnerOwnerDesc"),
    },
    {
      key: "agency",
      href: "/contact-agency",
      Icon: Handshake,
      title: t("partnerAgencyTitle"),
      desc: t("partnerAgencyDesc"),
    },
  ] as const;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label={t("partnerClose")}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in-0 duration-200"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="partner-modal-title"
        tabIndex={-1}
        className="relative w-full max-w-2xl rounded-2xl sm:rounded-3xl border border-line bg-ink-2 p-6 sm:p-9 shadow-2xl shadow-black/50 outline-none animate-in fade-in-0 zoom-in-95 duration-200"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("partnerClose")}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-white/70 transition-colors hover:border-white/40 hover:text-white"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <h2
          id="partner-modal-title"
          className="font-display text-white text-2xl sm:text-3xl font-light tracking-tight normal-case pr-10"
        >
          {t("partnerTitle")}
        </h2>
        <p className="text-white/60 text-sm sm:text-[15px] leading-relaxed mt-2.5 max-w-md">
          {t("partnerSubtitle")}
        </p>

        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {OPTIONS.map(({ key, href, Icon, title, desc }) => (
            <Link
              key={key}
              href={href}
              onClick={onClose}
              className="group rounded-2xl border border-line bg-white/[0.03] p-5 sm:p-6 transition-colors hover:border-white/30 hover:bg-white/[0.06]"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-white/80 transition-colors group-hover:border-white/40 group-hover:text-white">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <p className="text-white font-semibold text-[15px] mt-4">
                {title}
              </p>
              <p className="text-white/60 text-sm leading-relaxed mt-1.5">
                {desc}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors group-hover:text-white">
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
