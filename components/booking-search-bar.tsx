"use client";
import React, { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import LocationDropdown from "@/components/search-bar/location-dropdown";
import DatePickerCalendar from "@/components/search-bar/date-picker-calendar";
import FilterModal from "@/components/search-bar/filter-modal";

interface SearchFilters {
  location: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  pets: number;
}

interface BookingSearchBarProps {
  onSearch?: (filters: {
    location: string;
    checkIn: Date | null;
    checkOut: Date | null;
    guests: number;
  }) => void;
  onClearAll?: () => void;
  minBedrooms?: number;
  maxBedrooms?: number;
  onMinBedroomsChange?: (val: number) => void;
  showAvailableOnly?: boolean;
  onShowAvailableOnlyChange?: (val: boolean) => void;
  priceRange?: [number, number];
  onPriceRangeChange?: (val: [number, number]) => void;
  priceFilterActive?: boolean;
  onPriceFilterActiveChange?: (val: boolean) => void;
  onGuestsChange?: (val: number) => void;
  initialLocation?: string;
  initialCheckIn?: Date | null;
  initialCheckOut?: Date | null;
  initialGuests?: number;
}

export default function BookingSearchBar({
  onSearch,
  onClearAll,
  minBedrooms = 1,
  maxBedrooms = 10,
  onMinBedroomsChange,
  showAvailableOnly = false,
  onShowAvailableOnlyChange,
  priceRange = [0, 100000],
  onPriceRangeChange,
  priceFilterActive = false,
  onGuestsChange,
  onPriceFilterActiveChange,
  initialLocation,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
}: BookingSearchBarProps) {
  const t = useTranslations("ourProperty");
  const [filters, setFilters] = useState<SearchFilters>({
    location: initialLocation || "",
    checkIn: initialCheckIn ?? null,
    checkOut: initialCheckOut ?? null,
    guests: initialGuests ?? 2,
    pets: 0,
  });

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateClick = (date: Date) => {
    if (!filters.checkIn || (filters.checkIn && filters.checkOut)) {
      setFilters((prev) => ({ ...prev, checkIn: date, checkOut: null }));
      setSelectingCheckOut(true);
    } else if (filters.checkIn && !filters.checkOut) {
      if (date >= filters.checkIn) {
        setFilters((prev) => ({ ...prev, checkOut: date }));
        setSelectingCheckOut(false);
      } else {
        setFilters((prev) => ({ ...prev, checkIn: date, checkOut: null }));
      }
    }
  };

  const handleSearch = () => {
    setActiveDropdown(null);
    if (onSearch) {
      onSearch({
        location: filters.location,
        checkIn: filters.checkIn,
        checkOut: filters.checkOut,
        guests: filters.guests,
      });
    }
  };

  const handleClearAll = () => {
    setFilters({
      location: "",
      checkIn: null,
      checkOut: null,
      guests: 2,
      pets: 0,
    });
    setActiveDropdown(null);
    setSelectingCheckOut(false);
    if (onSearch) {
      onSearch({ location: "", checkIn: null, checkOut: null, guests: 2 });
    }
    if (onClearAll) {
      onClearAll();
    }
  };

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const bedroomsActive = minBedrooms > 1;
  const filtersActive =
    filters.guests > 2 ||
    filters.pets > 0 ||
    bedroomsActive ||
    priceFilterActive;

  return (
    <div
      className="w-full max-w-[1600px] mx-auto relative z-40 px-4 sm:px-6 md:px-8"
      ref={containerRef}
    >
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0 text-snow rounded-2xl md:rounded-full px-4 sm:px-6 py-4 md:py-3 shadow-lg backdrop-blur-sm bg-[#1a1a1a]/80 border border-mist/10 mx-2 sm:mx-4">
        <LocationDropdown
          location={filters.location}
          isOpen={activeDropdown === "location"}
          onToggle={() => toggleDropdown("location")}
          onSelect={(location) => {
            setFilters((prev) => ({ ...prev, location }));
            setActiveDropdown(null);
          }}
          t={t}
        />

        <div className="hidden md:block w-px h-8 bg-mist/15 mx-0.5" />

        <DatePickerCalendar
          checkIn={filters.checkIn}
          checkOut={filters.checkOut}
          isOpen={activeDropdown === "dates"}
          selectingCheckOut={selectingCheckOut}
          currentMonth={currentMonth}
          onToggle={(isCheckOut) => {
            setSelectingCheckOut(!!isCheckOut);
            toggleDropdown("dates");
          }}
          onDateClick={handleDateClick}
          onMonthChange={setCurrentMonth}
          onClose={() => setActiveDropdown(null)}
          t={t}
        />

        <div className="hidden md:block w-px h-8 bg-mist/15 mx-0.5" />

        <div className="flex-1 min-w-0">
          <button
            onClick={() => onShowAvailableOnlyChange?.(!showAvailableOnly)}
            className={`flex items-center gap-2 cursor-pointer rounded-full px-3 py-3 md:py-2 transition-all duration-300 ease-out text-left min-h-[48px] touch-manipulation ${
              showAvailableOnly ? "bg-[#ffffff]/20" : "hover:bg-snow/10"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                showAvailableOnly
                  ? "bg-[#ffffff] border-[#ffffff]"
                  : "border-mist/50"
              }`}
            >
              {showAvailableOnly && (
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              )}
            </div>
            <span className="text-[12px] font-poppins text-snow whitespace-nowrap">
              {t("filters.availableOnly")}
            </span>
          </button>
        </div>

        <div className="flex-shrink-0 md:ml-2">
          <button
            onClick={handleSearch}
            className="btn-primary btn-silqhaus-glow w-full md:w-auto flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-full touch-manipulation hover:scale-105 transition-transform duration-200"
          >
            <Search className="w-4 h-4" />
            <span className="font-poppins font-medium text-[12px]">
              {t("filters.search")}
            </span>
          </button>
        </div>

        <div className="flex-shrink-0 md:ml-1">
          <button
            onClick={() => toggleDropdown("filterModal")}
            className={`w-full md:w-auto flex items-center justify-center gap-2 text-[12px] font-poppins font-medium transition-all duration-200 px-4 py-2 rounded-full min-h-[44px] touch-manipulation whitespace-nowrap ${
              activeDropdown === "filterModal" || filtersActive
                ? "text-[#ffffff] border border-[#ffffff] bg-[#ffffff]/10"
                : "text-mist hover:text-[#ffffff] border border-mist/20 hover:border-[#ffffff]"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{t("filters.filter")}</span>
          </button>
        </div>
      </div>

      <FilterModal
        isOpen={activeDropdown === "filterModal"}
        onClose={() => setActiveDropdown(null)}
        guests={filters.guests}
        onGuestsChange={(val) => {
          setFilters((prev) => ({ ...prev, guests: val }));
          onGuestsChange?.(val);
        }}
        minBedrooms={minBedrooms}
        maxBedrooms={maxBedrooms}
        onMinBedroomsChange={(val) => onMinBedroomsChange?.(val)}
        priceRange={priceRange}
        onPriceRangeChange={(val) => onPriceRangeChange?.(val)}
        priceFilterActive={priceFilterActive}
        onPriceFilterActiveChange={(val) => onPriceFilterActiveChange?.(val)}
        onClearAll={handleClearAll}
        t={t}
      />
    </div>
  );
}
