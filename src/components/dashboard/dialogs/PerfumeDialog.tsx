import { useState, useEffect, useMemo, useRef } from 'react';
import { X, ImageOff, ChevronDown } from 'lucide-react';
import { perfumeSchema, type Perfume, type Brand, type PerfumeFormData, initialPerfumeForm } from '../types';

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [concentrationOpen, setConcentrationOpen] = useState(false);
  const [targetAudienceOpen, setTargetAudienceOpen] = useState(false);
  const [maisonOpen, setMaisonOpen] = useState(false);
  const concentrationRef = useRef<HTMLDivElement>(null);
  const targetAudienceRef = useRef<HTMLDivElement>(null);
  const maisonRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (concentrationRef.current && !concentrationRef.current.contains(event.target as Node)) {
        setConcentrationOpen(false);
      }
      if (targetAudienceRef.current && !targetAudienceRef.current.contains(event.target as Node)) {
        setTargetAudienceOpen(false);
      }
      if (maisonRef.current && !maisonRef.current.contains(event.target as Node)) {
        setMaisonOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      // Lock body scroll when modal is open
      document.body.style.overflow = 'hidden';
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
      setErrors({});
      setImageError(false);
    } else {
      // Restore body scroll when modal closes
      document.body.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, editingPerfume]);

  // Check if form has changes
  const hasChanges = useMemo(() => {
    return Object.keys(form).some(
      (key) => form[key as keyof PerfumeFormData] !== originalForm[key as keyof PerfumeFormData]
    );
  }, [form, originalForm]);

  // Check if URI is a valid URL for preview
  const isValidImageUrl = useMemo(() => {
    try {
      new URL(form.uri);
      return form.uri.startsWith('http://') || form.uri.startsWith('https://');
    } catch {
      return false;
    }
  }, [form.uri]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = perfumeSchema.safeParse(form);
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) newErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } catch {
      setErrors({ general: 'Failed to save. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof PerfumeFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'uri') {
      setImageError(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-8">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

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
            {/* Image Preview Section */}
            <div className="w-48 shrink-0">
              <label className="block text-[9px] tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 mb-2">
                Preview
              </label>
              <div className="aspect-3/4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                {isValidImageUrl && !imageError ? (
                  <img
                    src={form.uri}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="text-center p-4">
                    <ImageOff size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" strokeWidth={1} />
                    <p className="text-[9px] tracking-wide uppercase text-gray-400 dark:text-gray-500">
                      {form.uri ? 'Invalid URL' : 'No image'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Fragrance Name */}
                <div>
                  <label className="block text-[9px] tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Fragrance Name
                  </label>
                  <input
                    type="text"
                    value={form.perfumeName}
                    onChange={(e) => updateField('perfumeName', e.target.value)}
                    placeholder="e.g., Santal 33"
                    className={`w-full px-4 py-3 border text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors ${
                      errors.perfumeName ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                  {errors.perfumeName && <p className="text-xs text-red-500 mt-1">{errors.perfumeName}</p>}
                </div>

                {/* Image URL - Full Width */}
                <div className="md:col-span-2">
                  <label className="block text-[9px] tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={form.uri}
                    onChange={(e) => updateField('uri', e.target.value)}
                    placeholder="https://..."
                    className={`w-full px-4 py-3 border text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors ${
                      errors.uri ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                  {errors.uri && <p className="text-xs text-red-500 mt-1">{errors.uri}</p>}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-[9px] tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => updateField('price', e.target.value)}
                    placeholder="0.00"
                    className={`w-full px-4 py-3 border text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors ${
                      errors.price ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                  {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                </div>

                {/* Volume */}
                <div>
                  <label className="block text-[9px] tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Volume (ML)
                  </label>
                  <input
                    type="number"
                    value={form.volume}
                    onChange={(e) => updateField('volume', e.target.value)}
                    placeholder="100"
                    className={`w-full px-4 py-3 border text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors ${
                      errors.volume ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                  {errors.volume && <p className="text-xs text-red-500 mt-1">{errors.volume}</p>}
                </div>

                {/* Maison */}
                <div ref={maisonRef}>
                  <label className="block text-[9px] tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Maison
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setMaisonOpen(!maisonOpen)}
                      className={`w-full px-4 py-3 border text-sm bg-white dark:bg-gray-800 focus:outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors cursor-pointer text-left flex items-center justify-between ${
                        errors.brand ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <span className={!form.brand ? 'text-gray-300 dark:text-gray-600' : 'text-gray-900 dark:text-white'}>
                        {brands.find(b => b._id === form.brand)?.brandName || 'Select Maison'}
                      </span>
                      <ChevronDown 
                        className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${maisonOpen ? 'rotate-180' : ''}`} 
                      />
                    </button>
                    <div
                      className={`absolute left-0 top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg z-20 transition-all duration-200 origin-top ${
                        maisonOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                      }`}
                    >
                      <div className="py-1 max-h-48 overflow-y-auto">
                        {brands.map((brand) => (
                          <button
                            type="button"
                            key={brand._id}
                            onClick={() => {
                              updateField('brand', brand._id);
                              setMaisonOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm tracking-wide transition-colors cursor-pointer ${
                              form.brand === brand._id ? 'text-black dark:text-white bg-gray-50 dark:bg-gray-700' : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {brand.brandName}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  {errors.brand && <p className="text-xs text-red-500 mt-1">{errors.brand}</p>}
                </div>

                {/* Concentration */}
                <div ref={concentrationRef}>
                  <label className="block text-[9px] tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Concentration
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setConcentrationOpen(!concentrationOpen)}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors cursor-pointer text-left flex items-center justify-between"
                    >
                      <span>{concentrationOptions.find(o => o.value === form.concentration)?.label || 'Select'}</span>
                      <ChevronDown 
                        className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${concentrationOpen ? 'rotate-180' : ''}`} 
                      />
                    </button>
                    <div
                      className={`absolute left-0 top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg z-20 transition-all duration-200 origin-top ${
                        concentrationOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                      }`}
                    >
                      <div className="py-1">
                        {concentrationOptions.map((option) => (
                          <button
                            type="button"
                            key={option.value}
                            onClick={() => {
                              updateField('concentration', option.value);
                              setConcentrationOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm tracking-wide transition-colors cursor-pointer ${
                              form.concentration === option.value ? 'text-black dark:text-white bg-gray-50 dark:bg-gray-700' : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Target Audience */}
                <div ref={targetAudienceRef}>
                  <label className="block text-[9px] tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Target Audience
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setTargetAudienceOpen(!targetAudienceOpen)}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors cursor-pointer text-left flex items-center justify-between"
                    >
                      <span>{targetAudienceOptions.find(o => o.value === form.targetAudience)?.label || 'Select'}</span>
                      <ChevronDown 
                        className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${targetAudienceOpen ? 'rotate-180' : ''}`} 
                      />
                    </button>
                    <div
                      className={`absolute left-0 top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg z-20 transition-all duration-200 origin-top ${
                        targetAudienceOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                      }`}
                    >
                      <div className="py-1">
                        {targetAudienceOptions.map((option) => (
                          <button
                            type="button"
                            key={option.value}
                            onClick={() => {
                              updateField('targetAudience', option.value);
                              setTargetAudienceOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm tracking-wide transition-colors cursor-pointer ${
                              form.targetAudience === option.value ? 'text-black dark:text-white bg-gray-50 dark:bg-gray-700' : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ingredients */}
                <div>
                  <label className="block text-[9px] tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Ingredients
                  </label>
                  <input
                    type="text"
                    value={form.ingredients}
                    onChange={(e) => updateField('ingredients', e.target.value)}
                    placeholder="Rose, Oud, Vanilla..."
                    className={`w-full px-4 py-3 border text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors ${
                      errors.ingredients ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                  {errors.ingredients && <p className="text-xs text-red-500 mt-1">{errors.ingredients}</p>}
                </div>

                {/* Description - Full Width */}
                <div className="md:col-span-2">
                  <label className="block text-[9px] tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Describe the fragrance..."
                    rows={3}
                    className={`w-full px-4 py-3 border text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors resize-none ${
                      errors.description ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                  {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                </div>
              </div>
            </div>
          </div>

          {errors.general && (
            <p className="text-xs text-red-500 mt-4">{errors.general}</p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
            {/* Change indicator */}
            <div>
              {editingPerfume && (
                <span className={`text-[10px] tracking-wide ${hasChanges ? 'text-[#D4AF37]' : 'text-gray-300 dark:text-gray-600'}`}>
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
                disabled={isSubmitting || !!(editingPerfume && !hasChanges)}
                className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] tracking-[0.15em] uppercase hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
