// Auth API service
import api from './axios';
import type { LoginCredentials, RegisterData, AuthResponse, GoogleCredential } from '@/types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', credentials);
    return res.data;
  },

  register: async (data: RegisterData): Promise<{ message: string }> => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  googleLogin: async (credential: GoogleCredential): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/google', credential);
    return res.data;
  },
};
