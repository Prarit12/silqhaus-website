"use client";
import { useEffect, useRef, useState } from "react";
import { Bookmark, BookmarkPlus, Check, Pencil, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePMSSavedSearches } from "@/hooks/use-pms-saved";
import type {
  PMSFilterState,
  PMSPageSide,
  UsePMSFiltersReturn,
} from "@/hooks/use-pms-filters";

interface PMSSavedSearchesProps {
  side: PMSPageSide;
  filters: UsePMSFiltersReturn;
}

function defaultName(state: PMSFilterState, side: PMSPageSide): string {
  const bits: string[] = [];
  if (state.city) bits.push(state.city);
  if (state.subdistrict) bits.push(state.subdistrict);
  if (state.propertyTypes.length) bits.push(state.propertyTypes.join("/"));
  if (state.minBedrooms > 0) bits.push(`${state.minBedrooms}+ bd`);
  if (state.priceMin != null || state.priceMax != null) {
    const lo = state.priceMin ?? "";
    const hi = state.priceMax ?? "";
    bits.push(`${lo}–${hi}`);
  }
  if (bits.length === 0) bits.push(side === "rent" ? "Rent" : "Sale");
  return bits.join(" · ");
}

export function PMSSavedSearches({ side, filters }: PMSSavedSearchesProps) {
  const t = useTranslations("pmsSavedSearches");
  const { searches, save, remove, rename } = usePMSSavedSearches(side);
  const [menuOpen, setMenuOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const saveRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [saveTop, setSaveTop] = useState(0);
  const [menuTop, setMenuTop] = useState(0);

  // Track mobile breakpoint (< sm, i.e. < 640px) so the popovers can pin to
  // the viewport instead of anchoring off-screen from the trigger button.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // While a popover is open on mobile, keep its fixed top aligned to the
  // trigger button — recompute on open, scroll, and resize.
  useEffect(() => {
    if (!saveOpen) return;
    const measure = () => {
      if (saveRef.current) {
        setSaveTop(saveRef.current.getBoundingClientRect().bottom + 8);
      }
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [saveOpen]);
  useEffect(() => {
    if (!menuOpen) return;
    const measure = () => {
      if (menuRef.current) {
        setMenuTop(menuRef.current.getBoundingClientRect().bottom + 8);
      }
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [menuOpen]);

  // Close popovers on outside click.
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuOpen && menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
        setRenamingId(null);
      }
      if (saveOpen && saveRef.current && !saveRef.current.contains(target)) {
        setSaveOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen, saveOpen]);

  const handleSave = () => {
    const name = draftName.trim() || defaultName(filters.state, side);
    save({ name, side, state: filters.state });
    setDraftName("");
    setSaveOpen(false);
  };

  const handleApply = (id: string) => {
    const entry = searches.find((s) => s.id === id);
    if (!entry) return;
    // Force this side just in case data was migrated across sides.
    filters.applyState({ ...entry.state });
    setMenuOpen(false);
  };

  const handleRenameStart = (id: string, current: string) => {
    setRenamingId(id);
    setRenameDraft(current);
  };

  const handleRenameCommit = () => {
    if (renamingId && renameDraft.trim()) {
      rename(renamingId, renameDraft);
    }
    setRenamingId(null);
    setRenameDraft("");
  };

  return (
    <div className="flex items-center gap-2">
      {/* Save this search */}
      <div className="relative" ref={saveRef}>
        <button
          type="button"
          onClick={() => {
            setDraftName(defaultName(filters.state, side));
            setSaveOpen((v) => !v);
            setMenuOpen(false);
          }}
          className="flex items-center gap-1.5 text-[12px] font-poppins font-medium px-3 py-1.5 rounded-full border border-white/15 text-white hover:border-[#ffffff]/70 transition-colors"
          data-testid="pms-saved-save-trigger"
        >
          <BookmarkPlus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t("saveSearch")}</span>
        </button>
        {saveOpen && (
          <div
            style={isMobile ? { top: saveTop } : undefined}
            className={
              isMobile
                ? "fixed left-4 right-4 z-30 max-w-[calc(100vw-2rem)] rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-xl p-3"
                : "absolute right-0 mt-2 z-30 w-72 rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-xl p-3"
            }
          >
            <label className="block text-[11px] font-poppins text-white/70 mb-1">
              {t("nameLabel")}
            </label>
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") setSaveOpen(false);
              }}
              placeholder={t("namePlaceholder")}
              className="w-full bg-[#000000] border border-white/15 rounded-lg px-3 py-1.5 text-white text-[13px] font-poppins focus:outline-none focus:border-[#ffffff]"
              data-testid="pms-saved-name-input"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2 mt-3">
              <button
                type="button"
                onClick={() => setSaveOpen(false)}
                className="text-[12px] font-poppins text-white/70 hover:text-white px-3 py-1.5"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="text-[12px] font-poppins font-medium text-white bg-[#ffffff] hover:bg-[#ffffff] px-3 py-1.5 rounded-full"
                data-testid="pms-saved-save-confirm"
              >
                {t("save")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Saved searches list */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => {
            setMenuOpen((v) => !v);
            setSaveOpen(false);
          }}
          className="flex items-center gap-1.5 text-[12px] font-poppins font-medium px-3 py-1.5 rounded-full border border-white/15 text-white hover:border-[#ffffff]/70 transition-colors"
          data-testid="pms-saved-menu-trigger"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t("savedSearches")}</span>
          {searches.length > 0 && (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#ffffff] text-white text-[10px] font-bold leading-none">
              {searches.length}
            </span>
          )}
        </button>
        {menuOpen && (
          <div
            style={isMobile ? { top: menuTop } : undefined}
            className={
              isMobile
                ? "fixed left-4 right-4 z-30 max-w-[calc(100vw-2rem)] rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-xl py-2 max-h-[60vh] overflow-y-auto"
                : "absolute right-0 mt-2 z-30 w-80 rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-xl py-2 max-h-[60vh] overflow-y-auto"
            }
          >
            {searches.length === 0 ? (
              <p className="px-4 py-6 text-center text-white/60 font-poppins text-[12px]">
                {t("emptyMenu")}
              </p>
            ) : (
              <ul className="divide-y divide-white/5">
                {searches.map((s) => {
                  const isRenaming = renamingId === s.id;
                  return (
                    <li
                      key={s.id}
                      className="px-3 py-2"
                      data-testid={`pms-saved-item-${s.id}`}
                    >
                      {isRenaming ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={renameDraft}
                            onChange={(e) => setRenameDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleRenameCommit();
                              if (e.key === "Escape") setRenamingId(null);
                            }}
                            className="flex-1 bg-[#000000] border border-white/15 rounded-md px-2 py-1 text-white text-[12px] font-poppins focus:outline-none focus:border-[#ffffff]"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleRenameCommit}
                            aria-label={t("save")}
                            className="text-white/80 hover:text-white p-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setRenamingId(null)}
                            aria-label={t("cancel")}
                            className="text-white/60 hover:text-white p-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleApply(s.id)}
                            className="flex-1 text-left text-[13px] font-poppins text-white hover:text-[#bf9b3a] truncate"
                            data-testid={`pms-saved-apply-${s.id}`}
                          >
                            {s.name}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRenameStart(s.id, s.name)}
                            aria-label={t("rename")}
                            title={t("rename")}
                            className="text-white/60 hover:text-white p-1"
                            data-testid={`pms-saved-rename-${s.id}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(s.id)}
                            aria-label={t("delete")}
                            title={t("delete")}
                            className="text-white/60 hover:text-red-400 p-1"
                            data-testid={`pms-saved-delete-${s.id}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
