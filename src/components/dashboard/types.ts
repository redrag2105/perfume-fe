import { z } from 'zod';

// Re-export types from centralized location
export type { 
  Member, 
  Brand, 
  Perfume, 
  PerfumeFormData,
  DeleteDialogState,
  DashboardTab,
} from '@/types';

// Re-export constants
export { initialPerfumeForm } from '@/constants';

// Zod validation schemas (keep here as they're dashboard-specific)
export const perfumeSchema = z.object({
  perfumeName: z.string().min(1, 'Fragrance name is required'),
  uri: z.string().url('Image URL must be a valid URL'),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Price must be a positive number'),
  volume: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Volume must be a positive number'),
  concentration: z.enum(['EDP', 'EDT', 'Extrait', 'Cologne']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  ingredients: z.string().min(3, 'Please list at least a few ingredients'),
  targetAudience: z.enum(['unisex', 'male', 'female']),
  brand: z.string().min(1, 'Please select a maison'),
});

export const brandSchema = z.object({
  brandName: z.string().min(2, 'Brand name must be at least 2 characters'),
});
