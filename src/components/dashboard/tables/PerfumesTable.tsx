import { Plus, Pencil, Trash2, Droplet } from 'lucide-react';
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
    <div className="bg-white/70 dark:bg-[#0A0A0A]/70 backdrop-blur-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Header with accent bar */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#C9A86C]/30 to-transparent" />
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-linear-to-br from-[#C9A86C]/20 to-[#C9A86C]/5 dark:from-[#C9A86C]/10 dark:to-[#C9A86C]/5 flex items-center justify-center">
              <Droplet size={18} strokeWidth={1.5} className="text-[#C9A86C]" />
            </div>
            <div>
              <h2 className="text-sm font-medium tracking-widest uppercase text-gray-900 dark:text-white">
                Fragrance Collection
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {filteredPerfumes.length} scent{filteredPerfumes.length !== 1 ? 's' : ''} in catalog
              </p>
            </div>
          </div>
          <button
            onClick={onAdd}
            className="group flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-[#C9A86C] to-[#B89A5C] text-white hover:shadow-lg hover:shadow-[#C9A86C]/20 transition-all duration-300 cursor-pointer"
          >
            <Plus size={14} strokeWidth={1.5} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-[10px] tracking-[0.15em] uppercase font-medium">Add Fragrance</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-gray-800/50">
              <th className="px-6 py-4 text-left text-[9px] tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 font-medium">
                Fragrance
              </th>
              <th className="px-6 py-4 text-left text-[9px] tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 font-medium">
                Maison
              </th>
              <th className="px-6 py-4 text-left text-[9px] tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 font-medium">
                Price
              </th>
              <th className="px-6 py-4 text-left text-[9px] tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 font-medium">
                Type
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
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Droplet size={20} className="text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-400 dark:text-gray-500">No fragrances found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredPerfumes.map((perfume, index) => (
                <tr
                  key={perfume._id}
                  className="group hover:bg-gray-50/80 dark:hover:bg-gray-800/30 transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {perfume.uri ? (
                        <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                          <img src={perfume.uri} alt="" className="w-8 h-8 object-contain" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-linear-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                          <Droplet size={14} className="text-gray-300 dark:text-gray-600" />
                        </div>
                      )}
                      <span className="text-sm text-gray-900 dark:text-white font-medium">
                        {perfume.perfumeName || perfume.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{perfume.brandName}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-white tabular-nums font-light">${perfume.price}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 text-[9px] tracking-widest uppercase font-medium ${
                        perfume.concentration === 'Extrait'
                          ? 'bg-linear-to-r from-[#C9A86C]/15 to-[#C9A86C]/5 text-[#B8974E] dark:from-[#C9A86C]/20 dark:to-[#C9A86C]/10 dark:text-[#C9A86C] border border-[#C9A86C]/20'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {perfume.concentration}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(perfume)}
                        className="p-2.5 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
                        title="Edit"
                      >
                        <Pencil size={14} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => onDelete(perfume._id, perfume.perfumeName || perfume.name)}
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
