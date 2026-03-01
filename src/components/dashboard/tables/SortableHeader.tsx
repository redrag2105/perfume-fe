import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SortOrder = 'asc' | 'desc';

interface SortableHeaderProps<T extends string> {
  label: string;
  field: T;
  currentSort: T;
  currentOrder: SortOrder;
  onSort: (field: T) => void;
  align?: 'left' | 'right';
}

export function SortableHeader<T extends string>({ 
  label, 
  field, 
  currentSort, 
  currentOrder, 
  onSort,
  align = 'left'
}: SortableHeaderProps<T>) {
  const isActive = currentSort === field;
  
  return (
    <th
      className={cn(
        "px-6 py-4 text-[9px] tracking-[0.2em] uppercase font-medium cursor-pointer select-none transition-colors",
        "hover:text-gray-600 dark:hover:text-gray-200",
        isActive ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-400",
        align === 'right' ? 'text-right' : 'text-left'
      )}
      onClick={() => onSort(field)}
    >
      <div className={cn(
        "flex items-center gap-1",
        align === 'right' && 'justify-end'
      )}>
        {label}
        <span className={cn(
          "transition-opacity",
          isActive ? "opacity-100" : "opacity-0"
        )}>
          {currentOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </span>
      </div>
    </th>
  );
}
