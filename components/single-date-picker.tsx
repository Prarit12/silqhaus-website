"use client";

import { useMemo, useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import {
  getSilqhausMarkupPercentage,
  type SilqhausMarkupSource,
} from "@/config/ota-markups";
import { useTranslations, useLocale } from "next-intl";

/**
 * Single-date variant of the site's DateRangePicker calendar — same popup
 * card, month grid, price-per-day cells and blocked-day treatment, but it
 * picks one date. Used by the monthly wizard (move-in / check-out).
 */

interface CalendarDay {
  date: string;
  price: number;
  isAvailable: number;
  status: string;
}

interface SingleDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  calendarData: CalendarDay[];
  /** First selectable day (inclusive). */
  minDate: string;
  /** Block days the calendar marks reserved (used for move-in). */
  disableReserved?: boolean;
  markupSource: SilqhausMarkupSource;
  ariaLabel: string;
  /** Trigger size: hero-large for step 2, large for step 3. */
  size?: "xl" | "lg";
}

function formatAbbreviatedPrice(price: number): string {
  if (!price || price <= 0) return "";
  if (price >= 1000) return `฿${Math.ceil(price / 1000)}K`;
  return `฿${price}`;
}

function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function SingleDatePicker({
  value,
  onChange,
  calendarData,
  minDate,
  disableReserved = false,
  markupSource,
  ariaLabel,
  size = "lg",
}: SingleDatePickerProps) {
  const t = useTranslations("dateRangePicker");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const anchor = value || minDate;
    const d = anchor ? parseLocalDate(anchor) : new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const today = getLocalDateString(new Date());

  const reservedDates = useMemo(() => {
    const reserved = new Set<string>();
    for (const day of calendarData) {
      if (day.status === "reserved" || day.isAvailable !== 1) {
        reserved.add(day.date);
      }
    }
    return reserved;
  }, [calendarData]);

  const priceByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const day of calendarData) map.set(day.date, day.price);
    return map;
  }, [calendarData]);

  const markup = 1 + getSilqhausMarkupPercentage(markupSource) / 100;

  const isDisabled = (dateString: string) =>
    dateString < minDate || (disableReserved && reservedDates.has(dateString));

  const navigateMonth = (direction: number) => {
    setCurrentMonth((prev) => {
      let month = prev.month + direction;
      let year = prev.year;
      if (month > 11) {
        month = 0;
        year++;
      } else if (month < 0) {
        month = 11;
        year--;
      }
      return { year, month };
    });
  };

  const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return "";
    return parseLocalDate(dateString).toLocaleDateString(
      locale === "th" ? "th-TH" : "en-US",
      { month: "short", day: "numeric", year: "numeric" },
    );
  };

  const renderCalendar = () => {
    const { year, month } = currentMonth;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days: (string | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      );
    }

    return (
      <div className="absolute top-full left-0 z-50 mt-2 w-[min(384px,calc(100vw-2rem))] bg-white text-gray-900 rounded-lg shadow-xl border border-gray-200 p-3">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => navigateMonth(-1)}
            className="p-1 hover:bg-gray-100 rounded text-gray-700"
            aria-label={t("previousMonth")}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium text-sm text-gray-900">
            {t(`months.${month}`)} {year}
          </span>
          <button
            type="button"
            onClick={() => navigateMonth(1)}
            className="p-1 hover:bg-gray-100 rounded text-gray-700"
            aria-label={t("nextMonth")}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={String(i)}
              className="text-center text-xs font-medium text-gray-500 py-1"
            >
              {t(`days.${i}`)}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((dateString, index) => {
            if (!dateString) {
              return <div key={`empty-${index}`} className="h-14" />;
            }

            const day = parseInt(dateString.split("-")[2], 10);
            const rawPrice = priceByDate.get(dateString) || 0;
            const reserved = reservedDates.has(dateString);
            const isPast = dateString < today;
            const disabled = isDisabled(dateString);
            const isSelected = dateString === value;
            const struck = isPast || (reserved && disableReserved);

            return (
              <button
                key={dateString}
                type="button"
                onClick={() => {
                  if (disabled) return;
                  onChange(dateString);
                  setOpen(false);
                }}
                disabled={disabled}
                className={`
                  h-14 w-full text-xs rounded-md relative flex flex-col items-center justify-center gap-0
                  ${disabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-neutral-100"}
                  ${isSelected ? "bg-ink text-white" : disabled ? "text-gray-400" : "text-gray-800"}
                `}
                aria-label={`${dateString}${reserved ? ` (${t("reserved")})` : ""}${isPast ? ` (${t("past")})` : ""}`}
              >
                <span
                  className={`text-[12px] leading-none ${struck ? "line-through" : ""}`}
                >
                  {day}
                </span>
                {!isPast && !reserved && rawPrice > 0 && (
                  <span
                    className={`text-[9px] leading-none mt-0.5 ${isSelected ? "text-white/80" : "text-gray-500"}`}
                  >
                    {formatAbbreviatedPrice(Math.ceil(rawPrice * markup))}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-end text-xs text-gray-500">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-ink font-medium hover:underline"
          >
            {t("close")}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={ariaLabel}
        aria-expanded={open}
        className={`w-full ${
          size === "xl" ? "h-16 text-xl" : "h-14 text-lg"
        } rounded-xl border-2 bg-white px-5 font-semibold text-left flex items-center justify-between gap-3 shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30 ${
          open ? "border-ink ring-2 ring-neutral-900/15" : "border-ink"
        } ${value ? "text-ink" : "text-neutral-500"}`}
      >
        {value ? formatDisplayDate(value) : t("selectDate")}
        <CalendarIcon
          className="w-5 h-5 shrink-0 text-ink"
          strokeWidth={2}
          aria-hidden="true"
        />
      </button>
      {open && renderCalendar()}
    </div>
  );
}
