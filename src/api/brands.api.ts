// Brands API service
import api from './axios';
import type { Brand, CreateBrandData, UpdateBrandData } from '@/types';

export const brandsApi = {
  getAll: async (): Promise<Brand[]> => {
    const res = await api.get<Brand[]>('/brands');
    return res.data;
  },

  getById: async (id: string): Promise<Brand> => {
    const res = await api.get<Brand>(`/brands/${id}`);
    return res.data;
  },

  create: async (data: CreateBrandData): Promise<Brand> => {
    const res = await api.post<Brand>('/brands', data);
    return res.data;
  },

  update: async (id: string, data: UpdateBrandData): Promise<Brand> => {
    const res = await api.put<Brand>(`/brands/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/brands/${id}`);
  },
};
