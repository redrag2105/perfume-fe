import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Home, Info, LogIn, LayoutDashboard, Menu, X } from 'lucide-react';
import UserDropdown from './UserDropdown';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Collection', icon: Home },
  { path: '/about', label: 'About Us', icon: Info },
];

export default function SideNav() {
  const location = useLocation();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setMobileOpen(true)}
        className="fixed top-6 left-6 z-50 md:hidden w-12 h-12 bg-black text-white flex items-center justify-center rounded-full shadow-2xl hover:scale-105 transition-transform"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)} 
        />
      )}

      {/* Side Navigation */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-screen bg-[#0A0A0A] z-50 flex flex-col transition-all duration-600 ease-in-out",
          "md:translate-x-0",
          mobileOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0",
          !mobileOpen && (isExpanded ? "md:w-72" : "md:w-20")
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Mobile Close */}
        <button 
          onClick={() => setMobileOpen(false)}
          className="absolute top-6 right-6 text-white/60 hover:text-white md:hidden"
        >
          <X size={20} />
        </button>

        {/* Brand */}
        <div className="h-28 flex items-center justify-center border-b border-white/5 overflow-hidden">
          <Link to="/" className="text-white" onClick={() => setMobileOpen(false)}>
            <span className={cn(
              "font-serif transition-all duration-500 ease-in-out block",
              isExpanded || mobileOpen ? "text-2xl tracking-[0.2em]" : "text-3xl tracking-tight"
            )}>
              {isExpanded || mobileOpen ? "PÉTALE" : "P"}
            </span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-8 flex flex-col gap-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group/item",
                isActive(item.path) 
                  ? "bg-white text-black" 
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={18} strokeWidth={1.5} className="shrink-0" />
              <span className={cn(
                "text-xs tracking-[0.2em] uppercase font-medium whitespace-nowrap transition-all duration-700",
                isExpanded || mobileOpen ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
              )}>
                {item.label}
              </span>
            </Link>
          ))}

          {/* Admin Link */}
          {user?.isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 mt-4 border border-dashed",
                isActive('/admin') 
                  ? "bg-amber-400 text-black border-transparent" 
                  : "text-amber-400/70 border-amber-400/30 hover:text-amber-400 hover:bg-amber-400/10"
              )}
            >
              <LayoutDashboard size={18} strokeWidth={1.5} className="shrink-0" />
              <span className={cn(
                "text-xs tracking-[0.2em] uppercase font-medium whitespace-nowrap transition-all duration-700",
                isExpanded || mobileOpen ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
              )}>
                Dashboard
              </span>
            </Link>
          )}
        </nav>

        {/* Bottom Section - User */}
        <div className="p-4 border-t border-white/5">
          {user ? (
            <UserDropdown isExpanded={isExpanded || mobileOpen} />
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-4 px-4 py-4 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all"
            >
              <LogIn size={18} strokeWidth={1.5} className="shrink-0" />
              <span className={cn(
                "text-xs tracking-[0.2em] uppercase font-medium whitespace-nowrap transition-all duration-600",
                isExpanded || mobileOpen ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
              )}>
                Sign In
              </span>
            </Link>
          )}
        </div>

        {/* Decorative Line */}
        <div className="absolute right-0 top-0 h-full w-px bg-linear-to-b from-transparent via-white/10 to-transparent" />
      </aside>
    </>
  );
}
