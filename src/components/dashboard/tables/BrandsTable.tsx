import { Plus, Pencil, Trash2 } from 'lucide-react';
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
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium tracking-widest uppercase text-gray-900 dark:text-white">
            Maison Registry
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">Manage luxury fragrance houses</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <Plus size={14} strokeWidth={1.5} />
          <span className="text-[10px] tracking-[0.15em] uppercase font-medium">Add Maison</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
              <th className="px-6 py-4 text-left text-[9px] tracking-[0.2em] uppercase text-gray-400 dark:text-gray-400 font-medium">
                Brand Name
              </th>
              <th className="px-6 py-4 text-right text-[9px] tracking-[0.2em] uppercase text-gray-400 dark:text-gray-400 font-medium w-32">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50 dark:border-gray-800">
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
                <td colSpan={2} className="px-6 py-12 text-center">
                  <p className="text-sm text-gray-400 dark:text-gray-400 italic">No maisons found</p>
                </td>
              </tr>
            ) : (
              filteredBrands.map((brand) => (
                <tr
                  key={brand._id}
                  className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{brand.brandName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(brand)}
                        className="p-2 text-gray-300 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
                        title="Edit"
                      >
                        <Pencil size={14} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => onDelete(brand._id, brand.brandName)}
                        className="p-2 text-gray-300 dark:text-gray-600 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all cursor-pointer"
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
