import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Perfume } from '@/components/dashboard/types';

interface PerfumesTableProps {
  perfumes: Perfume[];
  searchQuery: string;
  onAdd: () => void;
  onEdit: (perfume: Perfume) => void;
  onDelete: (id: string, name: string) => void;
  isLoading?: boolean;
}

export default function PerfumesTable({ perfumes, searchQuery, onAdd, onEdit, onDelete, isLoading = false }: PerfumesTableProps) {
  const filteredPerfumes = perfumes.filter(
    (p) =>
      (p.perfumeName || p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brandName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium tracking-widest uppercase text-gray-900 dark:text-white">
            Fragrance Collection
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">Manage the perfume catalog</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <Plus size={14} strokeWidth={1.5} />
          <span className="text-[10px] tracking-[0.15em] uppercase font-medium">Add Fragrance</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
              <th className="px-6 py-4 text-left text-[9px] tracking-[0.2em] uppercase text-gray-400 dark:text-gray-400 font-medium">
                Fragrance
              </th>
              <th className="px-6 py-4 text-left text-[9px] tracking-[0.2em] uppercase text-gray-400 dark:text-gray-400 font-medium">
                Maison
              </th>
              <th className="px-6 py-4 text-left text-[9px] tracking-[0.2em] uppercase text-gray-400 dark:text-gray-400 font-medium">
                Price
              </th>
              <th className="px-6 py-4 text-left text-[9px] tracking-[0.2em] uppercase text-gray-400 dark:text-gray-400 font-medium">
                Type
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
                  <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-5 w-14" /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </td>
                </tr>
              ))
            ) : filteredPerfumes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <p className="text-sm text-gray-400 dark:text-gray-400 italic">No fragrances found</p>
                </td>
              </tr>
            ) : (
              filteredPerfumes.map((perfume) => (
                <tr
                  key={perfume._id}
                  className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-white font-medium">
                      {perfume.perfumeName || perfume.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{perfume.brandName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white tabular-nums">${perfume.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-[9px] tracking-widest uppercase ${
                        perfume.concentration === 'Extrait'
                          ? 'bg-[#D4AF37]/10 text-[#B8860B] dark:bg-[#FFD700]/20 dark:text-[#FFD700]'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {perfume.concentration}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(perfume)}
                        className="p-2 text-gray-300 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
                        title="Edit"
                      >
                        <Pencil size={14} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => onDelete(perfume._id, perfume.perfumeName || perfume.name)}
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
