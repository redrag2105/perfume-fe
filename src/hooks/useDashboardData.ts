import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@/api/axios';
import { toast } from 'sonner';
import type { Member, Brand, Perfume, PerfumeFormData, DashboardTab } from '@/components/dashboard';

interface DashboardStats {
  membersCount: number;
  brandsCount: number;
  perfumesCount: number;
  activeClientsCount: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface LoadingStates {
  members: boolean;
  brands: boolean;
  perfumes: boolean;
}

export function useDashboardData(isAdmin: boolean) {
  // Data States
  const [members, setMembers] = useState<Member[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);

  // Stats state
  const [stats, setStats] = useState<DashboardStats>({
    membersCount: 0,
    brandsCount: 0,
    perfumesCount: 0,
    activeClientsCount: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Pagination state for perfumes
  const [perfumesPagination, setPerfumesPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Loading states per tab
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    members: false,
    brands: false,
    perfumes: false,
  });

  // Track which tabs have been loaded
  const loadedTabs = useRef<Set<DashboardTab>>(new Set());

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await api.get('/collectors/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch data functions
  const fetchMembers = useCallback(async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, members: true }));
      const res = await api.get('/collectors');
      setMembers(res.data);
      loadedTabs.current.add('members');
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, members: false }));
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, brands: true }));
      const res = await api.get('/brands');
      setBrands(res.data);
      loadedTabs.current.add('brands');
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, brands: false }));
    }
  }, []);

  const fetchPerfumes = useCallback(async (page = 1) => {
    try {
      setLoadingStates((prev) => ({ ...prev, perfumes: true }));
      const res = await api.get(`/perfumes?page=${page}&limit=10`);
      setPerfumes(res.data.perfumes);
      setPerfumesPagination(res.data.pagination);
      loadedTabs.current.add('perfumes');
    } catch (error) {
      console.error('Error fetching perfumes:', error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, perfumes: false }));
    }
  }, []);

  // Fetch stats on mount
  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin, fetchStats]);

  // Handle tab-based lazy loading
  const loadTabData = useCallback((tab: DashboardTab) => {
    if (!isAdmin) return;
    
    if (!loadedTabs.current.has(tab)) {
      switch (tab) {
        case 'members':
          fetchMembers();
          break;
        case 'brands':
          fetchBrands();
          break;
        case 'perfumes':
          fetchPerfumes();
          break;
      }
    }
  }, [isAdmin, fetchMembers, fetchBrands, fetchPerfumes]);

  // Handle perfume page change
  const handlePerfumePageChange = useCallback((page: number) => {
    if (page === perfumesPagination.currentPage) return;
    fetchPerfumes(page);
  }, [perfumesPagination.currentPage, fetchPerfumes]);

  // --- BRAND CRUD ---
  const handleBrandSubmit = useCallback(async (brandName: string, editingBrand: Brand | null) => {
    if (editingBrand) {
      await api.put(`/brands/${editingBrand._id}`, { brandName });
      toast.success('Maison updated successfully.');
    } else {
      await api.post('/brands', { brandName });
      toast.success('Maison added to registry.');
    }
    fetchBrands();
    fetchStats();
  }, [fetchBrands, fetchStats]);

  // --- PERFUME CRUD ---
  const fetchPerfumeDetails = useCallback(async (perfumeId: string): Promise<Perfume | null> => {
    try {
      const res = await api.get(`/perfumes/${perfumeId}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching perfume details:', error);
      toast.error('Failed to load perfume details');
      return null;
    }
  }, []);

  const ensureBrandsLoaded = useCallback(async () => {
    if (brands.length === 0 && !loadedTabs.current.has('brands')) {
      await fetchBrands();
    }
  }, [brands.length, fetchBrands]);

  const handlePerfumeSubmit = useCallback(async (data: PerfumeFormData, editingPerfume: Perfume | null) => {
    const payload = {
      ...data,
      price: Number(data.price),
      volume: Number(data.volume),
    };

    if (editingPerfume) {
      await api.put(`/perfumes/${editingPerfume._id}`, payload);
      toast.success('Fragrance updated successfully.');
    } else {
      await api.post('/perfumes', payload);
      toast.success('Fragrance added to collection.');
    }
    fetchPerfumes(perfumesPagination.currentPage);
    fetchStats();
  }, [fetchPerfumes, perfumesPagination.currentPage, fetchStats]);

  // --- DELETE ---
  const handleDelete = useCallback(async (type: 'brand' | 'perfume', id: string): Promise<boolean> => {
    try {
      if (type === 'brand') {
        await api.delete(`/brands/${id}`);
        setBrands((prev) => prev.filter((b) => b._id !== id));
        toast.success('Maison removed from registry.');
      } else {
        await api.delete(`/perfumes/${id}`);
        setPerfumes((prev) => prev.filter((p) => p._id !== id));
        toast.success('Fragrance removed from collection.');
      }
      fetchStats();
      return true;
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
      toast.error(`Failed to remove ${type}. Please try again.`);
      return false;
    }
  }, [fetchStats]);

  return {
    // Data
    members,
    brands,
    perfumes,
    stats,
    perfumesPagination,
    
    // Loading states
    statsLoading,
    loadingStates,
    
    // Actions
    loadTabData,
    handlePerfumePageChange,
    handleBrandSubmit,
    handlePerfumeSubmit,
    handleDelete,
    fetchPerfumeDetails,
    ensureBrandsLoaded,
  };
}
