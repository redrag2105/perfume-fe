// Perfumes API service
import api from './axios';
import type { 
  Perfume, 
  PerfumeDetail, 
  PerfumeListItem, 
  CreatePerfumePayload, 
  CommentData,
  PaginationInfo 
} from '@/types';

interface PerfumesResponse {
  perfumes: PerfumeListItem[];
  pagination: PaginationInfo;
}

interface PerfumesAdminResponse {
  perfumes: Perfume[];
  pagination: PaginationInfo;
}

export const perfumesApi = {
  // Public endpoints
  getAll: async (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    brandName?: string; 
  }): Promise<PerfumesResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.search) searchParams.append('search', params.search);
    if (params?.brandName) searchParams.append('brandName', params.brandName);

    const res = await api.get<PerfumesResponse>(`/perfumes?${searchParams.toString()}`);
    return res.data;
  },

  getById: async (id: string): Promise<PerfumeDetail> => {
    const res = await api.get<PerfumeDetail>(`/perfumes/${id}`);
    return res.data;
  },

  // Admin endpoints
  getForAdmin: async (page = 1, limit = 10): Promise<PerfumesAdminResponse> => {
    const res = await api.get<PerfumesAdminResponse>(`/perfumes?page=${page}&limit=${limit}`);
    return res.data;
  },

  create: async (data: CreatePerfumePayload): Promise<Perfume> => {
    const res = await api.post<Perfume>('/perfumes', data);
    return res.data;
  },

  update: async (id: string, data: CreatePerfumePayload): Promise<Perfume> => {
    const res = await api.put<Perfume>(`/perfumes/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/perfumes/${id}`);
  },

  // Comments
  addComment: async (perfumeId: string, data: CommentData): Promise<{ message: string }> => {
    const res = await api.post(`/perfumes/${perfumeId}/comments`, data);
    return res.data;
  },
};
