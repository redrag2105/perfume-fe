import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import SearchFilter from '../components/SearchFilter';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface Perfume {
  _id: string;
  perfumeName: string;
  uri: string;
  targetAudience: string;
  brandName: string;
  concentration?: string;
  price?: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function Home() {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedTerm, setSearchedTerm] = useState(''); // Tracks actually performed search
  const [brandFilter, setBrandFilter] = useState('');
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
  const fetchPerfumes = async (page = 1, search = '', brand = '') => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', '12');
      if (search) params.append('search', search);
      if (brand) params.append('brandName', brand);

      const res = await api.get(`/perfumes?${params.toString()}`);
      setPerfumes(res.data.perfumes);
      setPagination(res.data.pagination);
      
      // Extract brands from the response for filtering
      if (page === 1 && !search && !brand) {
        // Fetch all to get brands (or we could create a separate endpoint)
        const allBrandsRes = await api.get('/brands');
        const brands = allBrandsRes.data.map((b: { brandName: string }) => b.brandName);
        setAvailableBrands(brands);
      }
    } catch (error) {
      console.error("Error fetching perfumes", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPerfumes();
  }, []);

  // Handle Search
  const handleSearch = async (e?: React.FormEvent, selectedBrand: string = brandFilter) => {
    if (e) e.preventDefault();
    await fetchPerfumes(1, searchTerm, selectedBrand);
    setSearchedTerm(searchTerm);
  };

  const handleBrandSelect = (brand: string) => {
    setBrandFilter(brand);
    handleSearch(undefined, brand);
  };

  const handlePageChange = (page: number) => {
    if (page === pagination.currentPage) return;
    fetchPerfumes(page, searchedTerm, brandFilter);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const clearFilters = async () => {
    setSearchTerm('');
    setSearchedTerm('');
    setBrandFilter('');
    await fetchPerfumes(1, '', '');
  };

  const hasActiveFilters = searchTerm || brandFilter;

  return (
    <div className="min-h-screen bg-white pb-24">
      
      {/* Editorial Header */}
      <div className="py-12 md:py-16 text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-primary">The Collection</h1>
        <p className="text-xs md:text-sm text-muted-foreground tracking-[0.2em] uppercase">Discover your signature scent</p>
      </div>

      {/* Search & Filter */}
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchedTerm={searchedTerm}
        brandFilter={brandFilter}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-12 md:gap-y-16">
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