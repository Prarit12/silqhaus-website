import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  Tag, 
  Waves, 
  Mountain, 
  Trees, 
  Sparkles, 
  Sun, 
  Building, 
  Users, 
  Users2, 
  Heart as PetIcon, 
  Filter,
  ChevronDown
} from 'lucide-react';

interface FilterBarProps {
  className?: string;
}

const filterOptions = [
  { id: 'for-you', label: 'For you', icon: Heart, isActive: true },
  { id: 'sweet-deals', label: 'Sweet deals', icon: Tag },
  { id: 'ocean', label: 'Ocean', icon: Waves },
  { id: 'mountain', label: 'Mountain', icon: Mountain },
  { id: 'lake', label: 'Lake', icon: Sparkles },
  { id: 'families', label: 'Families', icon: Users },
  { id: 'groups', label: 'Groups', icon: Users2 },
  { id: 'pet-friendly', label: 'Pet-friendly', icon: PetIcon },
  { id: 'filters', label: 'Filters', icon: Filter, isFilterButton: true }
];

export default function FilterBar({ className = '' }: FilterBarProps) {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(['for-you']));
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowFiltersDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterClick = (filterId: string, isFilterButton?: boolean) => {
    if (isFilterButton) {
      setShowFiltersDropdown(!showFiltersDropdown);
      return;
    }

    const newActiveFilters = new Set(activeFilters);
    if (newActiveFilters.has(filterId)) {
      newActiveFilters.delete(filterId);
    } else {
      newActiveFilters.add(filterId);
    }
    setActiveFilters(newActiveFilters);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="px-2 sm:px-4 py-6 flex items-center justify-center pt-[12px] pb-[12px]">
        <div className="relative w-full" ref={containerRef}>
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 lg:flex-nowrap lg:justify-center lg:gap-4">
          {filterOptions.map((filter) => {
            const IconComponent = filter.icon;
            const isActive = activeFilters.has(filter.id);
            const isFilterButton = filter.isFilterButton;
            
            return isFilterButton ? (
              <div key={filter.id} className="relative">
                <button
                  onClick={() => handleFilterClick(filter.id, isFilterButton)}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap shadow-md text-[11px] sm:text-[13px] flex-shrink-0 hover:shadow-lg hover:scale-105 hover:-translate-y-0.5 ${isActive ? 'bg-sand text-ink border border-sand' : 'bg-snow/10 text-snow border border-line hover:bg-sand/20'}`}
                  data-testid={`filter-${filter.id}`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-poppins font-medium">{filter.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFiltersDropdown ? 'rotate-180' : ''}`} />
                </button>
              </div>
            ) : (
              <button
                key={filter.id}
                onClick={() => handleFilterClick(filter.id, isFilterButton)}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap bg-snow/10 backdrop-blur-sm text-snow border border-line shadow-md text-[11px] sm:text-[13px] flex-shrink-0 hover:bg-snow/20 hover:shadow-lg hover:scale-105 hover:-translate-y-0.5"
                data-testid={`filter-${filter.id}`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="font-poppins font-medium">{filter.label}</span>
              </button>
            );
          })}
          </div>

          {/* Advanced Filters Dropdown - Positioned as overlay */}
          {showFiltersDropdown && (
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-full max-w-4xl p-4 backdrop-blur-sm rounded-lg border border-line z-50 shadow-2xl bg-ink-2/90">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Price Range */}
              <div>
                <label className="block text-mist text-sm font-medium mb-2 font-poppins">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full px-3 py-2 bg-ink/50 border border-line rounded text-snow placeholder-mist/70 text-sm focus:outline-none focus:border-gold/50"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full px-3 py-2 bg-ink/50 border border-line rounded text-snow placeholder-mist/70 text-sm focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-mist text-sm font-medium mb-2 font-poppins">Bedrooms</label>
                <select className="w-full px-3 py-2 bg-ink/50 border border-line rounded text-snow text-sm focus:outline-none focus:border-gold/50">
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-mist text-sm font-medium mb-2 font-poppins">Property Type</label>
                <select className="w-full px-3 py-2 bg-ink/50 border border-line rounded text-snow text-sm focus:outline-none focus:border-gold/50">
                  <option value="">All Types</option>
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condominium</option>
                  <option value="townhouse">Townhouse</option>
                </select>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-mist text-sm font-medium mb-2 font-poppins">Guests</label>
                <select className="w-full px-3 py-2 bg-ink/50 border border-line rounded text-snow text-sm focus:outline-none focus:border-gold/50">
                  <option value="">Any</option>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="6">6 Guests</option>
                  <option value="8">8+ Guests</option>
                </select>
              </div>
            </div>

            {/* Amenities */}
            <div className="mt-4">
              <label className="block text-mist text-sm font-medium mb-3 font-poppins">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  'Swimming Pool', 'Ocean View', 'Mountain View', 'Hot Tub',
                  'Fitness Center', 'Parking', 'Wine Cellar', 'Fireplace',
                  'Beachfront', 'Waterfront', 'Garden', 'Terrace'
                ].map((amenity) => (
                  <label key={amenity} className="flex items-center gap-2 text-mist text-sm cursor-pointer hover:text-snow">
                    <input
                      type="checkbox"
                      className="rounded border-line bg-ink/50 text-gold focus:ring-gold/20"
                    />
                    <span className="font-poppins">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Apply/Clear Buttons */}
            <div className="centered-button-group mt-4 pt-4 border-t border-line">
              <button
                onClick={() => setShowFiltersDropdown(false)}
                className="px-6 py-2 bg-gold text-ink rounded-full font-medium text-sm hover:bg-gold/90 transition-colors font-poppins"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  setActiveFilters(new Set(['for-you']));
                  setShowFiltersDropdown(false);
                }}
                className="px-6 py-2 border border-line text-snow rounded-full font-medium text-sm hover:bg-snow/10 transition-colors font-poppins"
              >
                Clear All
              </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}