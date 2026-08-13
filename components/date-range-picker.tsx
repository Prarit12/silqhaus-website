"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  getSilqhausMarkupPercentage,
  type SilqhausMarkupSource,
} from "@/config/ota-markups";
import { useTranslations, useLocale } from "next-intl";

interface CalendarDay {
  date: string;
  price: number;
  isAvailable: number;
  status: string;
  minimumStay?: number;
}

interface DateRangePickerProps {
  checkInDate: string;
  checkOutDate: string;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
  calendarData: CalendarDay[];
  minimumStay: number;
  isLoading?: boolean;
  onError?: (error: string | null) => void;
  applyMarkup?: boolean;
  markupSource: SilqhausMarkupSource;
  /** Render the calendar in normal flow (for scrollable sheets) instead of
   *  as an absolute popup, which a scroll container would clip. */
  inlineCalendar?: boolean;
}

function formatAbbreviatedPrice(price: number): string {
  if (!price || price <= 0) return "";
  const rounded = Math.ceil(price / 1000);
  if (price >= 1000) return `฿${rounded}K`;
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

function getTodayLocalString(): string {
  return getLocalDateString(new Date());
}

export function DateRangePicker({
  checkInDate,
  checkOutDate,
  onCheckInChange,
  onCheckOutChange,
  calendarData,
  minimumStay,
  isLoading = false,
  onError,
  applyMarkup = true,
  markupSource,
  inlineCalendar = false,
}: DateRangePickerProps) {
  const t = useTranslations("dateRangePicker");
  const locale = useLocale();
  const [showCalendar, setShowCalendar] = useState<
    "checkin" | "checkout" | null
  >(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const today = getTodayLocalString();

  const reservedDates = useMemo(() => {
    const reserved = new Set<string>();
    for (const day of calendarData) {
      if (day.status === "reserved" || day.isAvailable !== 1) {
        reserved.add(day.date);
      }
    }
    return reserved;
  }, [calendarData]);

  const getMinimumStayForDate = (dateString: string): number => {
    const dayData = calendarData.find((day) => day.date === dateString);
    return dayData?.minimumStay || 1;
  };

  const isWithinMinimumStay = (dateString: string): boolean => {
    if (!checkInDate || showCalendar !== "checkout") return false;
    if (dateString === checkInDate) return false;

    const checkInMinStay = getMinimumStayForDate(checkInDate);
    const checkIn = parseLocalDate(checkInDate);
    const current = parseLocalDate(dateString);
    const daysDiff = Math.floor(
      (current.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
    );

    return daysDiff > 0 && daysDiff < checkInMinStay;
  };

  const hasUnavailableDatesInRange = (checkoutDateString: string): boolean => {
    if (!checkInDate || showCalendar !== "checkout") return false;
    if (checkoutDateString <= checkInDate) return false;

    const checkIn = parseLocalDate(checkInDate);
    const checkOut = parseLocalDate(checkoutDateString);

    const current = new Date(checkIn);
    current.setDate(current.getDate() + 1);

    while (current < checkOut) {
      const dateStr = getLocalDateString(current);
      if (reservedDates.has(dateStr)) {
        return true;
      }
      current.setDate(current.getDate() + 1);
    }

    return false;
  };

  const getUnavailableDatesInRange = (checkoutDateString: string): string[] => {
    if (!checkInDate || showCalendar !== "checkout") return [];
    if (checkoutDateString <= checkInDate) return [];

    const unavailableInRange: string[] = [];
    const checkIn = parseLocalDate(checkInDate);
    const checkOut = parseLocalDate(checkoutDateString);

    const current = new Date(checkIn);
    current.setDate(current.getDate() + 1);

    while (current < checkOut) {
      const dateStr = getLocalDateString(current);
      if (reservedDates.has(dateStr)) {
        unavailableInRange.push(dateStr);
      }
      current.setDate(current.getDate() + 1);
    }

    return unavailableInRange;
  };

  const isDateDisabled = (dateString: string): boolean => {
    if (dateString < today) return true;
    if (reservedDates.has(dateString)) return true;
    if (showCalendar === "checkout" && isWithinMinimumStay(dateString))
      return true;
    if (showCalendar === "checkout" && hasUnavailableDatesInRange(dateString))
      return true;
    return false;
  };

  const isDateReserved = (dateString: string): boolean => {
    return reservedDates.has(dateString);
  };

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateClick = (dateString: string) => {
    if (isDateDisabled(dateString)) return;

    if (showCalendar === "checkin") {
      onCheckInChange(dateString);
      if (checkOutDate && dateString >= checkOutDate) {
        onCheckOutChange("");
      }
      setShowCalendar("checkout");
    } else if (showCalendar === "checkout") {
      if (checkInDate && dateString <= checkInDate) {
        onError?.(t("checkoutAfterCheckin"));
        return;
      }

      if (hasUnavailableDatesInRange(dateString)) {
        onError?.(t("unavailable"));
        return;
      }

      if (checkInDate) {
        const checkIn = parseLocalDate(checkInDate);
        const checkOut = parseLocalDate(dateString);
        const nights = Math.floor(
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
        );

        const checkInMinStay = getMinimumStayForDate(checkInDate);

        if (nights < checkInMinStay) {
          onError?.(t("minimumStayError", { count: checkInMinStay }));
          return;
        }
      }

      onCheckOutChange(dateString);
      onError?.(null);
      setShowCalendar(null);
    }
  };

  const navigateMonth = (direction: number) => {
    setCurrentMonth((prev) => {
      let newMonth = prev.month + direction;
      let newYear = prev.year;

      if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      } else if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      }

      return { year: newYear, month: newMonth };
    });
  };

  const renderCalendar = () => {
    const { year, month } = currentMonth;
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days: (string | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      days.push(dateString);
    }

    return (
      <div
        className={`${
          inlineCalendar
            ? "relative mt-2"
            : "absolute top-full left-0 right-0 z-50 mt-1"
        } bg-white text-gray-900 rounded-lg shadow-xl border border-gray-200 p-3`}
      >
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
              return <div key={`empty-${index}`} className="w-12 h-14" />;
            }

            const day = parseInt(dateString.split("-")[2], 10);
            const dayData = calendarData.find((d) => d.date === dateString);
            const dayPrice = dayData?.price || 0;
            const disabled = isDateDisabled(dateString);
            const reserved = isDateReserved(dateString);
            const isSelected =
              dateString === checkInDate || dateString === checkOutDate;
            const isInRange =
              checkInDate &&
              checkOutDate &&
              dateString > checkInDate &&
              dateString < checkOutDate;
            const isPast = dateString < today;
            const hasCalendarData = calendarData.length > 0;
            const noPrice =
              hasCalendarData && !isPast && !reserved && dayPrice === 0;
            const isMinStayBlocked = isWithinMinimumStay(dateString);
            const checkInMinStay = checkInDate
              ? getMinimumStayForDate(checkInDate)
              : 0;

            const spansUnavailable =
              showCalendar === "checkout" &&
              !isPast &&
              !reserved &&
              dateString > (checkInDate || "") &&
              hasUnavailableDatesInRange(dateString);

            const unavailableDatesInRange =
              spansUnavailable && hoveredDate === dateString
                ? getUnavailableDatesInRange(dateString)
                : [];

            const showMinStayTooltip =
              hoveredDate === dateString && isMinStayBlocked;
            const showUnavailableTooltip =
              hoveredDate === dateString && spansUnavailable;

            return (
              <div
                key={dateString}
                className="relative"
                onMouseEnter={() => setHoveredDate(dateString)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                {showMinStayTooltip && !showUnavailableTooltip && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-[10px] rounded whitespace-nowrap z-10 pointer-events-none">
                    {t("minimumStayTooltip", { count: checkInMinStay })}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                  </div>
                )}
                {showUnavailableTooltip && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-red-600 text-white text-[10px] rounded whitespace-nowrap z-10 pointer-events-none">
                    {t("unavailable")}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-red-600" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleDateClick(dateString)}
                  disabled={disabled || noPrice}
                  className={`
                    w-12 h-14 text-xs rounded-md relative flex flex-col items-center justify-center gap-0
                    ${disabled || noPrice ? "cursor-not-allowed" : "cursor-pointer hover:bg-neutral-100"}
                    ${isSelected ? "bg-ink text-white" : ""}
                    ${isInRange ? "bg-neutral-100" : ""}
                    ${isPast || reserved || noPrice ? "text-gray-400" : ""}
                    ${isMinStayBlocked && !isPast && !reserved && !noPrice ? "text-orange-400 bg-orange-50" : ""}
                    ${spansUnavailable ? "text-red-500 bg-red-50 ring-1 ring-red-300" : ""}
                    ${!isPast && !reserved && !noPrice && !isMinStayBlocked && !spansUnavailable && !isSelected ? "text-gray-800" : ""}
                  `}
                  aria-label={`${dateString}${reserved ? ` (${t("reserved")})` : ""}${isPast ? ` (${t("past")})` : ""}${noPrice ? ` (${t("unavailable")})` : ""}${isMinStayBlocked ? ` (${t("minimumStayTooltip", { count: checkInMinStay })})` : ""}${spansUnavailable ? ` (${t("unavailableDatesInRange")})` : ""}`}
                >
                  <span
                    className={`text-[12px] leading-none ${reserved || isPast || noPrice ? "line-through" : ""}`}
                  >
                    {day}
                  </span>
                  {!isPast && !reserved && !noPrice && dayPrice > 0 && (
                    <span
                      className={`text-[9px] leading-none mt-0.5 ${isSelected ? "text-white/80" : "text-gray-500"}`}
                    >
                      {formatAbbreviatedPrice(
                        applyMarkup
                          ? Math.ceil(
                              dayPrice *
                                (1 +
                                  getSilqhausMarkupPercentage(markupSource) /
                                    100),
                            )
                          : dayPrice,
                      )}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-end text-xs text-gray-500">
          <button
            type="button"
            onClick={() => setShowCalendar(null)}
            className="text-ink font-medium hover:underline"
          >
            {t("close")}
          </button>
        </div>
      </div>
    );
  };

  const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = parseLocalDate(dateString);
    return date.toLocaleDateString(locale === "th" ? "th-TH" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-1.5">
        <div className="relative">
          <label className="block text-xs font-bold uppercase tracking-wide mb-0.5 text-ink">
            {t("checkIn")}
          </label>
          <button
            type="button"
            onClick={() =>
              setShowCalendar(showCalendar === "checkin" ? null : "checkin")
            }
            className={`
              w-full p-2 text-xs border rounded-lg text-left bg-white
              ${showCalendar === "checkin" ? "border-ink ring-1 ring-ink" : "border-neutral-300"}
              ${checkInDate ? "text-gray-900" : "text-neutral-500"}
            `}
          >
            {checkInDate ? formatDisplayDate(checkInDate) : t("selectDate")}
          </button>
          {checkInDate && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCheckInChange("");
                onCheckOutChange("");
              }}
              className="absolute right-1.5 top-[22px] p-0.5 text-gray-400 hover:text-gray-600"
              aria-label={t("clearCheckIn")}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="relative">
          <label className="block text-xs font-bold uppercase tracking-wide mb-0.5 text-ink">
            {t("checkOut")}
          </label>
          <button
            type="button"
            onClick={() =>
              setShowCalendar(showCalendar === "checkout" ? null : "checkout")
            }
            disabled={!checkInDate}
            className={`
              w-full p-2 text-xs border rounded-lg text-left bg-white
              ${showCalendar === "checkout" ? "border-ink ring-1 ring-ink" : "border-neutral-300"}
              ${checkOutDate ? "text-gray-900" : "text-neutral-500"}
              ${!checkInDate ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {checkOutDate ? formatDisplayDate(checkOutDate) : t("selectDate")}
          </button>
          {checkOutDate && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCheckOutChange("");
              }}
              className="absolute right-1.5 top-[22px] p-0.5 text-gray-400 hover:text-gray-600"
              aria-label={t("clearCheckOut")}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {showCalendar && renderCalendar()}

      {isLoading && (
        <div className="mt-2 text-center text-xs text-neutral-600">
          {t("loadingAvailability")}
        </div>
      )}
    </div>
  );
}
