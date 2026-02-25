import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu, X } from 'lucide-react';
import NavLink from './NavLink';
import UserDropdown from './UserDropdown';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className={`sticky top-0 z-50 bg-white border-b transition-all duration-500 ease-out ${
        scrolled 
          ? 'border-transparent shadow-[0_1px_3px_rgba(0,0,0,0.08)]' 
          : 'border-gray-100 shadow-none'
      }`}>
        <div className="container mx-auto px-6">
          <div className="h-16 md:h-20 flex items-center justify-between">
            
            {/* Left Links - Desktop */}
            <div className="hidden md:flex flex-1 items-center gap-10">
              <NavLink to="/" currentPath={location.pathname}>Collection</NavLink>
              <NavLink to="/about" currentPath={location.pathname}>About</NavLink>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -ml-2 text-foreground cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>

            {/* Center Logo */}
            <div className="flex-1 flex justify-center">
              <Link 
                to="/" 
                className="text-2xl md:text-3xl font-serif tracking-tight text-primary hover:opacity-80 transition-opacity"
              >
                AURA
              </Link>
            </div>

            {/* Right Links - Desktop */}
            <div className="hidden md:flex flex-1 justify-end items-center gap-8">
              {user ? (
                <UserDropdown />
              ) : (
                <NavLink to="/login" currentPath={location.pathname}>Sign In</NavLink>
              )}
            </div>

            {/* Mobile Right Placeholder (for centering logo) */}
            <div className="md:hidden w-10" />
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={mobileMenuOpen} onClose={closeMobileMenu} />
    </>
  );
}