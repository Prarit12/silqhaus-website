"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

const FLEX_PILLS = [0, 1, 2, 3, 7] as const;

/**
 * Airbnb-style "When" picker: a two-month calendar (Dates) plus a Flexible
 * tab (Weekend / Week × month grid). Controlled — the parent owns checkIn /
 * checkOut ISO strings and drives the search; flexible picks resolve to a
 * concrete representative range so the exact-date search still works.
 */
export default function HeroWhenPicker({
  checkIn,
  checkOut,
  onChange,
  onClear,
}: {
  checkIn: string | null;
  checkOut: string | null;
  onChange: (checkIn: string | null, checkOut: string | null) => void;
  onClear: () => void;
}) {
  const t = useTranslations("home.hero.search");
  const locale = useLocale();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const todayISO = toISO(today);

  const [tab, setTab] = useState<"dates" | "flexible">("dates");
  const [flex, setFlex] = useState<number>(0);
  const [duration, setDuration] = useState<"anydays" | "weekend" | "week">(
    "anydays",
  );
  const [view, setView] = useState({
    y: today.getFullYear(),
    m: today.getMonth(),
  });

  const weekdays = useMemo(() => {
    const base = new Date(2023, 0, 1); // a Sunday
    const fmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
    return Array.from({ length: 7 }, (_, i) => {
      const s = fmt.format(new Date(base.getFullYear(), 0, 1 + i));
      return locale.startsWith("en") ? s.slice(0, 2) : s;
    });
  }, [locale]);

  const monthTitle = (y: number, m: number) =>
    new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
      new Date(y, m, 1),
    );

  const shiftView = (delta: number) => {
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  };
  const canGoBack =
    view.y > today.getFullYear() ||
    (view.y === today.getFullYear() && view.m > today.getMonth());

  const onDay = (iso: string) => {
    if (iso < todayISO) return;
    if (!checkIn || (checkIn && checkOut)) onChange(iso, null);
    else if (iso < checkIn) onChange(iso, null);
    else onChange(checkIn, iso);
  };

  const renderMonth = (y: number, m: number) => {
    const firstDay = new Date(y, m, 1).getDay();
    const count = new Date(y, m + 1, 0).getDate();
    const cells: (number | null)[] = [
      ...Array.from({ length: firstDay }, () => null),
      ...Array.from({ length: count }, (_, i) => i + 1),
    ];
    return (
      <div>
        <p className="text-center font-display text-lg text-ink font-light mb-3">
          {monthTitle(y, m)}
        </p>
        <div className="grid grid-cols-7 gap-y-1">
          {weekdays.map((w, i) => (
            <span
              key={i}
              className="text-center text-[11px] font-medium text-neutral-500 pb-1"
            >
              {w}
            </span>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <span key={i} />;
            const iso = toISO(new Date(y, m, day));
            const past = iso < todayISO;
            const isStart = iso === checkIn;
            const isEnd = iso === checkOut;
            const inRange =
              checkIn && checkOut && iso > checkIn && iso < checkOut;
            return (
              <button
                key={i}
                type="button"
                disabled={past}
                onClick={() => onDay(iso)}
                className={`h-9 text-sm rounded-full transition-colors ${
                  past
                    ? "text-neutral-300 cursor-default"
                    : isStart || isEnd
                      ? "bg-ink text-white font-semibold"
                      : inRange
                        ? "bg-neutral-100 text-ink"
                        : "text-ink hover:bg-neutral-100"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const pickMonth = (y: number, m: number) => {
    if (duration === "weekend") {
      const first = new Date(y, m, 1);
      const add = (5 - first.getDay() + 7) % 7; // days until Friday
      const fri = new Date(y, m, 1 + add);
      const sun = new Date(y, m, 1 + add + 2);
      onChange(toISO(fri), toISO(sun));
    } else if (duration === "week") {
      onChange(toISO(new Date(y, m, 1)), toISO(new Date(y, m, 8)));
    } else {
      // Any days — span the whole month; the listing prices the range but
      // doesn't hard-filter on it, so this just means "sometime this month".
      onChange(toISO(new Date(y, m, 1)), toISO(new Date(y, m + 1, 0)));
    }
  };

  const flexMonths = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    return { y: d.getFullYear(), m: d.getMonth() };
  });

  const segBtn = (active: boolean) =>
    `px-6 py-2 rounded-full text-sm font-medium transition-colors ${
      active ? "bg-ink text-white shadow" : "text-neutral-600 hover:text-ink"
    }`;

  return (
    <div className="text-left">
      {/* Tabs (centered) + clear on the right */}
      <div className="relative flex items-center justify-center">
        <div className="inline-flex items-center gap-1 rounded-full bg-neutral-100 p-1">
          <button
            type="button"
            onClick={() => setTab("dates")}
            className={segBtn(tab === "dates")}
          >
            {t("datesTab")}
          </button>
          <button
            type="button"
            onClick={() => setTab("flexible")}
            className={segBtn(tab === "flexible")}
          >
            {t("flexibleTab")}
          </button>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-neutral-500 hover:text-ink underline underline-offset-4 decoration-neutral-300 hover:decoration-ink transition-colors"
        >
          {t("clearDates")}
        </button>
      </div>

      {tab === "dates" ? (
        <>
          <div className="relative mt-6">
            <button
              type="button"
              onClick={() => shiftView(-1)}
              disabled={!canGoBack}
              aria-label="Previous month"
              className="absolute left-0 top-0 p-1.5 rounded-full text-ink disabled:text-neutral-300 hover:bg-neutral-100 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => shiftView(1)}
              aria-label="Next month"
              className="absolute right-0 top-0 p-1.5 rounded-full text-ink hover:bg-neutral-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8">
              {renderMonth(view.y, view.m)}
              <div className="hidden md:block">
                {renderMonth(
                  new Date(view.y, view.m + 1, 1).getFullYear(),
                  new Date(view.y, view.m + 1, 1).getMonth(),
                )}
              </div>
            </div>
          </div>

          {/* Flexibility pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {FLEX_PILLS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setFlex(n)}
                className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                  flex === n
                    ? "border-ink text-ink font-medium"
                    : "border-neutral-200 text-neutral-600 hover:border-neutral-400"
                }`}
              >
                {n === 0 ? t("exactDates") : t("plusMinus", { n })}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-6">
          <p className="text-center text-ink font-semibold">
            {t("flexDurationTitle")}
          </p>
          <div className="mt-4 flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-full bg-neutral-100 p-1">
              <button
                type="button"
                onClick={() => setDuration("anydays")}
                className={segBtn(duration === "anydays")}
              >
                {t("anyDays")}
              </button>
              <button
                type="button"
                onClick={() => setDuration("weekend")}
                className={segBtn(duration === "weekend")}
              >
                {t("weekend")}
              </button>
              <button
                type="button"
                onClick={() => setDuration("week")}
                className={segBtn(duration === "week")}
              >
                {t("weekLabel")}
              </button>
            </div>
          </div>

          <p className="text-center text-ink font-semibold mt-7">
            {t("flexWhenTitle")}
          </p>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {flexMonths.map(({ y, m }) => {
              const first = new Date(y, m, 1);
              const monthName = new Intl.DateTimeFormat(locale, {
                month: "long",
              }).format(first);
              // Year via Intl so Thai shows the Buddhist era, matching the calendar.
              const yearLabel = new Intl.DateTimeFormat(locale, {
                year: "numeric",
              }).format(first);
              return (
                <button
                  key={`${y}-${m}`}
                  type="button"
                  onClick={() => pickMonth(y, m)}
                  className="rounded-2xl border border-neutral-200 py-6 text-center transition-colors hover:border-neutral-400 hover:bg-neutral-50"
                >
                  <span className="block text-ink font-medium">
                    {monthName}
                  </span>
                  <span className="block text-neutral-500 text-sm mt-0.5">
                    {yearLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
