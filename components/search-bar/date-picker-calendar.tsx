"use client";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerCalendarProps {
  checkIn: Date | null;
  checkOut: Date | null;
  isOpen: boolean;
  selectingCheckOut: boolean;
  currentMonth: Date;
  onToggle: (selectingCheckOut?: boolean) => void;
  onDateClick: (date: Date) => void;
  onMonthChange: (month: Date) => void;
  onClose: () => void;
  t: any;
}

const generateCalendarDays = (month: Date) => {
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const startDate = new Date(start);
  startDate.setDate(startDate.getDate() - start.getDay());

  const days = [];
  const current = new Date(startDate);

  while (current <= end || days.length < 42) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
    if (days.length >= 42) break;
  }

  return days;
};

const isDateInRange = (
  date: Date,
  checkIn: Date | null,
  checkOut: Date | null,
) => {
  if (!checkIn || !checkOut) return false;
  return date >= checkIn && date <= checkOut;
};

const isDateSelected = (
  date: Date,
  checkIn: Date | null,
  checkOut: Date | null,
) => {
  if (!checkIn) return false;
  if (checkOut) {
    return (
      date.toDateString() === checkIn.toDateString() ||
      date.toDateString() === checkOut.toDateString()
    );
  }
  return date.toDateString() === checkIn.toDateString();
};

export default function DatePickerCalendar({
  checkIn,
  checkOut,
  isOpen,
  selectingCheckOut,
  currentMonth,
  onToggle,
  onDateClick,
  onMonthChange,
  onClose,
  t,
}: DatePickerCalendarProps) {
  return (
    <>
      <div className="relative flex-1 min-w-0">
        <button
          onClick={() => onToggle(false)}
          className="w-full flex items-center gap-2 cursor-pointer hover:bg-snow/10 rounded-full px-3 py-3 md:py-2 transition-all duration-300 ease-out text-left min-h-[48px] touch-manipulation"
        >
          <Calendar className="w-4 h-4 text-[#7e6725] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-sulphur-point font-bold text-mist/70 uppercase tracking-wider">
              {t("filters.checkIn")}
            </div>
            <div className="text-[13px] font-poppins text-snow truncate">
              {checkIn
                ? checkIn.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : t("filters.selectDate")}
            </div>
          </div>
        </button>
      </div>

      <div className="hidden md:block w-px h-8 bg-mist/15 mx-0.5" />

      <div className="relative flex-1 min-w-0">
        <button
          onClick={() => onToggle(true)}
          className={`w-full flex items-center gap-2 cursor-pointer hover:bg-snow/10 rounded-full px-3 py-3 md:py-2 transition-all duration-300 ease-out text-left min-h-[48px] touch-manipulation`}
        >
          <Calendar className="w-4 h-4 text-[#7e6725] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-sulphur-point font-bold text-mist/70 uppercase tracking-wider">
              {t("filters.checkOut")}
            </div>
            <div className="text-[13px] font-poppins text-snow truncate">
              {checkOut
                ? checkOut.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : t("filters.selectDate")}
            </div>
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-full min-w-[360px] max-w-lg bg-white text-gray-900 rounded-xl p-4 shadow-2xl border border-gray-100 z-50 max-h-[80vh] overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() =>
                    onMonthChange(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() - 1,
                      ),
                    )
                  }
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-medium text-sm text-gray-900">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button
                  onClick={() =>
                    onMonthChange(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1,
                      ),
                    )
                  }
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-gray-500 py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays(currentMonth).map((date, index) => {
                  const isCurrentMonth =
                    date.getMonth() === currentMonth.getMonth();
                  const isToday =
                    date.toDateString() === new Date().toDateString();
                  const isSelected = isDateSelected(date, checkIn, checkOut);
                  const inRange = isDateInRange(date, checkIn, checkOut);
                  const isPast = date < new Date() && !isToday;

                  return (
                    <button
                      key={index}
                      onClick={() =>
                        !isPast && isCurrentMonth && onDateClick(date)
                      }
                      disabled={isPast || !isCurrentMonth}
                      className={`w-full h-10 text-xs rounded-md flex items-center justify-center transition-colors ${
                        !isCurrentMonth
                          ? "text-gray-300"
                          : isPast
                            ? "text-gray-400 cursor-not-allowed"
                            : isSelected
                              ? "bg-[#7e6725] text-white"
                              : inRange
                                ? "bg-[#7e6725]/10 text-gray-800"
                                : isToday
                                  ? "bg-gray-100 text-gray-800"
                                  : "text-gray-800 hover:bg-[#7e6725]/20 cursor-pointer"
                      }`}
                    >
                      <span
                        className={`text-[12px] leading-none ${isPast && isCurrentMonth ? "line-through" : ""}`}
                      >
                        {date.getDate()}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[#7e6725] text-xs font-medium hover:underline"
                >
                  {t("filters.close")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
