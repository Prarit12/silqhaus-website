"use client";

import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Check, X } from "lucide-react";

const ACCENT = "#3d7bd6";

const COLS = ["silqhaus", "traditional", "agency", "self"] as const;

/** Cell states: 1 = yes, 0 = no, 2 = varies / unknown ("?"). */
const GROUPS: {
  title: string;
  rows: { key: string; vals: [number, number, number, number] }[];
}[] = [
  {
    title: "guest",
    rows: [
      { key: "ai", vals: [1, 0, 0, 0] },
      { key: "booking", vals: [1, 1, 2, 2] },
      { key: "concierge", vals: [1, 2, 0, 0] },
      { key: "checkin", vals: [1, 2, 0, 2] },
    ],
  },
  {
    title: "care",
    rows: [
      { key: "local", vals: [1, 1, 1, 2] },
      { key: "photo", vals: [1, 0, 0, 0] },
      { key: "housekeeping", vals: [1, 1, 2, 2] },
      { key: "safety", vals: [1, 1, 2, 0] },
    ],
  },
  {
    title: "tech",
    rows: [
      { key: "os", vals: [1, 0, 0, 0] },
      { key: "revenue", vals: [1, 1, 0, 0] },
      { key: "distribution", vals: [1, 1, 2, 2] },
      { key: "aiFuture", vals: [1, 0, 0, 0] },
    ],
  },
  {
    title: "owner",
    rows: [
      { key: "portal", vals: [1, 2, 0, 0] },
      { key: "transparency", vals: [1, 2, 0, 1] },
      { key: "ownerFirst", vals: [1, 2, 0, 1] },
      { key: "directLine", vals: [1, 0, 1, 0] },
    ],
  },
];

function Cell({ on, highlight }: { on: number; highlight?: boolean }) {
  return (
    <td
      className={`py-4 text-center ${highlight ? "bg-white/[0.04]" : ""}`}
    >
      {on === 1 ? (
        <span
          className="inline-flex w-6 h-6 rounded-full items-center justify-center"
          style={{ background: highlight ? ACCENT : "rgba(255,255,255,0.9)" }}
        >
          <Check
            className={`w-3.5 h-3.5 ${highlight ? "text-white" : "text-ink"}`}
            strokeWidth={3}
          />
        </span>
      ) : on === 2 ? (
        <span className="inline-flex w-6 h-6 rounded-full items-center justify-center bg-white/10 text-white/60 text-[13px] font-semibold leading-none">
          ?
        </span>
      ) : (
        <X className="w-4 h-4 text-white/20 mx-auto" strokeWidth={2.5} />
      )}
    </td>
  );
}

export default function PmComparison() {
  const t = useTranslations("propertyManagement.comparison");

  return (
    <section className="bg-ink py-24 sm:py-28 md:py-32 border-t border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-white text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-center normal-case mb-14 sm:mb-20 text-balance">
          {t("title")}
        </h2>

        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr>
                <th className="w-[30%]" />
                {COLS.map((c) => (
                  <th
                    key={c}
                    className={`py-4 align-bottom ${
                      c === "silqhaus"
                        ? "bg-white/[0.04] rounded-t-2xl"
                        : ""
                    }`}
                  >
                    {c === "silqhaus" ? (
                      <span className="inline-block bg-white text-ink rounded-lg px-4 py-2 text-sm font-semibold tracking-[0.15em]">
                        SILQHAUS
                      </span>
                    ) : (
                      <span className="block px-2 text-white/55 text-xs sm:text-sm font-medium leading-tight">
                        {t(`columns.${c}`)}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GROUPS.map((group) => (
                <Fragment key={group.title}>
                  <tr>
                    <td
                      colSpan={5}
                      className="pt-8 pb-3 text-white font-semibold text-base sm:text-lg tracking-tight"
                    >
                      {t(`groups.${group.title}`)}
                    </td>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.key} className="border-t border-line">
                      <td className="py-4 pr-4 text-white/70 text-sm sm:text-[15px]">
                        {t(`rows.${row.key}`)}
                      </td>
                      {row.vals.map((v, i) => (
                        <Cell key={i} on={v} highlight={i === 0} />
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend for the "?" state */}
        <p className="mt-8 flex items-center justify-center gap-2.5 text-sm text-white/45">
          <span className="inline-flex w-5 h-5 shrink-0 rounded-full items-center justify-center bg-white/10 text-white/60 text-[11px] font-semibold leading-none">
            ?
          </span>
          {t("legend")}
        </p>
      </div>
    </section>
  );
}
