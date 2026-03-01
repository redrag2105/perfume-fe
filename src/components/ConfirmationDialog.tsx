import { AlertTriangle, LogOut, type LucideIcon } from 'lucide-react';

export interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  loadingLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  icon?: LucideIcon;
  darkMode?: boolean;
}

const variantStyles = {
  danger: {
    iconBg: 'bg-red-50 dark:bg-red-950',
    iconColor: 'text-red-500',
    confirmText: 'text-red-600 dark:text-red-500',
    confirmHover: 'hover:bg-red-50 dark:hover:bg-red-950',
  },
  warning: {
    iconBg: 'bg-amber-50 dark:bg-amber-950',
    iconColor: 'text-amber-500',
    confirmText: 'text-amber-600 dark:text-amber-500',
    confirmHover: 'hover:bg-amber-50 dark:hover:bg-amber-950',
  },
  default: {
    iconBg: 'bg-gray-100 dark:bg-gray-800',
    iconColor: 'text-gray-600 dark:text-gray-400',
    confirmText: 'text-gray-900 dark:text-white',
    confirmHover: 'hover:bg-gray-50 dark:hover:bg-gray-800',
  },
};

const defaultIcons: Record<ConfirmationDialogProps['variant'] & string, LucideIcon> = {
  danger: AlertTriangle,
  warning: AlertTriangle,
  default: LogOut,
};

export default function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  loadingLabel,
  variant = 'default',
  icon,
  darkMode = false,
}: ConfirmationDialogProps) {
  if (!open) return null;

  const styles = variantStyles[variant];
  const Icon = icon || defaultIcons[variant];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${darkMode ? 'dark' : ''}`} onClick={(e) => e.stopPropagation()}>
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
            <div className={`w-12 h-12 flex items-center justify-center ${styles.iconBg}`}>
              <Icon size={24} className={styles.iconColor} strokeWidth={1.5} />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-serif text-gray-900 dark:text-white text-center mb-2">
            {title}
          </h2>

          {/* Description */}
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
            {description}
          </div>
        </div>

        {/* Footer */}
        <div className="flex border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-4 text-[10px] tracking-[0.15em] uppercase text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-r border-gray-100 dark:border-gray-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-6 py-4 text-[10px] tracking-[0.15em] uppercase ${styles.confirmText} ${styles.confirmHover} disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer`}
          >
            {isLoading ? (loadingLabel || 'Loading...') : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
