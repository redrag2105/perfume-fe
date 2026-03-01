import { useMemo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { 
  DataTable, 
  TableRow, 
  TableCell, 
  TableHeader,
} from './DataTable';
import { SortableHeader } from './SortableHeader';
import { useSortState } from '@/hooks/useSortState';
import type { Perfume } from '@/components/dashboard/types';

type SortField = 'name' | 'price' | 'brand';

interface PerfumesTableProps {
  perfumes: Perfume[];
  searchQuery: string;
  onAdd: () => void;
  onEdit: (perfume: Perfume) => void;
  onDelete: (id: string, name: string) => void;
  isLoading?: boolean;
}

export default function PerfumesTable({ 
  perfumes, 
  searchQuery, 
  onAdd, 
  onEdit, 
  onDelete, 
  isLoading = false,
}: PerfumesTableProps) {
  const { sortBy, sortOrder, handleSortChange } = useSortState<SortField>('name');

  const sortedPerfumes = useMemo(() => {
    const filtered = perfumes.filter(
      (p) =>
        (p.perfumeName || p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.brandName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortBy) {
        case 'name':
          aVal = (a.perfumeName || a.name || '').toLowerCase();
          bVal = (b.perfumeName || b.name || '').toLowerCase();
          break;
        case 'brand':
          aVal = (a.brandName || '').toLowerCase();
          bVal = (b.brandName || '').toLowerCase();
          break;
        case 'price':
          aVal = a.price || 0;
          bVal = b.price || 0;
          break;
        default:
          aVal = (a.perfumeName || a.name || '').toLowerCase();
          bVal = (b.perfumeName || b.name || '').toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [perfumes, searchQuery, sortBy, sortOrder]);

  return (
    <DataTable
      title="Fragrance Collection"
      subtitle="Manage the perfume catalog"
      addButton={{ label: 'Add Fragrance', onClick: onAdd }}
      columns={5}
      isLoading={isLoading}
      isEmpty={sortedPerfumes.length === 0}
      emptyMessage="No fragrances found"
      skeletonWidths={['w-32', 'w-24', 'w-16', 'w-14', 'w-20']}
      headerContent={
        <>
          <SortableHeader label="Fragrance" field="name" currentSort={sortBy} currentOrder={sortOrder} onSort={handleSortChange} />
          <SortableHeader label="Maison" field="brand" currentSort={sortBy} currentOrder={sortOrder} onSort={handleSortChange} />
          <SortableHeader label="Price" field="price" currentSort={sortBy} currentOrder={sortOrder} onSort={handleSortChange} />
          <TableHeader>Type</TableHeader>
          <TableHeader align="right" className="w-32">Actions</TableHeader>
        </>
      }
    >
      {sortedPerfumes.map((perfume) => (
        <TableRow key={perfume._id}>
          <TableCell>
            <span className="text-sm text-gray-900 dark:text-white font-medium">
              {perfume.perfumeName || perfume.name}
            </span>
          </TableCell>
          <TableCell className="text-sm text-gray-500 dark:text-gray-300">{perfume.brandName}</TableCell>
          <TableCell className="text-sm text-gray-900 dark:text-white tabular-nums">${perfume.price}</TableCell>
          <TableCell>
            <span
              className={`inline-block px-2 py-1 text-[9px] tracking-widest uppercase ${
                perfume.concentration === 'Extrait'
                  ? 'bg-[#D4AF37]/10 text-[#B8860B] dark:bg-[#FFD700]/20 dark:text-[#FFD700]'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              {perfume.concentration}
            </span>
          </TableCell>
          <TableCell>
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
          </TableCell>
        </TableRow>
      ))}
    </DataTable>
  );
}
