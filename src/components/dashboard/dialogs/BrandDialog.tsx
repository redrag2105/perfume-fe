import { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { type Brand } from '../types';
import { validateBrandName } from '@/lib/validation';

interface BrandDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (brandName: string) => Promise<void>;
  editingBrand: Brand | null;
}

export default function BrandDialog({ open, onClose, onSubmit, editingBrand }: BrandDialogProps) {
  const [brandName, setBrandName] = useState('');
  const [originalBrandName, setOriginalBrandName] = useState('');
  const [serverError, setServerError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAddMode = !editingBrand;
  
  // Validation
  const validationError = useMemo(() => validateBrandName(brandName), [brandName]);
  const isFormValid = !validationError;
  const hasChanges = brandName !== originalBrandName;

  // Button disabled logic:
  // - While submitting
  // - After first submit, until form is valid
  // - For editing: also disabled if no changes
  const isDisabled = isSubmitting || 
    (hasSubmitted && !isFormValid) || 
    (!isAddMode && !hasChanges);

  useEffect(() => {
    if (open) {
      const initialName = editingBrand?.brandName || '';
      setBrandName(initialName);
      setOriginalBrandName(initialName);
      setServerError('');
      setHasSubmitted(false);
    }
  }, [open, editingBrand]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    
    if (!isFormValid) return;
    
    setServerError('');
    setIsSubmitting(true);
    try {
      await onSubmit(brandName);
      onClose();
    } catch {
      setServerError('Failed to save. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show validation error only after first submit
  const showError = hasSubmitted && validationError;
  const displayError = showError ? validationError : serverError;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white dark:bg-gray-900 w-full max-w-md mx-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-serif text-gray-900 dark:text-white">
            {editingBrand ? 'Edit Maison' : 'Add New Maison'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[9px] tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 mb-2">
                Brand Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g., Le Labo, Byredo, Diptyque"
                className={`w-full px-4 py-3 border text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors ${
                  displayError ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
                }`}
              />
              {displayError && <p className="text-xs text-red-500 mt-2">{displayError}</p>}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-[10px] tracking-[0.15em] uppercase text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDisabled}
              className="px-6 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[10px] tracking-[0.15em] uppercase hover:bg-gray-800 dark:hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : editingBrand ? 'Save Changes' : 'Add Maison'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
