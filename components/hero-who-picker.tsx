"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Minus, Plus } from "lucide-react";

export interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

export const EMPTY_GUESTS: GuestCounts = {
  adults: 0,
  children: 0,
  infants: 0,
  pets: 0,
};

const MAX: Record<keyof GuestCounts, number> = {
  adults: 16,
  children: 15,
  infants: 5,
  pets: 5,
};

/**
 * Airbnb-style "Who" stepper: Adults / Children / Infants / Pets. Controlled —
 * the parent owns the counts. Only adults + children feed the guest capacity
 * filter; infants and pets are captured for the enquiry but don't narrow the
 * listing search (the listing page has no pets/infant filter).
 */
export default function HeroWhoPicker({
  value,
  onChange,
}: {
  value: GuestCounts;
  onChange: (next: GuestCounts) => void;
}) {
  const t = useTranslations("home.hero.search");
  const [showPetPolicy, setShowPetPolicy] = useState(false);

  const rows: {
    key: keyof GuestCounts;
    label: string;
    sub: string;
    isLink?: boolean;
  }[] = [
    { key: "adults", label: t("adults"), sub: t("adultsAge") },
    { key: "children", label: t("children"), sub: t("childrenAge") },
    { key: "infants", label: t("infants"), sub: t("infantsAge") },
    { key: "pets", label: t("pets"), sub: t("petPolicyLink"), isLink: true },
  ];

  const set = (key: keyof GuestCounts, next: number) => {
    const updated = { ...value, [key]: next };
    // Keep at least one adult once a child or infant is present.
    if (
      (key === "children" || key === "infants") &&
      next > 0 &&
      updated.adults === 0
    ) {
      updated.adults = 1;
    }
    onChange(updated);
  };

  const minFor = (key: keyof GuestCounts) =>
    key === "adults" && (value.children > 0 || value.infants > 0) ? 1 : 0;

  const stepBtn =
    "inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition-colors hover:border-neutral-600 hover:text-ink disabled:opacity-30 disabled:hover:border-neutral-300 disabled:hover:text-neutral-600 disabled:cursor-default";

  return (
    <div className="text-left">
      <ul className="divide-y divide-neutral-200">
        {rows.map((row) => {
          const count = value[row.key];
          const min = minFor(row.key);
          const max = MAX[row.key];
          return (
            <li
              key={row.key}
              className="flex items-center justify-between py-5 first:pt-1 last:pb-1"
            >
              <div className="min-w-0 pr-4">
                <p className="text-ink font-semibold">{row.label}</p>
                {row.isLink ? (
                  <button
                    type="button"
                    onClick={() => setShowPetPolicy((s) => !s)}
                    aria-expanded={showPetPolicy}
                    className="text-left text-neutral-500 text-sm underline underline-offset-2 decoration-neutral-300 transition-colors hover:text-ink hover:decoration-ink"
                  >
                    {row.sub}
                  </button>
                ) : (
                  <p className="text-neutral-500 text-sm">{row.sub}</p>
                )}
              </div>
              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                <button
                  type="button"
                  onClick={() => set(row.key, count - 1)}
                  disabled={count <= min}
                  aria-label={`Decrease ${row.label}`}
                  className={stepBtn}
                >
                  <Minus className="w-4 h-4" aria-hidden="true" />
                </button>
                <span className="w-6 text-center text-ink tabular-nums">
                  {count}
                </span>
                <button
                  type="button"
                  onClick={() => set(row.key, count + 1)}
                  disabled={count >= max}
                  aria-label={`Increase ${row.label}`}
                  className={stepBtn}
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Pet policy disclosure — pets carry an extra fee; show the house rules */}
      {showPetPolicy && (
        <div className="mt-1 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-ink font-semibold text-sm">
            {t("petPolicyTitle")}
          </p>
          <ul className="mt-2 space-y-1.5">
            {[1, 2, 3, 4].map((i) => (
              <li
                key={i}
                className="flex gap-2 text-neutral-600 text-[13px] leading-relaxed"
              >
                <span
                  className="mt-[7px] h-1 w-1 rounded-full bg-neutral-400 shrink-0"
                  aria-hidden="true"
                />
                {t(`petPolicyRule${i}`)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
