import { useRef, useEffect, useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  searchedTerm: string;
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
    <div className="max-w-6xl mx-auto px-6 mb-16">
      <form
        onSubmit={onSearch}
        className="flex flex-col md:flex-row gap-6 md:gap-12 justify-between items-stretch md:items-center"
      >
        {/* Search Input - Editorial Style */}
        <div className="relative flex-1 max-w-xl">
          <div className="flex items-center border-b-2 border-black group focus-within:border-neutral-400 transition-colors">
            <input
              type="text"
              placeholder="Search collection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 placeholder:text-neutral-400 text-black tracking-[0.05em] uppercase"
            />
            <button
              type="submit"
              className="p-2 text-black hover:opacity-50 transition-opacity cursor-pointer"
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Filter Dropdown & Clear */}
        <div className="flex items-center gap-6">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 py-3 px-5 text-xs uppercase tracking-[0.15em] border border-black text-black hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
            >
              <span>{brandFilter || 'All Brands'}</span>
              <ChevronDown
                size={14}
                strokeWidth={2}
                className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu - Editorial */}
            <div
              className={`absolute right-0 top-full mt-1 w-56 bg-[#FAFAFA] border border-neutral-300 z-100 shadow-xl transition-all duration-200 origin-top ${
                dropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
              }`}
            >
              <div className="max-h-64 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => handleBrandSelect('')}
                  className={`w-full text-left px-5 py-3 text-xs uppercase tracking-widest transition-colors cursor-pointer ${
                    !brandFilter 
                      ? 'bg-neutral-200 text-black font-medium' 
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                  }`}
                >
                  All Brands
                </button>
                {availableBrands.map((brand, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleBrandSelect(brand)}
                    className={`w-full text-left px-5 py-3 text-xs uppercase tracking-widest transition-colors cursor-pointer border-t border-neutral-200 ${
                      brandFilter === brand 
                        ? 'bg-neutral-200 text-black font-medium' 
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
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
              className="p-2 text-black hover:opacity-50 transition-opacity cursor-pointer"
              title="Clear filters"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          )}
        </div>

        <button type="submit" className="hidden">Search</button>
      </form>

      {/* Results indicator */}
      {hasActiveFilters && (
        <div className="mt-6 text-xs tracking-widest uppercase text-neutral-500">
          {resultsCount} result{resultsCount !== 1 ? 's' : ''}
          {searchedTerm && <span className="text-black"> for "{searchedTerm}"</span>}
          {brandFilter && <span className="text-black"> in {brandFilter}</span>}
        </div>
      )}
    </div>
  );
}
