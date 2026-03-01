import { useEffect, useState, useCallback } from 'react';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { useInView } from 'react-intersection-observer';
import { perfumesApi, brandsApi } from '@/api';
import type { PerfumeListItem, PaginationInfo } from '@/types';
import ProductCard from '@/components/ProductCard';
import SearchFilter from '@/components/SearchFilter';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  // On-visit animations
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [gridRef, gridInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const [perfumes, setPerfumes] = useState<PerfumeListItem[]>([]);
  
  // URL state with nuqs
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [searchQuery, setSearchQuery] = useQueryState('q', parseAsString.withDefault(''));
  const [brandQuery, setBrandQuery] = useQueryState('brand', parseAsString.withDefault(''));
  
  // Local UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 12,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch perfumes with pagination
  const fetchPerfumes = useCallback(async (pageNum = 1, search = '', brand = '') => {
    try {
      setIsLoading(true);
      const data = await perfumesApi.getAll({
        page: pageNum,
        limit: 12,
        search: search || undefined,
        brandName: brand || undefined,
      });
      setPerfumes(data.perfumes);
      setPagination(data.pagination);
      
      // Extract brands from the response for filtering
      if (pageNum === 1 && !search && !brand) {
        const brandsData = await brandsApi.getAll();
        const brands = brandsData.map(b => b.brandName);
        setAvailableBrands(brands);
      }
    } catch (error) {
      console.error("Error fetching perfumes", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on URL state changes
  useEffect(() => {
    fetchPerfumes(page, searchQuery || '', brandQuery || '');
    setSearchTerm(searchQuery || '');
  }, [page, searchQuery, brandQuery, fetchPerfumes]);

  // Handle Search
  const handleSearch = async (e?: React.FormEvent, selectedBrand: string = brandQuery || '') => {
    if (e) e.preventDefault();
    setSearchQuery(searchTerm || null);
    setBrandQuery(selectedBrand || null);
    setPage(1);
  };

  const handleBrandSelect = (brand: string) => {
    setBrandQuery(brand || null);
    setSearchQuery(searchTerm || null);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage === pagination.currentPage) return;
    setPage(newPage);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSearchQuery(null);
    setBrandQuery(null);
    setPage(1);
  };

  const hasActiveFilters = searchTerm || brandQuery;

  return (
    <div className="min-h-screen bg-white pb-24">
      
      {/* Editorial Header */}
      <div ref={headerRef} className="py-12 md:py-16 text-center space-y-3">
        <h1 className={`text-4xl md:text-5xl font-serif tracking-tight text-primary ${headerInView ? 'animate-slide-up' : 'opacity-0'}`}>The Collection</h1>
        <p className={`text-xs md:text-sm text-muted-foreground tracking-[0.2em] uppercase ${headerInView ? 'animate-fade-in animate-delay-200' : 'opacity-0'}`}>Discover your signature scent</p>
      </div>

      {/* Search & Filter */}
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchedTerm={searchQuery || ''}
        brandFilter={brandQuery || ''}
        availableBrands={availableBrands}
        onBrandSelect={handleBrandSelect}
        onSearch={handleSearch}
        onClearFilters={clearFilters}
        resultsCount={pagination.totalCount}
      />

      {/* Grid */}
      <div className="container mx-auto px-6">
        {isLoading ? (
          // Loading skeleton grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-12 md:gap-y-16">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-3/4 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : perfumes.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <p className="text-gray-400 font-serif text-xl tracking-wide">No fragrances found</p>
            {hasActiveFilters && (
              <button 
                onClick={clearFilters}
                className="text-xs tracking-widest uppercase text-gray-500 hover:text-black underline underline-offset-4 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div ref={gridRef} className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-12 md:gap-y-16 ${gridInView ? 'animate-fade-in animate-delay-100' : 'opacity-0'}`}>
              {perfumes.map((perfume, index) => (
                <ProductCard key={perfume._id} perfume={perfume} index={index} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-16 flex flex-col items-center gap-6">
                {/* Page info */}
                <p className="text-xs text-gray-400 tracking-widest uppercase">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </p>

                {/* Pagination buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="flex items-center gap-2 px-4 py-3 border border-gray-200 text-xs tracking-widest uppercase text-gray-600 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-200 transition-all cursor-pointer"
                  >
                    <ChevronLeft size={14} strokeWidth={1.5} />
                    Previous
                  </button>

                  {/* Page numbers */}
                  <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(page => {
                        // Show first, last, current, and adjacent pages
                        const current = pagination.currentPage;
                        return page === 1 || 
                               page === pagination.totalPages || 
                               Math.abs(page - current) <= 1;
                      })
                      .map((page, idx, arr) => (
                        <div key={page} className="flex items-center">
                          {/* Add ellipsis if there's a gap */}
                          {idx > 0 && arr[idx - 1] !== page - 1 && (
                            <span className="px-2 text-gray-300">...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={cn(
                              "w-10 h-10 text-xs transition-all cursor-pointer",
                              page === pagination.currentPage
                                ? "bg-gray-900 text-white"
                                : "text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-gray-400"
                            )}
                          >
                            {page}
                          </button>
                        </div>
                      ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="flex items-center gap-2 px-4 py-3 border border-gray-200 text-xs tracking-widest uppercase text-gray-600 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-200 transition-all cursor-pointer"
                  >
                    Next
                    <ChevronRight size={14} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Results count */}
                <p className="text-[10px] text-gray-300 tracking-wide">
                  Showing {((pagination.currentPage - 1) * pagination.limit) + 1}–
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount} fragrances
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}