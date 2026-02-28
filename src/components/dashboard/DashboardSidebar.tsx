import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, Building2, Droplet, LayoutDashboard, ChevronLeft, LogOut, PanelLeftClose, PanelLeft, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/components/theme-provider';
import type { DashboardTab } from './types';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  stats: {
    members: number;
    brands: number;
    perfumes: number;
  };
  isLoading?: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems: { id: DashboardTab; label: string; icon: typeof Users }[] = [
  { id: 'members', label: 'Clients', icon: Users },
  { id: 'brands', label: 'Maisons', icon: Building2 },
  { id: 'perfumes', label: 'Fragrances', icon: Droplet },
];

export default function DashboardSidebar({ 
  activeTab, 
  onTabChange, 
  stats, 
  isLoading = false,
  isCollapsed,
  onToggleCollapse 
}: DashboardSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <aside className={cn(
      "fixed z-20 left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col transition-all duration-600 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Logo Section */}
      <div className="h-20 flex items-center justify-center border-b border-gray-100 dark:border-gray-800 relative">
        <Link 
          to="/" 
          className={cn(
            "font-serif tracking-tight text-primary dark:text-white hover:opacity-70 transition-opacity",
            isCollapsed ? "text-lg" : "text-2xl"
          )}
        >
          {isCollapsed ? "A" : "AURA"}
        </Link>
        {/* Collapse Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600 transition-colors cursor-pointer shadow-sm"
        >
          {isCollapsed ? (
            <PanelLeft size={12} strokeWidth={1.5} />
          ) : (
            <PanelLeftClose size={12} strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Dashboard Label */}
      <div className={cn(
        "border-b border-gray-100 dark:border-gray-800 transition-all duration-500 overflow-hidden",
        isCollapsed ? "px-2 py-4" : "px-6 py-4"
      )}>
        <div className={cn(
          "flex items-center whitespace-nowrap",
          isCollapsed ? "justify-center" : "gap-2"
        )}>
          <LayoutDashboard size={14} className="text-[#D4AF37] dark:text-[#FFD700] shrink-0" strokeWidth={1.5} />
          <span className={cn(
            "text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] dark:text-[#FFD700] font-medium transition-all duration-500",
            isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          )}>
            Administration
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 py-6 space-y-1 overflow-hidden",
        isCollapsed ? "px-2" : "px-4"
      )}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const count = item.id === 'members' ? stats.members : item.id === 'brands' ? stats.brands : stats.perfumes;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center transition-all duration-200 cursor-pointer group",
                isCollapsed ? "justify-center px-2 py-3" : "justify-between px-4 py-3",
                isActive
                  ? 'bg-gray-700 dark:bg-gray-100 text-white dark:text-gray-900'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <div className={cn(
                "flex items-center whitespace-nowrap",
                isCollapsed ? "" : "gap-3"
              )}>
                <item.icon 
                  size={16} 
                  strokeWidth={1.5} 
                  className={cn("shrink-0", isActive ? 'text-[#c7961a] dark:text-[#8B6914]' : 'text-gray-400 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200')} 
                />
                <span className={cn(
                  "text-xs tracking-widest uppercase font-medium transition-all duration-300",
                  isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                )}>
                  {item.label}
                </span>
              </div>
              <span className={cn(
                "text-[10px] tabular-nums transition-all duration-300",
                isCollapsed ? "opacity-0 w-0" : "opacity-100",
                isLoading ? "animate-pulse bg-gray-200 dark:bg-gray-700 h-3 w-5 rounded" : "",
                isActive ? 'text-gray-400 dark:text-gray-600' : 'text-gray-300 dark:text-gray-600'
              )}>
                {!isLoading && count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className={cn(
        "py-4 border-t border-gray-100 dark:border-gray-800 overflow-hidden",
        isCollapsed ? "px-2" : "px-4"
      )}>
        <Link
          to="/"
          className={cn(
            "flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap",
            isCollapsed ? "justify-center px-2 py-3" : "gap-2 px-4 py-3",
            location.pathname === '/' ? 'pointer-events-none opacity-50' : ''
          )}
          title={isCollapsed ? "Return to Store" : undefined}
        >
          <ChevronLeft size={14} strokeWidth={1.5} className="shrink-0" />
          <span className={cn(
            "text-[10px] tracking-[0.15em] uppercase transition-all duration-300",
            isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          )}>
            Return to Store
          </span>
        </Link>
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={cn(
            "w-full flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap",
            isCollapsed ? "justify-center px-2 py-3" : "gap-2 px-4 py-3"
          )}
          title={isCollapsed ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : undefined}
        >
          <span className="shrink-0">
            {theme === 'dark' ? (
              <Sun size={14} strokeWidth={1.5} />
            ) : (
              <Moon size={14} strokeWidth={1.5} />
            )}
          </span>
          <span className={cn(
            "text-[10px] tracking-[0.15em] uppercase transition-all duration-300",
            isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          )}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-pointer whitespace-nowrap",
            isCollapsed ? "justify-center px-2 py-3" : "gap-2 px-4 py-3"
          )}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut size={14} strokeWidth={1.5} className="shrink-0" />
          <span className={cn(
            "text-[10px] tracking-[0.15em] uppercase transition-all duration-300",
            isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          )}>
            Sign Out
          </span>
        </button>
      </div>

      {/* Decorative Footer */}
      <div className={cn(
        "px-6 py-4 border-t border-gray-100 dark:border-gray-800 transition-all duration-300 ease-in-out",
        isCollapsed ? "opacity-0 h-0 py-0 overflow-hidden" : "opacity-100 h-auto"
      )}>
        <p className="text-[9px] tracking-[0.2em] uppercase text-gray-300 dark:text-gray-600 text-center whitespace-nowrap">
          Maison Management
        </p>
      </div>
    </aside>
  );
}
