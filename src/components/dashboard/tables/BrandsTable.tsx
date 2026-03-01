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
import type { Brand } from '@/components/dashboard/types';

type SortField = 'brandName';

interface BrandsTableProps {
  brands: Brand[];
  searchQuery: string;
  onAdd: () => void;
  onEdit: (brand: Brand) => void;
  onDelete: (id: string, name: string) => void;
  isLoading?: boolean;
}

export default function BrandsTable({ brands, searchQuery, onAdd, onEdit, onDelete, isLoading = false }: BrandsTableProps) {
  const { sortBy, sortOrder, handleSortChange } = useSortState<SortField>('brandName');

  const sortedBrands = useMemo(() => {
    const filtered = brands.filter((b) =>
      b.brandName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      const comparison = a.brandName.localeCompare(b.brandName);
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [brands, searchQuery, sortOrder]);

  return (
    <DataTable
      title="Maison Registry"
      subtitle="Manage luxury fragrance houses"
      addButton={{ label: 'Add Maison', onClick: onAdd }}
      columns={2}
      isLoading={isLoading}
      isEmpty={sortedBrands.length === 0}
      emptyMessage="No maisons found"
      skeletonWidths={['w-40', 'w-20']}
      headerContent={
        <>
          <SortableHeader label="Brand Name" field="brandName" currentSort={sortBy} currentOrder={sortOrder} onSort={handleSortChange} />
          <TableHeader align="right" className="w-32">Actions</TableHeader>
        </>
      }
    >
      {sortedBrands.map((brand) => (
        <TableRow key={brand._id}>
          <TableCell>
            <span className="text-sm text-gray-900 dark:text-white font-medium">{brand.brandName}</span>
          </TableCell>
          <TableCell>
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
          </TableCell>
        </TableRow>
      ))}
    </DataTable>
  );
}
