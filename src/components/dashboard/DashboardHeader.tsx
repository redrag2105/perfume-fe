import { Search } from 'lucide-react';
import type { DashboardTab } from './types';

interface DashboardHeaderProps {
  activeTab: DashboardTab;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const tabConfig: Record<DashboardTab, { title: string; subtitle: string }> = {
  members: {
    title: 'Client Directory',
    subtitle: 'View registered collectors and their information',
  },
  brands: {
    title: 'Maison Registry',
    subtitle: 'Manage luxury fragrance houses',
  },
  perfumes: {
    title: 'Fragrance Collection',
    subtitle: 'Curate and manage the perfume catalog',
  },
};

export default function DashboardHeader({ activeTab, searchQuery, onSearchChange }: DashboardHeaderProps) {
  const config = tabConfig[activeTab];

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-[#0A0A0A] border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-serif text-gray-900 dark:text-white">
            {config.title}
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {config.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600"
              strokeWidth={1.5}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-56 pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-gray-400 dark:focus:border-gray-600 transition-colors"
            />
          </div>
          {/* Admin Badge */}
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
          <span className="text-[9px] tracking-[0.2em] uppercase text-[#C9A86C] font-medium">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}
