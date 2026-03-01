import { Link } from 'react-router-dom';
import { X, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import SignOutDialog from '@/components/SignOutDialog';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user } = useAuth();

  return (
    <>
      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#8B7355]/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-linear-to-b from-[#FDFAF7] to-[#F8F2EF] z-50 md:hidden transform transition-transform duration-500 ease-out shadow-[10px_0_30px_rgba(201,168,108,0.1)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between mb-10">
            <span className="text-xl font-serif tracking-wide text-[#8B7355]">Pétale</span>
            <button onClick={onClose} className="p-2 -mr-2 text-[#9A8B7A] hover:text-[#8B7355] cursor-pointer transition-colors">
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="space-y-6">
            <Link
              to="/"
              onClick={onClose}
              className="block text-xs tracking-[0.15em] uppercase text-[#9A8B7A] hover:text-[#C9A86C] transition-colors duration-300"
            >
              Collection
            </Link>
            <Link
              to="/about"
              onClick={onClose}
              className="block text-xs tracking-[0.15em] uppercase text-[#9A8B7A] hover:text-[#C9A86C] transition-colors duration-300"
            >
              Maison
            </Link>

            <div className="pt-6 border-t border-[#E8DDD6]/50 space-y-6">
              {user ? (
                <>
                  {/* User greeting in mobile */}
                  <p
                    className={`flex items-center gap-1.5 text-xs tracking-wide ${
                      user.isAdmin ? 'text-[#7C3AED]' : 'text-[#C9A86C]'
                    }`}
                  >
                    {user.isAdmin && <Shield size={12} strokeWidth={1.5} />}
                    Hello, {user.name?.split(' ')[0] || 'there'}
                  </p>

                  <Link
                    to={user.isAdmin ? '/admin' : '/profile'}
                    onClick={onClose}
                    className="block text-xs tracking-[0.15em] uppercase text-[#9A8B7A] hover:text-[#C9A86C] transition-colors duration-300"
                  >
                    {user.isAdmin ? 'Dashboard' : 'Your Profile'}
                  </Link>
                  <SignOutDialog
                    trigger={
                      <button
                        className="block text-xs tracking-[0.15em] uppercase text-[#9A8B7A] hover:text-[#C9A86C] transition-colors duration-300 cursor-pointer"
                      >
                        Sign Out
                      </button>
                    }
                    onSignOut={onClose}
                  />
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="block text-xs tracking-[0.15em] uppercase text-[#9A8B7A] hover:text-[#C9A86C] transition-colors duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={onClose}
                    className="block text-xs tracking-[0.15em] uppercase text-[#9A8B7A] hover:text-[#C9A86C] transition-colors duration-300"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
