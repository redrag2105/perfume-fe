import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="text-2xl font-serif tracking-tight text-primary">
              AURA
            </Link>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-sm">
              Curating the finest fragrances from the world's most prestigious maisons. 
              Each scent tells a story.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-gray-900 mb-4">Explore</h4>
            <nav className="space-y-3">
              <Link to="/" className="block text-sm text-gray-500 hover:text-gray-900 transition-all duration-300 hover:translate-x-1">
                Collection
              </Link>
              <Link to="/about" className="block text-sm text-gray-500 hover:text-gray-900 transition-all duration-300 hover:translate-x-1">
                Maison
              </Link>
            </nav>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-gray-900 mb-4">Account</h4>
            <nav className="space-y-3">
              <Link to="/login" className="block text-sm text-gray-500 hover:text-gray-900 transition-all duration-300 hover:translate-x-1">
                Sign In
              </Link>
              <Link to="/register" className="block text-sm text-gray-500 hover:text-gray-900 transition-all duration-300 hover:translate-x-1">
                Create Account
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 tracking-wide">
            &copy; {currentYear} Aura. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 tracking-wide">
            Crafted with care
          </p>
        </div>
      </div>
    </footer>
  );
}
