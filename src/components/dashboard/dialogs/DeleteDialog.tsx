import ConfirmationDialog from '@/components/ConfirmationDialog';
import type { DeleteDialogState } from '@/components/dashboard/types';

interface DeleteDialogProps {
  state: DeleteDialogState;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function DeleteDialog({ state, onClose, onConfirm, isDeleting }: DeleteDialogProps) {
  const typeLabel = state.type === 'brand' ? 'Maison' : 'Fragrance';
  const actionLabel = state.type === 'brand' ? 'delete' : 'remove';

  return (
    <ConfirmationDialog
      open={state.open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`Delete ${typeLabel}`}
      description={
        <>
          Are you sure you want to {actionLabel}{' '}
          <span className="font-medium text-gray-900 dark:text-white">"{state.name}"</span>?
          This action cannot be undone.
        </>
      }
      confirmLabel="Delete"
      isLoading={isDeleting}
      loadingLabel="Deleting..."
      variant="danger"
      darkMode
    />
  );
}
