import { Users, Building2, Package, TrendingUp, Sparkles } from 'lucide-react';

interface StatsCardsProps {
  membersCount: number;
  brandsCount: number;
  perfumesCount: number;
  activeClientsCount: number;
  isLoading?: boolean;
}

export default function StatsCards({ 
  membersCount, 
  brandsCount, 
  perfumesCount, 
  activeClientsCount,
  isLoading = false 
}: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-12 gap-4">
        {/* Large featured card skeleton */}
        <div className="col-span-12 lg:col-span-5 h-44 bg-linear-to-br from-[#C9A86C]/5 to-[#C9A86C]/10 dark:from-[#C9A86C]/10 dark:to-[#C9A86C]/5 backdrop-blur-sm animate-pulse" />
        {/* Right column skeletons */}
        <div className="col-span-12 lg:col-span-7 grid grid-cols-3 gap-4">
          <div className="h-44 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm animate-pulse" />
          <div className="h-44 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm animate-pulse" />
          <div className="h-44 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Featured Fragrances Card - Larger with gradient */}
      <div className="col-span-12 lg:col-span-5 group relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#C9A86C] via-[#D4B87A] to-[#B89A5C] opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        
        <div className="relative h-44 p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={12} className="text-white/70" />
                <span className="text-[9px] tracking-[0.25em] uppercase text-white/70 font-medium">Featured Metric</span>
              </div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/80 mt-3">Total Fragrances</p>
            </div>
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Package size={20} strokeWidth={1.5} className="text-white" />
            </div>
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <p className="text-5xl font-light text-white tracking-tight">{perfumesCount}</p>
              <p className="text-[10px] text-white/60 mt-1 tracking-wide">In your collection</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 backdrop-blur-sm">
                <TrendingUp size={10} className="text-white/80" />
                <span className="text-[9px] text-white/80 tracking-wide">Growing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Three equal cards */}
      <div className="col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Clients Card */}
        <div className="group h-44 bg-white dark:bg-[#0A0A0A]/80 border border-gray-100 dark:border-gray-800 backdrop-blur-sm hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/20">
          <div className="h-full p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <p className="text-[9px] tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500">Clients</p>
              <div className="w-8 h-8 bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-colors">
                <Users size={16} strokeWidth={1.5} className="text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            <div>
              <p className="text-4xl font-light text-gray-900 dark:text-white tracking-tight">{membersCount}</p>
              <div className="h-1 w-12 bg-linear-to-r from-gray-200 to-transparent dark:from-gray-700 mt-3 group-hover:w-20 transition-all duration-500" />
            </div>
          </div>
        </div>

        {/* Maisons Card */}
        <div className="group h-44 bg-white dark:bg-[#0A0A0A]/80 border border-gray-100 dark:border-gray-800 backdrop-blur-sm hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/20">
          <div className="h-full p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <p className="text-[9px] tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500">Maisons</p>
              <div className="w-8 h-8 bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-colors">
                <Building2 size={16} strokeWidth={1.5} className="text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            <div>
              <p className="text-4xl font-light text-gray-900 dark:text-white tracking-tight">{brandsCount}</p>
              <div className="h-1 w-12 bg-linear-to-r from-gray-200 to-transparent dark:from-gray-700 mt-3 group-hover:w-20 transition-all duration-500" />
            </div>
          </div>
        </div>

        {/* Active Card */}
        <div className="group h-44 bg-linear-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 border border-gray-800 dark:border-gray-700 hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/30">
          <div className="h-full p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <p className="text-[9px] tracking-[0.2em] uppercase text-gray-400">Active Now</p>
              <div className="w-8 h-8 bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <TrendingUp size={16} strokeWidth={1.5} className="text-[#C9A86C]" />
              </div>
            </div>
            <div>
              <p className="text-4xl font-light text-white tracking-tight">{activeClientsCount}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[9px] text-gray-400 tracking-wide">Live tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
