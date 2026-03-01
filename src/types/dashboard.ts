// Dashboard-specific types

export interface DashboardStats {
  membersCount: number;
  brandsCount: number;
  perfumesCount: number;
  activeClientsCount: number;
}

export interface LoadingStates {
  members: boolean;
  brands: boolean;
  perfumes: boolean;
}

export interface DeleteDialogState {
  open: boolean;
  type: 'brand' | 'perfume';
  id: string;
  name: string;
}

export type DashboardTab = 'members' | 'brands' | 'perfumes';
