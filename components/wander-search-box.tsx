import React, { useMemo, useRef, useState, useEffect } from "react";
import { Search, MapPin, Calendar, Users, Plus, Minus, X } from "lucide-react";

type Filters = {
  location?: string;
  checkIn?: string;   // YYYY-MM-DD
  checkOut?: string;  // YYYY-MM-DD
  guests: number;
};

const TH_LOCATIONS = [
  "Phuket",
  "Pattaya",
  "Koh Samui",
  "Krabi",
  "Bangkok",
  "Chiang Mai",
  "Hua Hin",
  "Khao Yai",
  "Phang Nga",
  "Koh Phi Phi",
];

const WanderSearchBox: React.FC<{
  onSearch?: (filters: Filters) => void;
  className?: string;
}> = ({ onSearch, className = "" }) => {
  const [openLoc, setOpenLoc] = useState(false);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
  });

  // Close location dropdown on outside click
  const locRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!locRef.current?.contains(e.target as Node)) setOpenLoc(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Filtered Thailand locations
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TH_LOCATIONS.filter((name) => name.toLowerCase().includes(q));
  }, [query]);

  const set = (patch: Partial<Filters>) =>
    setFilters((f) => ({ ...f, ...patch }));

  const today = new Date().toISOString().slice(0, 10);

  const handleSearch = () => {
    // Basic guard: if checkOut < checkIn, swap
    const { checkIn, checkOut } = filters;
    if (checkIn && checkOut && checkOut < checkIn) {
      set({ checkOut: checkIn });
    }
    onSearch?.(filters);
  };

  // Format date range for display
  const getDateRangeDisplay = () => {
    if (filters.checkIn && filters.checkOut) {
      const checkIn = new Date(filters.checkIn);
      const checkOut = new Date(filters.checkOut);
      const checkInFormatted = checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const checkOutFormatted = checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return `${checkInFormatted} - ${checkOutFormatted}`;
    }
    return "Add dates";
  };

  const getGuestDisplay = () => {
    return filters.guests === 1 ? "1 guest" : `${filters.guests} guests`;
  };

  return (
    <div
      className={`w-full max-w-4xl ${className}`}
      role="search"
      aria-label="Property search"
    >
      {/* Dark Search Container matching the image */}
      <div className="border border-gray-700 rounded-full shadow-lg px-3 py-3 flex items-center bg-[#000000]">
        {/* Location */}
        <div
          className="relative flex-1 min-w-[120px] px-4"
          ref={locRef}
        >
          <button
            className="w-full text-left flex items-center gap-3 hover:bg-gray-700/50 rounded-lg px-2 py-2 transition-colors"
            onClick={() => setOpenLoc((o) => !o)}
            aria-expanded={openLoc}
            aria-haspopup="listbox"
            data-testid="button-location"
          >
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-400 font-medium">Location</div>
              <div className="text-sm text-white truncate">
                {filters.location || "Wherever"}
              </div>
            </div>
          </button>

          {/* Location Dropdown */}
          {openLoc && (
            <div
              className="absolute left-0 top-[110%] z-20 w-[min(420px,92vw)] bg-white rounded-2xl shadow-xl border border-gray-200 p-3"
              role="listbox"
            >
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 border border-gray-200">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Phuket, Samui, Bangkok…"
                  className="bg-transparent flex-1 outline-none text-sm text-gray-800"
                  data-testid="input-location-search"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="rounded-full p-1 hover:bg-gray-200"
                    aria-label="Clear"
                    data-testid="button-clear-search"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>

              <div className="mt-2 max-h-64 overflow-auto space-y-1" role="listbox" aria-label="Location options">
                {(results.length ? results : TH_LOCATIONS).map((name) => (
                  <button
                    key={name}
                    onClick={() => {
                      set({ location: name });
                      setOpenLoc(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-100"
                    role="option"
                    aria-selected={filters.location === name}
                    data-testid={`button-location-${name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {name}, Thailand
                  </button>
                ))}
              </div>

              {/* Quick chips */}
              <div className="mt-3 flex flex-wrap gap-2">
                {["Phuket", "Koh Samui", "Bangkok", "Chiang Mai"].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      set({ location: n });
                      setOpenLoc(false);
                    }}
                    className="px-3 py-1.5 rounded-full text-sm border border-gray-300 text-gray-700 hover:bg-gray-100"
                    data-testid={`chip-location-${n.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-600 mx-2" />

        {/* Dates */}
        <div className="flex-1 min-w-[140px] px-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-400 font-medium">Dates</div>
              <div className="text-sm text-white" role="status" aria-live="polite">
                {getDateRangeDisplay()}
              </div>
              {/* Hidden date inputs for functionality */}
              <div className="hidden">
                <input
                  type="date"
                  min={today}
                  value={filters.checkIn}
                  onChange={(e) => set({ checkIn: e.target.value })}
                  aria-label="Check-in date"
                  data-testid="input-checkin"
                />
                <input
                  type="date"
                  min={filters.checkIn || today}
                  value={filters.checkOut}
                  onChange={(e) => set({ checkOut: e.target.value })}
                  aria-label="Check-out date"
                  data-testid="input-checkout"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-600 mx-2" />

        {/* Guests */}
        <div className="flex-1 min-w-[100px] px-4">
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-400 font-medium">Guests</div>
              <div className="text-sm text-white" role="status" aria-live="polite" aria-label={`Currently selected: ${getGuestDisplay()}`}>
                {getGuestDisplay()}
              </div>
            </div>
          </div>
          {/* Hidden guest controls */}
          <div className="hidden">
            <button
              onClick={() => set({ guests: Math.max(1, filters.guests - 1) })}
              aria-label="Decrease number of guests"
              disabled={filters.guests <= 1}
              data-testid="button-decrease-guests"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span data-testid="text-guest-count" aria-label={`${filters.guests} guests selected`}>{filters.guests}</span>
            <button
              onClick={() => set({ guests: filters.guests + 1 })}
              aria-label="Increase number of guests"
              data-testid="button-increase-guests"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="ml-auto bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
          data-testid="button-search"
          aria-label="Search properties"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
      {/* Mobile date picker (appears below on small screens) */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2">
          <Calendar className="w-4 h-4 text-gray-400" aria-hidden="true" />
          <input
            type="date"
            min={today}
            value={filters.checkIn}
            onChange={(e) => set({ checkIn: e.target.value })}
            className="bg-transparent outline-none text-sm text-white flex-1 focus:ring-2 focus:ring-blue-400 rounded"
            aria-label="Check-in date"
            data-testid="input-checkin-mobile"
          />
        </div>
        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2">
          <Calendar className="w-4 h-4 text-gray-400" aria-hidden="true" />
          <input
            type="date"
            min={filters.checkIn || today}
            value={filters.checkOut}
            onChange={(e) => set({ checkOut: e.target.value })}
            className="bg-transparent outline-none text-sm text-white flex-1 focus:ring-2 focus:ring-blue-400 rounded"
            aria-label="Check-out date"
            data-testid="input-checkout-mobile"
          />
        </div>
      </div>
      {/* Mobile guest picker */}
      <div className="mt-2 sm:hidden">
        <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 flex items-center justify-between" role="group" aria-labelledby="guest-selector-label">
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-gray-400" aria-hidden="true" />
            <span id="guest-selector-label" className="text-sm text-white">Guests</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => set({ guests: Math.max(1, filters.guests - 1) })}
              className="p-1 rounded-full border border-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Decrease number of guests"
              disabled={filters.guests <= 1}
              data-testid="button-decrease-guests-mobile"
            >
              <Minus className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
            </button>
            <span className="min-w-[1.5rem] text-center text-white text-sm" aria-label={`${filters.guests} guests selected`} data-testid="text-guest-count-mobile">
              {filters.guests}
            </span>
            <button
              onClick={() => set({ guests: filters.guests + 1 })}
              className="p-1 rounded-full border border-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Increase number of guests"
              data-testid="button-increase-guests-mobile"
            >
              <Plus className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WanderSearchBox;