"use client";
import { MapPin, ChevronDown } from "lucide-react";

const THAILAND_PROVINCES = [
  { name: "Phuket", icon: "🏝️" },
  { name: "Krabi", icon: "🏞️" },
  { name: "Samui", icon: "🌴" },
  { name: "Chiang Mai", icon: "⛰️" },
  { name: "Pattaya", icon: "🏖️" },
  { name: "Hua Hin", icon: "🌊" },
  { name: "Bangkok", icon: "🏙️" },
  { name: "Koh Phangan", icon: "🌙" },
  { name: "Koh Tao", icon: "🐠" },
  { name: "Rayong", icon: "🌅" },
];

interface LocationDropdownProps {
  location: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (location: string) => void;
  t: any;
}

export default function LocationDropdown({
  location,
  isOpen,
  onToggle,
  onSelect,
  t,
}: LocationDropdownProps) {
  return (
    <div className="relative flex-1 min-w-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 cursor-pointer hover:bg-snow/10 rounded-full px-3 py-3 md:py-2 transition-all duration-300 ease-out text-left min-h-[48px] touch-manipulation"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <MapPin className="w-4 h-4 text-[#ffffff] flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-sulphur-point font-bold text-mist/70 uppercase tracking-wider">
            {t("filters.where")}
          </div>
          <div className="text-[13px] font-poppins text-snow truncate">
            {location || t("filters.wherever")}
          </div>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-mist/50 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 w-full max-w-sm bg-white rounded-xl p-4 shadow-2xl border border-gray-100 z-50">
          <div className="text-sm font-medium text-gray-700 mb-3">
            {t("filters.chooseDestination")}
          </div>
          <div className="max-h-60 overflow-y-auto scrollbar-hide">
            <button
              onClick={() => onSelect("")}
              className="w-full flex items-center gap-3 p-2.5 hover:bg-[#ffffff]/10 rounded-lg transition-colors text-left"
            >
              <span className="font-poppins text-gray-800">
                {t("filters.wherever")}
              </span>
            </button>
            {THAILAND_PROVINCES.map((province) => (
              <button
                key={province.name}
                onClick={() => onSelect(province.name)}
                className="w-full flex items-center gap-3 p-2.5 hover:bg-[#ffffff]/10 rounded-lg transition-colors text-left"
              >
                <span className="font-poppins text-gray-800">
                  {province.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
