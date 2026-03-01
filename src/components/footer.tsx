import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-linear-to-b from-[#FDFAF7] to-[#F8F2EF] border-t border-[#E8DDD6]/50">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="text-2xl font-serif tracking-wide text-[#8B7355] hover:text-[#C9A86C] transition-colors duration-300">
              Pétale
            </Link>
            <p className="mt-4 text-sm text-[#9A8B7A] leading-relaxed max-w-sm">
              Curating the finest fragrances from the world's most prestigious maisons. 
              Each scent tells a story of elegance and grace.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] tracking-[0.15em] uppercase text-[#8B7355] mb-4">Explore</h4>
            <nav className="space-y-3">
              <Link to="/" className="block text-sm text-[#9A8B7A] hover:text-[#C9A86C] transition-all duration-300 hover:translate-x-1">
                Collection
              </Link>
              <Link to="/about" className="block text-sm text-[#9A8B7A] hover:text-[#C9A86C] transition-all duration-300 hover:translate-x-1">
                Maison
              </Link>
            </nav>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-[10px] tracking-[0.15em] uppercase text-[#8B7355] mb-4">Account</h4>
            <nav className="space-y-3">
              <Link to="/login" className="block text-sm text-[#9A8B7A] hover:text-[#C9A86C] transition-all duration-300 hover:translate-x-1">
                Sign In
              </Link>
              <Link to="/register" className="block text-sm text-[#9A8B7A] hover:text-[#C9A86C] transition-all duration-300 hover:translate-x-1">
                Create Account
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#E8DDD6]/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#B8A89A] tracking-wide">
            &copy; {currentYear} Pétale. All rights reserved.
          </p>
          <p className="text-xs text-[#B8A89A] tracking-wide italic">
            Crafted with love
          </p>
        </div>
      </div>
    </footer>
  );
}
