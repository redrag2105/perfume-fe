import { Users, Building2, Package, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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
  const stats = [
    {
      label: 'Total Clients',
      value: membersCount,
      icon: Users,
      accent: 'text-gray-600',
      highlight: false,
    },
    {
      label: 'Maisons',
      value: brandsCount,
      icon: Building2,
      accent: 'text-gray-600',
      highlight: false,
    },
    {
      label: 'Fragrances',
      value: perfumesCount,
      icon: Package,
      accent: 'text-[#D4AF37] dark:text-[#FFD700]',
      highlight: true,
    },
    {
      label: 'Active',
      value: activeClientsCount,
      icon: TrendingUp,
      accent: 'text-gray-600',
      highlight: false,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`group bg-white dark:bg-gray-900 border transition-all duration-300 ${
              stat.highlight ? 'border-[#D4AF37]/20' : 'border-gray-100 dark:border-gray-800'
            }`}
          >
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className={`h-8 w-16 ${stat.highlight ? 'bg-[#D4AF37]/10' : ''}`} />
                </div>
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            </div>
            <div className={`h-px ${stat.highlight ? 'bg-[#D4AF37]/30' : 'bg-gray-100 dark:bg-gray-800'}`} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`group bg-white dark:bg-gray-900 border transition-all duration-300 hover:shadow-sm ${
            stat.highlight ? 'border-[#D4AF37]/20' : 'border-gray-100 dark:border-gray-800'
          }`}
        >
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 mb-2">
                  {stat.label}
                </p>
                <p className={`text-3xl font-light tracking-tight ${stat.highlight ? 'text-[#D4AF37]' : 'text-gray-900 dark:text-white'}`}>
                  {stat.value}
                </p>
              </div>
              <stat.icon
                size={20}
                strokeWidth={1}
                className={`${stat.accent} opacity-40 group-hover:opacity-70 transition-opacity`}
              />
            </div>
          </div>
          {/* Bottom accent line */}
          <div className={`h-px ${stat.highlight ? 'bg-[#D4AF37]' : 'bg-gray-100'}`} />
        </div>
      ))}
    </div>
  );
}
