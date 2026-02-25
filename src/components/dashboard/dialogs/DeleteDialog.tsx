import { AlertTriangle } from 'lucide-react';
import type { DeleteDialogState } from '../types';

interface DeleteDialogProps {
  state: DeleteDialogState;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function DeleteDialog({ state, onClose, onConfirm, isDeleting }: DeleteDialogProps) {
  if (!state.open) return null;

  const typeLabel = state.type === 'brand' ? 'Maison' : 'Fragrance';
  const actionLabel = state.type === 'brand' ? 'delete' : 'remove';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white dark:bg-gray-900 w-full max-w-sm mx-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-12 h-12 flex items-center justify-center bg-red-50 dark:bg-red-950">
              <AlertTriangle size={24} className="text-red-500" strokeWidth={1.5} />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-serif text-gray-900 dark:text-white text-center mb-2">
            Delete {typeLabel}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Are you sure you want to {actionLabel}{' '}
            <span className="font-medium text-gray-900 dark:text-white">"{state.name}"</span>?
            This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="flex border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 text-[10px] tracking-[0.15em] uppercase text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-r border-gray-100 dark:border-gray-800 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-6 py-4 text-[10px] tracking-[0.15em] uppercase text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
