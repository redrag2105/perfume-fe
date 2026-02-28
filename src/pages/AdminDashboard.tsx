import { useState, useEffect, useCallback, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import {
  DashboardSidebar,
  DashboardHeader,
  StatsCards,
  MembersTable,
  BrandsTable,
  PerfumesTable,
  BrandDialog,
  PerfumeDialog,
  DeleteDialog,
  Pagination,
  type Brand,
  type Perfume,
  type PerfumeFormData,
  type DeleteDialogState,
  type DashboardTab,
} from '@/components/dashboard';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isAdmin = user?.isAdmin ?? false;

  // Compute effective theme for scoped dark mode
  const isDark = useMemo(() => {
    if (theme === 'dark') return true;
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }, [theme]);

  // Use the dashboard data hook
  const {
    members,
    brands,
    perfumes,
    stats,
    perfumesPagination,
    statsLoading,
    loadingStates,
    loadTabData,
    handlePerfumePageChange,
    handleBrandSubmit,
    handlePerfumeSubmit,
    handleDelete,
    fetchPerfumeDetails,
    ensureBrandsLoaded,
  } = useDashboardData(isAdmin);

  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<DashboardTab>('members');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Dialog States
  const [brandDialogOpen, setBrandDialogOpen] = useState(false);
  const [perfumeDialogOpen, setPerfumeDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [editingPerfume, setEditingPerfume] = useState<Perfume | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    type: 'brand',
    id: '',
    name: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Load initial tab data on mount
  useEffect(() => {
    loadTabData('members');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle tab change - sets tab, resets search, and loads data
  const handleTabChange = useCallback((tab: DashboardTab) => {
    setActiveTab(tab);
    setSearchQuery('');
    loadTabData(tab);
  }, [loadTabData]);

  // --- BRAND HANDLERS ---
  const openBrandDialog = useCallback((brand?: Brand) => {
    setEditingBrand(brand || null);
    setBrandDialogOpen(true);
  }, []);

  const onBrandSubmit = useCallback(async (brandName: string) => {
    await handleBrandSubmit(brandName, editingBrand);
  }, [handleBrandSubmit, editingBrand]);

  // --- PERFUME HANDLERS ---
  const openPerfumeDialog = useCallback(async (perfume?: Perfume) => {
    await ensureBrandsLoaded();
    
    if (perfume) {
      const details = await fetchPerfumeDetails(perfume._id);
      if (!details) return;
      setEditingPerfume(details);
    } else {
      setEditingPerfume(null);
    }
    setPerfumeDialogOpen(true);
  }, [ensureBrandsLoaded, fetchPerfumeDetails]);

  const onPerfumeSubmit = useCallback(async (data: PerfumeFormData) => {
    await handlePerfumeSubmit(data, editingPerfume);
  }, [handlePerfumeSubmit, editingPerfume]);

  // --- DELETE HANDLERS ---
  const openDeleteDialog = useCallback((type: 'brand' | 'perfume', id: string, name: string) => {
    setDeleteDialog({ open: true, type, id, name });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    setIsDeleting(true);
    await handleDelete(deleteDialog.type, deleteDialog.id);
    setIsDeleting(false);
    setDeleteDialog((prev) => ({ ...prev, open: false }));
  }, [handleDelete, deleteDialog.type, deleteDialog.id]);

  // Security check
  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={cn(
      "h-screen overflow-y-auto bg-[#FAFAFA] dark:bg-gray-950 transition-colors duration-300",
      isDark && "dark"
    )}>
      {/* Sidebar */}
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        stats={{
          members: stats.membersCount,
          brands: stats.brandsCount,
          perfumes: stats.perfumesCount,
        }}
        isLoading={statsLoading}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <main className={cn(
        "transition-all duration-600 relative z-0",
        sidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        {/* Header */}
        <DashboardHeader
          activeTab={activeTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Content */}
        <div className="p-8">
          {/* Stats Cards */}
          <div className="mb-8">
            <StatsCards
              membersCount={stats.membersCount}
              brandsCount={stats.brandsCount}
              perfumesCount={stats.perfumesCount}
              activeClientsCount={stats.activeClientsCount}
              isLoading={statsLoading}
            />
          </div>

          {/* Tab Content */}
          {activeTab === 'members' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <MembersTable members={members} searchQuery={searchQuery} isLoading={loadingStates.members} />
            </div>
          )}

          {activeTab === 'brands' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <BrandsTable
                brands={brands}
                searchQuery={searchQuery}
                onAdd={() => openBrandDialog()}
                onEdit={openBrandDialog}
                onDelete={(id, name) => openDeleteDialog('brand', id, name)}
                isLoading={loadingStates.brands}
              />
            </div>
          )}

          {activeTab === 'perfumes' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <PerfumesTable
                perfumes={perfumes}
                searchQuery={searchQuery}
                onAdd={() => openPerfumeDialog()}
                onEdit={openPerfumeDialog}
                onDelete={(id, name) => openDeleteDialog('perfume', id, name)}
                isLoading={loadingStates.perfumes}
              />
              <Pagination
                pagination={perfumesPagination}
                onPageChange={handlePerfumePageChange}
                itemLabel="fragrances"
              />
            </div>
          )}
        </div>
      </main>

      {/* Dialogs */}
      <BrandDialog
        open={brandDialogOpen}
        onClose={() => setBrandDialogOpen(false)}
        onSubmit={onBrandSubmit}
        editingBrand={editingBrand}
      />

      <PerfumeDialog
        open={perfumeDialogOpen}
        onClose={() => setPerfumeDialogOpen(false)}
        onSubmit={onPerfumeSubmit}
        editingPerfume={editingPerfume}
        brands={brands}
      />

      <DeleteDialog
        state={deleteDialog}
        onClose={() => setDeleteDialog((prev) => ({ ...prev, open: false }))}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
