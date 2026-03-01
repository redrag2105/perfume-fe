import type { ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DataTableProps {
  // Header props
  title: string;
  subtitle: string;
  addButton?: {
    label: string;
    onClick: () => void;
  };
  // Table content
  columns: number;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  skeletonRows?: number;
  skeletonWidths?: string[];
  // Children
  headerContent: ReactNode;
  children: ReactNode;
}

export function DataTable({
  title,
  subtitle,
  addButton,
  columns,
  isLoading = false,
  isEmpty = false,
  emptyMessage = 'No items found',
  skeletonRows = 5,
  skeletonWidths = [],
  headerContent,
  children,
}: DataTableProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium tracking-widest uppercase text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">{subtitle}</p>
        </div>
        {addButton && (
          <button
            onClick={addButton.onClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <Plus size={14} strokeWidth={1.5} />
            <span className="text-[10px] tracking-[0.15em] uppercase font-medium">{addButton.label}</span>
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
              {headerContent}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Loading skeleton rows
              Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50 dark:border-gray-800">
                  {skeletonWidths.map((width, j) => (
                    <td key={j} className="px-6 py-4">
                      <Skeleton className={`h-4 ${width}`} />
                    </td>
                  ))}
                </tr>
              ))
            ) : isEmpty ? (
              <tr>
                <td colSpan={columns} className="px-6 py-12 text-center">
                  <p className="text-sm text-gray-400 dark:text-gray-400 italic">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Standard non-sortable header cell
export function TableHeader({ 
  children, 
  align = 'left',
  className = ''
}: { 
  children: ReactNode; 
  align?: 'left' | 'right';
  className?: string;
}) {
  return (
    <th className={`px-6 py-4 text-[9px] tracking-[0.2em] uppercase text-gray-400 dark:text-gray-400 font-medium ${align === 'right' ? 'text-right' : 'text-left'} ${className}`}>
      {children}
    </th>
  );
}

// Table row wrapper
export function TableRow({ 
  children, 
  onClick 
}: { 
  children: ReactNode; 
  onClick?: () => void;
}) {
  return (
    <tr
      className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group"
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

// Table cell wrapper
export function TableCell({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <td className={`px-6 py-4 ${className}`}>
      {children}
    </td>
  );
}

// Action buttons container
export function ActionButtons({ children }: { children: ReactNode }) {
  return (
    <td className="px-6 py-4">
      <div className="flex items-center justify-end gap-1">
        {children}
      </div>
    </td>
  );
}

// Edit button
export function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 text-gray-300 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
      title="Edit"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
      </svg>
    </button>
  );
}

// Delete button
export function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 text-gray-300 dark:text-gray-600 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all cursor-pointer"
      title="Delete"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    </button>
  );
}
