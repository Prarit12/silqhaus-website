"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";

type Props = {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  /** Section background utility, e.g. "bg-ink" | "bg-ink-2". */
  className?: string;
  defaultOpen?: boolean;
};

/**
 * A page section minimized to its eyebrow + title. Clicking the header
 * (or the plus affordance) expands the full content in place with an
 * animated reveal; collapsed content is inert and hidden from
 * assistive tech.
 */
export default function CollapsibleSection({
  eyebrow,
  title,
  intro,
  children,
  className = "bg-ink",
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();
  const bodyRef = useRef<HTMLDivElement>(null);

  // React 18 has no `inert` prop; set it imperatively so collapsed
  // content is unreachable by keyboard and assistive tech.
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (open) el.removeAttribute("inert");
    else el.setAttribute("inert", "");
  }, [open]);

  return (
    <section className={`border-t border-line ${className}`}>
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={bodyId}
          className="group flex w-full items-center justify-between gap-6 text-left"
        >
          <div className="min-w-0">
            <span className="eyebrow">{eyebrow}</span>
            <h2 className="font-display text-white text-3xl sm:text-4xl md:text-5xl font-light leading-[1.06] tracking-tight normal-case text-balance mt-4">
              {title}
            </h2>
          </div>
          <span
            className={`shrink-0 inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-line text-white/70 transition-all duration-300 motion-reduce:transition-none group-hover:border-white/40 group-hover:text-white ${
              open ? "rotate-45" : ""
            }`}
            aria-hidden="true"
          >
            <Plus className="w-5 h-5" strokeWidth={1.5} />
          </span>
        </button>

        <div
          id={bodyId}
          ref={bodyRef}
          className="grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none"
          style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
          aria-hidden={!open}
        >
          <div className="overflow-hidden">
            <div className="pt-8 sm:pt-10">
              {intro && (
                <div className="max-w-3xl text-white/60 text-lg leading-relaxed">
                  {intro}
                </div>
              )}
              <div className={intro ? "mt-10 sm:mt-12" : ""}>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
