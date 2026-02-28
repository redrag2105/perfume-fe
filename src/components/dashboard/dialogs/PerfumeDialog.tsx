import { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { type Perfume, type Brand, type PerfumeFormData, initialPerfumeForm } from '../types';
import { validatePerfumeForm, isPerfumeFormValid } from '@/lib/validation';
import { DropdownSelect, ImagePreview, FormField, TextAreaField } from './components';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

const concentrationOptions = [
  { value: 'EDP', label: 'Eau de Parfum (EDP)' },
  { value: 'EDT', label: 'Eau de Toilette (EDT)' },
  { value: 'Extrait', label: 'Extrait de Parfum' },
  { value: 'Cologne', label: 'Cologne' },
];

const targetAudienceOptions = [
  { value: 'unisex', label: 'Unisex' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

interface PerfumeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PerfumeFormData) => Promise<void>;
  editingPerfume: Perfume | null;
  brands: Brand[];
}

export default function PerfumeDialog({ open, onClose, onSubmit, editingPerfume, brands }: PerfumeDialogProps) {
  const [form, setForm] = useState<PerfumeFormData>(initialPerfumeForm);
  const [originalForm, setOriginalForm] = useState<PerfumeFormData>(initialPerfumeForm);
  const [serverError, setServerError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const errors = useMemo(() => validatePerfumeForm(form), [form]);
  const isFormValid = isPerfumeFormValid(errors);
  
  // Check if form has changes
  const hasChanges = useMemo(() => {
    return Object.keys(form).some(
      (key) => form[key as keyof PerfumeFormData] !== originalForm[key as keyof PerfumeFormData]
    );
  }, [form, originalForm]);

  // Button disabled logic
  const isDisabled = isSubmitting || 
    (hasSubmitted && !isFormValid) || 
    !!(editingPerfume && !hasChanges);

  // Helper to show error only after first submit
  const showError = (field: keyof typeof errors) => hasSubmitted && errors[field];

  // Convert brands to dropdown options
  const brandOptions = useMemo(() => 
    brands.map(b => ({ value: b._id, label: b.brandName })),
    [brands]
  );

  // Lock body scroll when dialog is open
  useLockBodyScroll(open);

  useEffect(() => {
    if (open) {
      if (editingPerfume) {
        const brandId = typeof editingPerfume.brand === 'object' ? editingPerfume.brand._id : editingPerfume.brand;
        const formData: PerfumeFormData = {
          perfumeName: editingPerfume.perfumeName || editingPerfume.name || '',
          uri: editingPerfume.uri || '',
          price: String(editingPerfume.price || ''),
          concentration: editingPerfume.concentration || 'EDP',
          description: editingPerfume.description || '',
          ingredients: editingPerfume.ingredients || '',
          volume: String(editingPerfume.volume || ''),
          targetAudience: editingPerfume.targetAudience || 'unisex',
          brand: brandId || '',
        };
        setForm(formData);
        setOriginalForm(formData);
      } else {
        setForm(initialPerfumeForm);
        setOriginalForm(initialPerfumeForm);
      }
      setServerError('');
      setHasSubmitted(false);
    }
  }, [open, editingPerfume]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    if (!isFormValid) return;

    setServerError('');
    setIsSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } catch {
      setServerError('Failed to save. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof PerfumeFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-8">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-white dark:bg-gray-900 w-full max-w-3xl mx-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-serif text-gray-900 dark:text-white">
            {editingPerfume ? 'Edit Fragrance' : 'Add New Fragrance'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="flex gap-6">
            <ImagePreview uri={form.uri} />

            {/* Form Fields */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  label="Fragrance Name"
                  value={form.perfumeName}
                  onChange={(v) => updateField('perfumeName', v)}
                  placeholder="e.g., Santal 33"
                  error={showError('perfumeName')}
                />

                <FormField
                  label="Image URL"
                  value={form.uri}
                  onChange={(v) => updateField('uri', v)}
                  placeholder="https://..."
                  error={showError('uri')}
                  fullWidth
                />

                <FormField
                  label="Price ($)"
                  type="number"
                  value={form.price}
                  onChange={(v) => updateField('price', v)}
                  placeholder="0.00"
                  error={showError('price')}
                />

                <FormField
                  label="Volume (ML)"
                  type="number"
                  value={form.volume}
                  onChange={(v) => updateField('volume', v)}
                  placeholder="100"
                  error={showError('volume')}
                />

                <DropdownSelect
                  label="Maison"
                  value={form.brand}
                  options={brandOptions}
                  onChange={(v) => updateField('brand', v)}
                  placeholder="Select Maison"
                  error={showError('brand')}
                />

                <DropdownSelect
                  label="Concentration"
                  value={form.concentration}
                  options={concentrationOptions}
                  onChange={(v) => updateField('concentration', v)}
                />

                <DropdownSelect
                  label="Target Audience"
                  value={form.targetAudience}
                  options={targetAudienceOptions}
                  onChange={(v) => updateField('targetAudience', v)}
                />

                <FormField
                  label="Ingredients"
                  value={form.ingredients}
                  onChange={(v) => updateField('ingredients', v)}
                  placeholder="Rose, Oud, Vanilla..."
                />

                <TextAreaField
                  label="Description"
                  value={form.description}
                  onChange={(v) => updateField('description', v)}
                  placeholder="Describe the fragrance..."
                  fullWidth
                />
              </div>
            </div>
          </div>

          {serverError && (
            <p className="text-xs text-red-500 mt-4">{serverError}</p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
            <div>
              {editingPerfume && (
                <span className={`text-[10px] tracking-wide ${hasChanges ? 'text-[#D4AF37] dark:text-[#FFD700]' : 'text-gray-300 dark:text-gray-600'}`}>
                  {hasChanges ? 'Unsaved changes' : 'No changes'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
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
                {isSubmitting ? 'Saving...' : editingPerfume ? 'Save Changes' : 'Add Fragrance'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
