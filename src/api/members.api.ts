// Members API service
import api from './axios';
import type { Member, MemberProfile, UpdateProfileData } from '@/types';
import type { DashboardStats } from '@/types';

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export const membersApi = {
  // Profile endpoints
  getProfile: async (): Promise<MemberProfile> => {
    const res = await api.get<MemberProfile>('/members/profile');
    return res.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<MemberProfile> => {
    const res = await api.put<MemberProfile>('/members/profile', data);
    return res.data;
  },

  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    const res = await api.put('/members/password', data);
    return res.data;
  },

  // Admin/Collector endpoints
  getAllMembers: async (): Promise<Member[]> => {
    const res = await api.get<Member[]>('/collectors');
    return res.data;
  },

  getStats: async (): Promise<DashboardStats> => {
    const res = await api.get<DashboardStats>('/collectors/stats');
    return res.data;
  },
};
