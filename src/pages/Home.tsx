import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { perfumesApi, brandsApi } from '@/api';
import type { PerfumeListItem, PaginationInfo } from '@/types';
import ProductCard from '@/components/ProductCard';
import SearchFilter from '@/components/SearchFilter';
import { ChevronLeft, ChevronRight, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [perfumes, setPerfumes] = useState<PerfumeListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedTerm, setSearchedTerm] = useState('');
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

  // Animation refs
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [collectionRef, collectionInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const fetchPerfumes = async (page = 1, search = '', brand = '') => {
    try {
      setIsLoading(true);
      const data = await perfumesApi.getAll({
        page,
        limit: 12,
        search: search || undefined,
        brandName: brand || undefined,
      });
      setPerfumes(data.perfumes);
      setPagination(data.pagination);
      
      if (page === 1 && !search && !brand) {
        const brandsData = await brandsApi.getAll();
        const brands = brandsData.map(b => b.brandName);
        setAvailableBrands(brands);
      }
    } catch (error) {
      console.error("Error fetching perfumes", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfumes();
  }, []);

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
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearFilters = async () => {
    setSearchTerm('');
    setSearchedTerm('');
    setBrandFilter('');
    await fetchPerfumes(1, '', '');
  };

  const hasActiveFilters = searchTerm || brandFilter;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      
      {/* EDITORIAL HERO - Full Width */}
      <section ref={heroRef} className="relative h-[85vh] flex items-end bg-black overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 bg-linear-to-br from-neutral-900 via-neutral-800 to-black">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjAzIi8+PC9nPjwvc3ZnPg==')] opacity-50" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 w-full pb-16 md:pb-24 px-8 md:px-16">
          <div className="max-w-6xl">
            <p className={`editorial-subhead text-white/50 mb-4 md:mb-6 ${heroInView ? 'animate-fade-in' : 'opacity-0'}`}>
              Curated Collection
            </p>
            <h1 className={`editorial-headline text-white mb-6 md:mb-8 ${heroInView ? 'animate-slide-up animate-delay-100' : 'opacity-0'}`}>
              Find Your<br />
              <span className="italic font-light">Signature</span>
            </h1>
            <p className={`text-white/60 text-sm md:text-base max-w-md leading-relaxed mb-8 ${heroInView ? 'animate-slide-up animate-delay-200' : 'opacity-0'}`}>
              An expertly curated selection of the world's most distinguished fragrances, 
              each chosen for its exceptional character and artistry.
            </p>
            
            {/* Scroll Indicator */}
            <button 
              onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
              className={`flex items-center gap-3 text-white/40 hover:text-white/80 transition-colors group cursor-pointer ${heroInView ? 'animate-slide-up animate-delay-300' : 'opacity-0'}`}
            >
              <span className="text-[10px] tracking-[0.3em] uppercase">Explore</span>
              <ArrowDown size={14} className="animate-bounce" />
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 right-8 md:right-16 text-white/5 font-serif text-[20vw] leading-none pointer-events-none select-none">
          P
        </div>
      </section>

      {/* COLLECTION SECTION */}
      <section ref={collectionRef} id="collection" className="py-16 md:py-24 px-8 md:px-16">
        
        {/* Section Header */}
        <div className={`max-w-7xl mx-auto mb-12 md:mb-16 ${collectionInView ? 'animate-slide-up' : 'opacity-0'}`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="editorial-subhead text-neutral-400 mb-2">Browse</p>
              <h2 className="text-4xl md:text-5xl font-serif">The Collection</h2>
            </div>
            
            {/* Results Count */}
            {!isLoading && (
              <p className="text-sm text-neutral-500">
                {pagination.totalCount} {pagination.totalCount === 1 ? 'fragrance' : 'fragrances'}
              </p>
            )}
          </div>
        </div>

        {/* Search & Filter - Minimal Design */}
        <div className={`max-w-7xl mx-auto mb-12 relative z-50 ${collectionInView ? 'animate-slide-up animate-delay-100' : 'opacity-0'}`}>
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
        </div>

        {/* MASONRY GRID */}
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="masonry-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="masonry-item">
                  <Skeleton className={cn("w-full", i % 3 === 0 ? "h-112.5" : i % 2 === 0 ? "h-87.5" : "h-100")} />
                </div>
              ))}
            </div>
          ) : perfumes.length === 0 ? (
            <div className="text-center py-24 space-y-6 bg-white">
              <p className="text-neutral-400 font-serif text-2xl italic">No fragrances found</p>
              <p className="text-sm text-neutral-500">Try adjusting your search or filters</p>
              {hasActiveFilters && (
                <button 
                  onClick={clearFilters}
                  className="text-xs tracking-[0.2em] uppercase text-black hover:opacity-60 underline underline-offset-4 transition-opacity cursor-pointer"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="masonry-grid">
                {perfumes.map((perfume, index) => (
                  <ProductCard key={perfume._id} perfume={perfume} index={index} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-20 flex flex-col items-center gap-8 pt-12 border-t border-neutral-200">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="w-12 h-12 flex items-center justify-center border border-black text-black hover:bg-black hover:text-white disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-black transition-all duration-300 cursor-pointer"
                    >
                      <ChevronLeft size={18} strokeWidth={1.5} />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          const current = pagination.currentPage;
                          return page === 1 || 
                                 page === pagination.totalPages || 
                                 Math.abs(page - current) <= 1;
                        })
                        .map((page, idx, arr) => (
                          <div key={page} className="flex items-center">
                            {idx > 0 && arr[idx - 1] !== page - 1 && (
                              <span className="px-2 text-neutral-300">···</span>
                            )}
                            <button
                              onClick={() => handlePageChange(page)}
                              className={cn(
                                "w-12 h-12 text-sm transition-all duration-300 cursor-pointer",
                                page === pagination.currentPage
                                  ? "bg-black text-white"
                                  : "text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
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
                      className="w-12 h-12 flex items-center justify-center border border-black text-black hover:bg-black hover:text-white disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-black transition-all duration-300 cursor-pointer"
                    >
                      <ChevronRight size={18} strokeWidth={1.5} />
                    </button>
                  </div>

                  <p className="text-xs text-neutral-400 tracking-wide">
                    Showing {((pagination.currentPage - 1) * pagination.limit) + 1}–
                    {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* EDITORIAL FOOTER CTA */}
      <section className="bg-black text-white py-20 md:py-32 px-8 md:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="editorial-subhead text-white/50 mb-4">About</p>
          <h2 className="text-3xl md:text-5xl font-serif mb-6">Maison Pétale</h2>
          <p className="text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
            A curated destination for those who understand that fragrance is not merely 
            a scent, but an expression of identity and artistry.
          </p>
          <Link 
            to="/about"
            className="inline-block border border-white/30 text-white px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500"
          >
            Our Story
          </Link>
        </div>
      </section>
    </div>
  );
}
