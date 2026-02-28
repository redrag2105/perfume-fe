import { useRef, useEffect, useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  searchedTerm: string; // The actually performed search
  brandFilter: string;
  availableBrands: string[];
  onBrandSelect: (brand: string) => void;
  onSearch: (e?: React.FormEvent) => void;
  onClearFilters: () => void;
  resultsCount: number;
}

export default function SearchFilter({
  searchTerm,
  setSearchTerm,
  searchedTerm,
  brandFilter,
  availableBrands,
  onBrandSelect,
  onSearch,
  onClearFilters,
  resultsCount,
}: SearchFilterProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBrandSelect = (brand: string) => {
    setDropdownOpen(false);
    onBrandSelect(brand);
  };

  const hasActiveFilters = searchedTerm || brandFilter;

  return (
    <div className="max-w-4xl mx-auto px-6 mb-12 md:mb-16">
      <form
        onSubmit={onSearch}
        className="flex flex-col md:flex-row gap-6 md:gap-8 justify-between items-stretch md:items-end border-b border-gray-200 pb-4"
      >
        {/* Search Input */}
        <div className="relative w-full md:w-1/2">
          <button
            type="submit"
            className="absolute left-0 bottom-2.5 text-gray-400 hover:text-black transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search size={16} strokeWidth={1.5} />
          </button>
          <input
            type="text"
            placeholder="Search fragrances..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-7 pb-2 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 placeholder:text-gray-400 tracking-wide"
          />
        </div>

        {/* Custom Filter Dropdown & Clear */}
        <div className="w-full md:w-auto flex items-end gap-4">
          <div className="relative flex-1 md:w-48" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between md:justify-end gap-2 pb-2 text-sm text-gray-600 hover:text-black transition-colors cursor-pointer tracking-wide"
            >
              <span>{brandFilter || 'All Maisons'}</span>
              <ChevronDown
                size={14}
                strokeWidth={1.5}
                className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu */}
            <div
              className={`absolute right-0 top-full mt-2 w-full md:w-56 bg-white border border-gray-100 shadow-lg z-20 transition-all duration-200 origin-top ${
                dropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
              }`}
            >
              <div className="py-1 max-h-64 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => handleBrandSelect('')}
                  className={`w-full text-left px-4 py-2.5 text-sm tracking-wide transition-colors cursor-pointer ${
                    !brandFilter ? 'text-black bg-gray-50' : 'text-gray-600 hover:text-black hover:bg-gray-50'
                  }`}
                >
                  All Maisons
                </button>
                {availableBrands.map((brand, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleBrandSelect(brand)}
                    className={`w-full text-left px-4 py-2.5 text-sm tracking-wide transition-colors cursor-pointer ${
                      brandFilter === brand ? 'text-black bg-gray-50' : 'text-gray-600 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="pb-2 text-gray-400 hover:text-black transition-colors cursor-pointer"
              title="Clear filters"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          )}
        </div>

        <button type="submit" className="hidden">
          Search
        </button>
      </form>

      {/* Active filter indicator */}
      {hasActiveFilters && (
        <div className="mt-4 text-xs tracking-wide text-gray-500">
          Showing {resultsCount} result{resultsCount !== 1 ? 's' : ''}
          {searchedTerm && <span> for "{searchedTerm}"</span>}
          {brandFilter && <span> from {brandFilter}</span>}
        </div>
      )}
    </div>
  );
}
