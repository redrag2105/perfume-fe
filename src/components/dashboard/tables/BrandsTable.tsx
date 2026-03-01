import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Brand } from '@/components/dashboard/types';

interface BrandsTableProps {
  brands: Brand[];
  searchQuery: string;
  onAdd: () => void;
  onEdit: (brand: Brand) => void;
  onDelete: (id: string, name: string) => void;
  isLoading?: boolean;
}

export default function BrandsTable({ brands, searchQuery, onAdd, onEdit, onDelete, isLoading = false }: BrandsTableProps) {
  const filteredBrands = brands.filter((b) =>
    b.brandName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white/70 dark:bg-[#0A0A0A]/70 backdrop-blur-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Header with accent bar */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#C9A86C]/30 to-transparent" />
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-linear-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
              <Building2 size={18} strokeWidth={1.5} className="text-gray-400" />
            </div>
            <div>
              <h2 className="text-sm font-medium tracking-widest uppercase text-gray-900 dark:text-white">
                Maison Registry
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {filteredBrands.length} luxury house{filteredBrands.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onAdd}
            className="group flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 hover:shadow-lg hover:shadow-gray-900/20 dark:hover:shadow-white/10 transition-all duration-300 cursor-pointer"
          >
            <Plus size={14} strokeWidth={1.5} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-[10px] tracking-[0.15em] uppercase font-medium">Add Maison</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-gray-800/50">
              <th className="px-6 py-4 text-left text-[9px] tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 font-medium">
                Brand Name
              </th>
              <th className="px-6 py-4 text-right text-[9px] tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 font-medium w-32">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </td>
                </tr>
              ))
            ) : filteredBrands.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Building2 size={20} className="text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-400 dark:text-gray-500">No maisons found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredBrands.map((brand, index) => (
                <tr
                  key={brand._id}
                  className="group hover:bg-gray-50/80 dark:hover:bg-gray-800/30 transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-linear-to-br from-[#C9A86C]/20 to-[#C9A86C]/5 dark:from-[#C9A86C]/10 dark:to-[#C9A86C]/5 flex items-center justify-center text-xs font-medium text-[#C9A86C]">
                        {brand.brandName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white font-medium group-hover:text-[#C9A86C] transition-colors">{brand.brandName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(brand)}
                        className="p-2.5 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
                        title="Edit"
                      >
                        <Pencil size={14} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => onDelete(brand._id, brand.brandName)}
                        className="p-2.5 text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
