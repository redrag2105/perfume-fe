import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export default function Pagination({ pagination, onPageChange, itemLabel = 'items' }: PaginationProps) {
  if (pagination.totalPages <= 1) return null;

  const startItem = ((pagination.currentPage - 1) * pagination.limit) + 1;
  const endItem = Math.min(pagination.currentPage * pagination.limit, pagination.totalCount);

  return (
    <div className="mt-6 flex items-center justify-between bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-gray-800 px-6 py-4">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Showing {startItem} to {endItem} of {pagination.totalCount} {itemLabel}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className="flex items-center gap-1 px-3 py-2 text-[10px] tracking-widest uppercase border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft size={12} strokeWidth={1.5} />
          Previous
        </button>
        <div className="flex items-center gap-1">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "w-8 h-8 text-xs transition-colors cursor-pointer",
                page === pagination.currentPage
                  ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={() => onPageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="flex items-center gap-1 px-3 py-2 text-[10px] tracking-widest uppercase border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Next
          <ChevronRight size={12} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
