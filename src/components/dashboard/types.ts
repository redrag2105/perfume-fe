import { z } from 'zod';

// Zod validation schemas
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

// TypeScript Interfaces
export interface Member {
  _id: string;
  name: string;
  email: string;
  YOB: number;
  gender: boolean;
  isAdmin: boolean;
}

export interface Brand {
  _id: string;
  brandName: string;
}

export interface Perfume {
  _id: string;
  perfumeName: string;
  name: string;
  brandName: string;
  brand: { _id: string; brandName: string } | string;
  price: number;
  volume: number;
  concentration: string;
  description: string;
  ingredients: string;
  targetAudience: string;
  uri: string;
}

export type PerfumeFormData = {
  perfumeName: string;
  uri: string;
  price: string;
  concentration: string;
  description: string;
  ingredients: string;
  volume: string;
  targetAudience: string;
  brand: string;
};

export const initialPerfumeForm: PerfumeFormData = {
  perfumeName: '',
  uri: '',
  price: '',
  concentration: 'EDP',
  description: '',
  ingredients: '',
  volume: '',
  targetAudience: 'unisex',
  brand: '',
};

export type DeleteDialogState = {
  open: boolean;
  type: 'brand' | 'perfume';
  id: string;
  name: string;
};

export type DashboardTab = 'members' | 'brands' | 'perfumes';
