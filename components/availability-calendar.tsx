"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Moon } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  getSilqhausMarkupPercentage,
  type SilqhausMarkupSource,
} from "@/config/ota-markups";

/**
 * "Availability" — the booking picker's calendar blown up into a browsable
 * two-month section. Shares the page's check-in/out state, so selecting a
 * range here re-prices the booking card, and vice versa. Day semantics match
 * the DateRangePicker: past/blocked/unpriced days are dashes, check-out
 * choices that violate the minimum stay or span blocked nights are disabled.
 */

interface CalendarDay {
  date: string;
  price: number;
  isAvailable: number;
  status: string;
  minimumStay?: number;
}

interface AvailabilityCalendarProps {
  calendarData: CalendarDay[];
  minimumStay: number;
  checkInDate: string;
  checkOutDate: string;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
  applyMarkup?: boolean;
  markupSource: SilqhausMarkupSource;
  isLoading?: boolean;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toDateString(year: number, month: number, day: number): string {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function getTodayString(): string {
  const d = new Date();
  return toDateString(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(dateString: string, days: number): string {
  const [y, m, d] = dateString.split("-").map(Number);
  const dt = new Date(y, m - 1, d + days);
  return toDateString(dt.getFullYear(), dt.getMonth(), dt.getDate());
}

function nightsBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  return Math.round(
    (new Date(by, bm - 1, bd).getTime() - new Date(ay, am - 1, ad).getTime()) /
      86_400_000,
  );
}

function abbreviatePrice(price: number): string {
  if (!price || price <= 0) return "";
  if (price >= 1000) return `${Math.ceil(price / 1000)}K`;
  return String(price);
}

export function AvailabilityCalendar({
  calendarData,
  minimumStay,
  checkInDate,
  checkOutDate,
  onCheckInChange,
  onCheckOutChange,
  applyMarkup = true,
  markupSource,
  isLoading = false,
}: AvailabilityCalendarProps) {
  const t = useTranslations("propertyDetail.availability");
  const tPicker = useTranslations("dateRangePicker");
  const today = getTodayString();

  const [monthOffset, setMonthOffset] = useState(0);

  const byDate = useMemo(() => {
    const map = new Map<string, CalendarDay>();
    for (const day of calendarData) map.set(day.date, day);
    return map;
  }, [calendarData]);

  const markup = applyMarkup ? getSilqhausMarkupPercentage(markupSource) : 0;
  const displayPrice = (raw: number) =>
    markup > 0 ? Math.ceil(raw * (1 + markup / 100)) : raw;

  const isBlocked = (dateString: string): boolean => {
    const day = byDate.get(dateString);
    if (!day) return true;
    return day.status === "reserved" || day.isAvailable !== 1 || day.price <= 0;
  };

  const minStayFor = (dateString: string): number =>
    byDate.get(dateString)?.minimumStay || minimumStay || 1;

  /** In checkout-picking mode, a day is a valid checkout only if every night
   *  from check-in up to it is open and the minimum stay is met. */
  const isValidCheckout = (dateString: string): boolean => {
    if (!checkInDate || dateString <= checkInDate) return false;
    if (nightsBetween(checkInDate, dateString) < minStayFor(checkInDate))
      return false;
    for (
      let cursor = checkInDate;
      cursor < dateString;
      cursor = addDays(cursor, 1)
    ) {
      if (isBlocked(cursor)) return false;
    }
    return true;
  };

  const pickingCheckout = !!checkInDate && !checkOutDate;

  const handleDayClick = (dateString: string) => {
    if (dateString < today) return;
    if (pickingCheckout && dateString > checkInDate) {
      // Styled as disabled when invalid — keep the click a no-op to match.
      if (isValidCheckout(dateString)) onCheckOutChange(dateString);
      return;
    }
    // Anything else restarts the selection from this day, if it can host one.
    if (isBlocked(dateString)) return;
    onCheckInChange(dateString);
    onCheckOutChange("");
  };

  const clear = () => {
    onCheckInChange("");
    onCheckOutChange("");
  };

  const base = new Date();
  const canGoBack = monthOffset > 0;
  const canGoForward = monthOffset < 10;

  const nights =
    checkInDate && checkOutDate ? nightsBetween(checkInDate, checkOutDate) : 0;

  const formatChipDate = (dateString: string) => {
    const [y, m, d] = dateString.split("-").map(Number);
    return `${tPicker(`months.${m - 1}`).slice(0, 3)} ${d}`;
  };

  const renderMonth = (offset: number) => {
    const year = base.getFullYear();
    const month = base.getMonth() + monthOffset + offset;
    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekday = first.getDay();

    const cells: Array<string | null> = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++)
      cells.push(toDateString(first.getFullYear(), first.getMonth(), d));

    return (
      <div key={offset} className={offset === 1 ? "hidden md:block" : ""}>
        <p className="text-[15px] font-semibold text-ink mb-3">
          {tPicker(`months.${first.getMonth()}`)} {first.getFullYear()}
        </p>
        <div className="grid grid-cols-7 mb-1 rounded-lg bg-neutral-50 py-1.5">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="text-center text-[11px] font-medium text-neutral-500"
            >
              {tPicker(`days.${i}`)}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((dateString, i) => {
            if (!dateString)
              return <div key={`e-${i}`} className="h-12 sm:h-14" />;
            const dayNum = Number(dateString.split("-")[2]);
            const past = dateString < today;
            const blocked = isBlocked(dateString);
            const day = byDate.get(dateString);
            const isCheckIn = dateString === checkInDate;
            const isCheckOut = dateString === checkOutDate;
            const inRange =
              !!checkInDate &&
              !!checkOutDate &&
              dateString > checkInDate &&
              dateString < checkOutDate;
            const checkoutDisabled =
              pickingCheckout &&
              dateString > checkInDate &&
              !isValidCheckout(dateString);
            const dead = past || (blocked && !isCheckOut);

            return (
              <button
                key={dateString}
                type="button"
                onClick={() => handleDayClick(dateString)}
                disabled={past || (blocked && !pickingCheckout)}
                aria-label={`${dateString}${blocked ? ` (${tPicker("unavailable")})` : ""}`}
                aria-pressed={isCheckIn || isCheckOut}
                className={`h-12 sm:h-14 flex flex-col items-center justify-center gap-0.5 rounded-lg transition-colors ${
                  isCheckIn || isCheckOut
                    ? "bg-ink text-white"
                    : inRange
                      ? "bg-neutral-100 text-ink"
                      : dead
                        ? "text-neutral-300 cursor-not-allowed"
                        : checkoutDisabled
                          ? "text-neutral-300 cursor-not-allowed"
                          : "text-ink cursor-pointer hover:bg-neutral-100"
                }`}
              >
                <span
                  className={`text-[13px] sm:text-sm font-semibold leading-none ${
                    dead && !isCheckIn && !isCheckOut ? "line-through" : ""
                  }`}
                >
                  {dayNum}
                </span>
                <span
                  className={`text-[10px] leading-none ${
                    isCheckIn || isCheckOut
                      ? "text-white/70"
                      : "text-neutral-500"
                  }`}
                >
                  {past || !day
                    ? "–"
                    : blocked
                      ? "–"
                      : abbreviatePrice(displayPrice(day.price))}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section className="py-8 border-b border-neutral-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold normal-case tracking-normal text-ink">
          {t("title")}
        </h2>
        {(checkInDate || checkOutDate) && (
          <button
            type="button"
            onClick={clear}
            className="text-sm font-semibold text-ink underline underline-offset-4 hover:text-ink"
          >
            {t("clear")}
          </button>
        )}
      </div>

      {/* Selection chips */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px]">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-ink">
          <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
          {checkInDate
            ? `${formatChipDate(checkInDate)}${
                checkOutDate ? ` – ${formatChipDate(checkOutDate)}` : ""
              }`
            : t("selectPrompt")}
        </span>
        {nights > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-ink">
            <Moon className="w-3.5 h-3.5" aria-hidden="true" />
            {nights === 1
              ? t("nightsOne")
              : t("nightsMany", { count: nights })}
          </span>
        )}
        {isLoading && (
          <span className="text-neutral-500">
            {tPicker("loadingAvailability")}
          </span>
        )}
      </div>

      {/* Two months */}
      <div className="mt-5 rounded-2xl border border-neutral-200 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {renderMonth(0)}
          {renderMonth(1)}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMonthOffset((v) => Math.max(0, v - 1))}
              disabled={!canGoBack}
              aria-label={tPicker("previousMonth")}
              className="w-9 h-9 grid place-items-center rounded-full border border-neutral-200 text-ink hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setMonthOffset((v) => Math.min(10, v + 1))}
              disabled={!canGoForward}
              aria-label={tPicker("nextMonth")}
              className="w-9 h-9 grid place-items-center rounded-full border border-neutral-200 text-ink hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-ink" aria-hidden="true" />
              {t("legendAvailable")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-neutral-400">–</span>
              {t("legendUnavailable")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
