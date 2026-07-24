"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, X } from "lucide-react";

type DateRange = { checkIn: Date | null; checkOut: Date | null };

interface VacationFilterPopoverProps {
  initialDates: DateRange;
  initialGuests: number;
  initialBedrooms: number;
  initialPrice: [number, number];
  initialAvailableOnly: boolean;
  maxBedrooms: number;
  onApply: (v: {
    checkIn: Date | null;
    checkOut: Date | null;
    guests: number;
    bedrooms: number;
    price: [number, number];
    availableOnly: boolean;
  }) => void;
  onClear: () => void;
  onClose: () => void;
  t: any;
}

const PRICE_MAX = 100000;

function sameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

function monthDays(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const days: Date[] = [];
  const cur = new Date(first);
  cur.setDate(cur.getDate() - first.getDay());
  for (let i = 0; i < 42; i++) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const btn =
    "grid place-items-center w-8 h-8 rounded-full border border-neutral-300 text-ink hover:border-ink disabled:opacity-40 disabled:hover:border-neutral-300";
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink text-[14px]">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className={btn}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`${label} −`}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-6 text-center text-ink text-[14px] tabular-nums">
          {value}
        </span>
        <button
          type="button"
          className={btn}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label={`${label} +`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * Advanced-filters panel: date range (compact single-month calendar), guests,
 * min bedrooms, price ceiling, and available-only. Holds a draft and commits
 * everything on Apply, so partial edits never churn the map.
 */
export function VacationFilterPopover({
  initialDates,
  initialGuests,
  initialBedrooms,
  initialPrice,
  initialAvailableOnly,
  maxBedrooms,
  onApply,
  onClear,
  onClose,
  t,
}: VacationFilterPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [checkIn, setCheckIn] = useState<Date | null>(initialDates.checkIn);
  const [checkOut, setCheckOut] = useState<Date | null>(initialDates.checkOut);
  const [guests, setGuests] = useState(initialGuests);
  const [bedrooms, setBedrooms] = useState(initialBedrooms);
  const [maxPrice, setMaxPrice] = useState(initialPrice[1] || PRICE_MAX);
  const [availableOnly, setAvailableOnly] = useState(initialAvailableOnly);
  // Midnight today, and the month the calendar opens on.
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [month, setMonth] = useState(
    () =>
      initialDates.checkIn ??
      new Date(today.getFullYear(), today.getMonth(), 1),
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [onClose]);

  const pickDate = (d: Date) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(d);
      setCheckOut(null);
    } else if (d <= checkIn) {
      setCheckIn(d);
    } else {
      setCheckOut(d);
    }
  };

  const inRange = (d: Date) =>
    checkIn && checkOut && d >= checkIn && d <= checkOut;
  const isEnd = (d: Date) =>
    (checkIn && sameDay(d, checkIn)) || (checkOut && sameDay(d, checkOut));

  const apply = () => {
    onApply({
      checkIn,
      checkOut,
      guests,
      bedrooms,
      price: [0, maxPrice],
      availableOnly,
    });
    onClose();
  };

  const clearAll = () => {
    setCheckIn(null);
    setCheckOut(null);
    setGuests(1);
    setBedrooms(1);
    setMaxPrice(PRICE_MAX);
    setAvailableOnly(false);
    onClear();
    onClose();
  };

  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      className="w-[min(92vw,360px)] max-h-[80vh] overflow-y-auto rounded-2xl border border-neutral-200 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.18)] p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-ink font-gilroy text-[16px] font-bold">
          {t("filters.filter")}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("filters.close")}
          className="grid place-items-center w-8 h-8 rounded-full hover:bg-neutral-100 text-ink"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Calendar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            aria-label={t("filters.checkIn")}
            className="grid place-items-center w-8 h-8 rounded-full hover:bg-neutral-100 text-ink"
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
            }
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-ink text-[14px] font-semibold">
            {month.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            type="button"
            aria-label={t("filters.checkOut")}
            className="grid place-items-center w-8 h-8 rounded-full hover:bg-neutral-100 text-ink"
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
            }
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 text-center text-[11px] text-neutral-400 mb-1">
          {weekdays.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {monthDays(month).map((d, i) => {
            const outside = d.getMonth() !== month.getMonth();
            const past = d < today && !sameDay(d, today);
            const end = isEnd(d);
            const mid = inRange(d) && !end;
            return (
              <button
                key={i}
                type="button"
                disabled={outside || past}
                onClick={() => pickDate(d)}
                className={`h-9 text-[13px] rounded-full transition-colors ${
                  outside || past
                    ? "text-neutral-300"
                    : end
                      ? "bg-ink text-white"
                      : mid
                        ? "bg-neutral-100 text-ink"
                        : "text-ink hover:bg-neutral-100"
                }`}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 border-t border-neutral-200 pt-4">
        <Stepper
          label={t("filters.minGuestCapacityLabel")}
          value={guests}
          min={1}
          max={30}
          onChange={setGuests}
        />
        <Stepper
          label={t("filters.minBedrooms")}
          value={bedrooms}
          min={1}
          max={Math.max(1, maxBedrooms)}
          onChange={setBedrooms}
        />

        {/* Price ceiling */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-ink text-[14px]">{t("filters.priceRange")}</span>
            <span className="text-neutral-500 text-[13px] tabular-nums">
              ฿{maxPrice.toLocaleString()}
              {maxPrice >= PRICE_MAX ? "+" : ""}
            </span>
          </div>
          <input
            type="range"
            min={1000}
            max={PRICE_MAX}
            step={1000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-ink"
            aria-label={t("filters.priceRange")}
          />
        </div>

        {/* Available only */}
        <label
          className={`flex items-center justify-between ${
            checkIn && checkOut ? "" : "opacity-50"
          }`}
        >
          <span className="text-ink text-[14px]">
            {t("filters.availableOnly")}
          </span>
          <input
            type="checkbox"
            className="w-4 h-4 accent-ink"
            checked={availableOnly}
            disabled={!(checkIn && checkOut)}
            onChange={(e) => setAvailableOnly(e.target.checked)}
          />
        </label>
      </div>

      <div className="flex items-center justify-between border-t border-neutral-200 pt-4 mt-4">
        <button
          type="button"
          onClick={clearAll}
          className="text-ink text-[14px] font-semibold underline underline-offset-2 hover:text-neutral-600"
        >
          {t("filters.clearAll")}
        </button>
        <button
          type="button"
          onClick={apply}
          className="rounded-full bg-ink text-white px-6 py-2.5 text-[13px] font-semibold hover:bg-neutral-800"
        >
          {t("filters.search")}
        </button>
      </div>
    </div>
  );
}
