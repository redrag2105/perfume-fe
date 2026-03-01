import { Link } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  currentPath: string;
}

export default function NavLink({ to, children, className = '', currentPath }: NavLinkProps) {
  const isActive = currentPath === to;
  return (
    <Link
      to={to}
      className={`group/link relative text-[11px] tracking-[0.15em] uppercase transition-colors duration-500 ${
        isActive ? 'text-[#8B7355]' : 'text-[#9A8B7A] hover:text-[#C9A86C]'
      } ${className}`}
    >
      {children}
      {/* Animated underline - champagne gold, expands from center */}
      <span
        className={`absolute -bottom-1 left-1/2 h-px bg-[#C9A86C] transition-all duration-500 ease-out ${
          isActive ? 'w-full -translate-x-1/2' : 'w-0 -translate-x-1/2 group-hover/link:w-full'
        }`}
      />
    </Link>
  );
}
