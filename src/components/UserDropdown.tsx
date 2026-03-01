import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import SignOutDialog from '@/components/SignOutDialog';

export default function UserDropdown() {
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
    return firstName.length > 12 ? firstName.slice(0, 12) + '...' : firstName;
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase transition-colors cursor-pointer font-semibold ${
          user.isAdmin ? 'text-[#224470] hover:text-[#12345d]' : 'text-[#B8860B] hover:text-[#977317]'
        }`}
      >
        {user.isAdmin && <Shield size={12} strokeWidth={1.5} className="mr-0.5" />}
        <span>{getDisplayName()}</span>
        <ChevronDown
          size={12}
          strokeWidth={1.5}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 top-full mt-3 w-44 bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.1)] transition-all duration-200 origin-top-right ${
          isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
        }`}
      >
        {/* Decorative top line */}
        <span
          className={`absolute -top-px left-1/2 -translate-x-1/2 h-px bg-black/35 transition-all duration-300 ease-out ${
            isOpen ? 'w-[calc(100%-2rem)]' : 'w-0'
          }`}
        />

        <div className="py-2">
          <Link
            to={user.isAdmin ? '/admin' : '/profile'}
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2.5 text-xs tracking-wide text-gray-600 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {user.isAdmin ? 'Dashboard' : 'Your Profile'}
          </Link>
          <SignOutDialog
            trigger={
              <button
                className="w-full text-left px-4 py-2.5 text-xs tracking-wide text-gray-600 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer"
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
