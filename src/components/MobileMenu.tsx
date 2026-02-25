import { Link, useNavigate } from 'react-router-dom';
import { X, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 md:hidden transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between mb-10">
            <span className="text-xl font-serif tracking-tight">AURA</span>
            <button onClick={onClose} className="p-2 -mr-2 text-foreground cursor-pointer">
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="space-y-6">
            <Link
              to="/"
              onClick={onClose}
              className="block text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Collection
            </Link>
            <Link
              to="/about"
              onClick={onClose}
              className="block text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Maison
            </Link>

            <div className="pt-6 border-t border-gray-100 space-y-6">
              {user ? (
                <>
                  {/* User greeting in mobile */}
                  <p
                    className={`flex items-center gap-1.5 text-xs tracking-wide ${
                      user.isAdmin ? 'text-[#7C3AED]' : 'text-[#B8860B]'
                    }`}
                  >
                    {user.isAdmin && <Shield size={12} strokeWidth={1.5} />}
                    Hello, {user.name?.split(' ')[0] || 'there'}
                  </p>

                  <Link
                    to={user.isAdmin ? '/admin' : '/profile'}
                    onClick={onClose}
                    className="block text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {user.isAdmin ? 'Dashboard' : 'Your Profile'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="block text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={onClose}
                    className="block text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
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
