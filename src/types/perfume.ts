// Perfume-related types

export interface Comment {
  _id: string;
  rating: number;
  content: string;
  author: { _id: string; name: string };
  createdAt: string;
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

export interface PerfumeDetail extends Omit<Perfume, 'brand'> {
  brand: { _id: string; brandName: string };
  comments: Comment[];
}

export interface PerfumeListItem {
  _id: string;
  perfumeName: string;
  uri: string;
  targetAudience: string;
  brandName: string;
  concentration?: string;
  price?: number;
}

export interface PerfumeFormData {
  perfumeName: string;
  uri: string;
  price: string;
  concentration: string;
  description: string;
  ingredients: string;
  volume: string;
  targetAudience: string;
  brand: string;
}

export interface CreatePerfumePayload {
  perfumeName: string;
  uri: string;
  price: number;
  concentration: string;
  description: string;
  ingredients: string;
  volume: number;
  targetAudience: string;
  brand: string;
}

export interface CommentData {
  rating: number;
  content: string;
}

export type ConcentrationType = 'EDP' | 'EDT' | 'Extrait' | 'Cologne';
export type TargetAudienceType = 'unisex' | 'male' | 'female';
