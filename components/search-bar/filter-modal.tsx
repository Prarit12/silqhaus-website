"use client";
import { Users, Bed, SlidersHorizontal, Minus, Plus } from "lucide-react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests: number;
  onGuestsChange: (val: number) => void;
  minBedrooms: number;
  maxBedrooms: number;
  onMinBedroomsChange: (val: number) => void;
  priceRange: [number, number];
  onPriceRangeChange: (val: [number, number]) => void;
  priceFilterActive: boolean;
  onPriceFilterActiveChange: (val: boolean) => void;
  onClearAll: () => void;
  t: any;
}

export default function FilterModal({
  isOpen,
  onClose,
  guests,
  onGuestsChange,
  minBedrooms,
  maxBedrooms,
  onMinBedroomsChange,
  priceRange,
  onPriceRangeChange,
  priceFilterActive,
  onPriceFilterActiveChange,
  onClearAll,
  t,
}: FilterModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-[90%] max-w-md md:max-w-3xl bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 z-50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-semibold font-poppins text-gray-900">
            {t("filters.filter")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="space-y-6 md:space-y-0 md:flex md:gap-8">
          <div className="md:flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-[#ffffff]" />
              <span className="text-sm font-poppins font-medium text-gray-800">
                {t("filters.minGuestCapacityLabel")}
              </span>
              <span className="text-xs text-gray-500">
                {t("filters.agesAbove")}
              </span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <button
                onClick={() => onGuestsChange(Math.max(1, guests - 1))}
                className="w-9 h-9 rounded-full border border-gray-300 text-gray-700 hover:border-[#ffffff] hover:bg-[#ffffff]/10 transition-colors flex items-center justify-center touch-manipulation"
                disabled={guests <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-poppins text-gray-800 font-medium text-lg">
                {guests}
              </span>
              <button
                onClick={() => onGuestsChange(Math.min(16, guests + 1))}
                className="w-9 h-9 rounded-full border border-gray-300 text-gray-700 hover:border-[#ffffff] hover:bg-[#ffffff]/10 transition-colors flex items-center justify-center touch-manipulation"
                disabled={guests >= 16}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100 md:hidden" />
          <div className="hidden md:block w-px bg-gray-200 self-stretch" />

          <div className="md:flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Bed className="w-4 h-4 text-[#ffffff]" />
              <span className="text-sm font-poppins font-medium text-gray-800">
                {t("filters.minBedrooms")}
              </span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <button
                onClick={() =>
                  onMinBedroomsChange(Math.max(1, minBedrooms - 1))
                }
                disabled={minBedrooms <= 1}
                className="w-9 h-9 rounded-full border border-gray-300 text-gray-700 hover:border-[#ffffff] hover:bg-[#ffffff]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center touch-manipulation"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-gray-900 font-poppins text-lg font-semibold min-w-[40px] text-center">
                {minBedrooms}+
              </span>
              <button
                onClick={() =>
                  onMinBedroomsChange(Math.min(maxBedrooms, minBedrooms + 1))
                }
                disabled={minBedrooms >= maxBedrooms}
                className="w-9 h-9 rounded-full border border-gray-300 text-gray-700 hover:border-[#ffffff] hover:bg-[#ffffff]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center touch-manipulation"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100 md:hidden" />
          <div className="hidden md:block w-px bg-gray-200 self-stretch" />

          <div className="md:flex-1">
            <div className="flex items-center gap-2 mb-3">
              <SlidersHorizontal className="w-4 h-4 text-[#ffffff]" />
              <span className="text-sm font-poppins font-medium text-gray-800">
                {t("filters.priceRange")}
              </span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-900 font-poppins text-sm font-semibold">
                ฿{priceRange[0].toLocaleString()}
              </span>
              <span className="text-gray-400 font-poppins text-xs">—</span>
              <span className="text-gray-900 font-poppins text-sm font-semibold">
                ฿{priceRange[1].toLocaleString()}
              </span>
            </div>
            <div className="relative h-10 flex items-center">
              <div className="absolute w-full h-1.5 bg-gray-200 rounded-full" />
              <div
                className="absolute h-1.5 bg-[#ffffff] rounded-full"
                style={{
                  left: `${(priceRange[0] / 100000) * 100}%`,
                  right: `${100 - (priceRange[1] / 100000) * 100}%`,
                }}
              />
              <input
                type="range"
                min={0}
                max={100000}
                step={500}
                value={priceRange[0]}
                onChange={(e) => {
                  const val = Math.min(
                    Number(e.target.value),
                    priceRange[1] - 500,
                  );
                  onPriceRangeChange([val, priceRange[1]]);
                  onPriceFilterActiveChange(true);
                }}
                className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ffffff] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#ffffff] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer z-10"
              />
              <input
                type="range"
                min={0}
                max={100000}
                step={500}
                value={priceRange[1]}
                onChange={(e) => {
                  const val = Math.max(
                    Number(e.target.value),
                    priceRange[0] + 500,
                  );
                  onPriceRangeChange([priceRange[0], val]);
                  onPriceFilterActiveChange(true);
                }}
                className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ffffff] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#ffffff] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer z-20"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={onClearAll}
            className="text-[#ffffff] font-poppins text-sm hover:underline"
          >
            {t("filters.clearFilters")}
          </button>
          <button
            onClick={onClose}
            className="bg-[#ffffff] text-white font-poppins text-sm font-medium px-6 py-2 rounded-full hover:bg-[#6b5720] transition-colors"
          >
            {t("filters.close")}
          </button>
        </div>
      </div>
    </>
  );
}
