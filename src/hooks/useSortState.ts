import { useState } from 'react';
import type { SortOrder } from '@/components/dashboard/tables/SortableHeader';

export function useSortState<T extends string>(defaultField: T, defaultOrder: SortOrder = 'asc') {
  const [sortBy, setSortBy] = useState<T>(defaultField);
  const [sortOrder, setSortOrder] = useState<SortOrder>(defaultOrder);

  const handleSortChange = (field: T) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return { sortBy, sortOrder, handleSortChange };
}
