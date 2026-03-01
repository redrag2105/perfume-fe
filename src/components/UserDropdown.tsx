import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import SignOutDialog from '@/components/SignOutDialog';
import { cn } from '@/lib/utils';

interface UserDropdownProps {
  isExpanded?: boolean;
}

export default function UserDropdown({ isExpanded = false }: UserDropdownProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDisplayName = () => {
    if (!user?.name) return 'Account';
    const firstName = user.name.split(' ')[0];
    return firstName.length > 10 ? firstName.slice(0, 10) + '...' : firstName;
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-600 cursor-pointer",
          user.isAdmin 
            ? "text-amber-400/70 hover:text-amber-400 hover:bg-amber-400/10" 
            : "text-white/50 hover:text-white hover:bg-white/5"
        )}
      >
        {user.isAdmin ? (
          <Shield size={18} strokeWidth={1.5} className="shrink-0" />
        ) : (
          <User size={18} strokeWidth={1.5} className="shrink-0" />
        )}
        <span className={cn(
          "text-xs tracking-[0.2em] uppercase font-medium whitespace-nowrap transition-all duration-300",
          isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
        )}>
          {getDisplayName()}
        </span>
      </button>

      {/* Dropdown Menu - Opens Upward, positioned outside sidebar */}
      <div
        className={cn(
          "fixed bottom-20 left-4 w-48 bg-[#1A1A1A] backdrop-blur-xl rounded-xl border border-white/10 transition-all duration-300 origin-bottom-left overflow-hidden z-60",
          isOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
        )}
      >
        <div className="py-2">
          <Link
            to={user.isAdmin ? '/admin' : '/profile'}
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 text-xs tracking-wide text-white/70 hover:text-white hover:bg-white/5 transition-colors duration-300"
          >
            {user.isAdmin ? 'Dashboard' : 'Profile'}
          </Link>
          <SignOutDialog
            trigger={
              <button
                className="w-full text-left px-4 py-3 text-xs tracking-wide text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-colors duration-300 cursor-pointer"
              >
                Sign Out
              </button>
            }
            onSignOut={() => setIsOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}
