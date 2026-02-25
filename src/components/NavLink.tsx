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
      className={`group/link relative text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 ${
        isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
      } ${className}`}
    >
      {children}
      {/* Animated underline - expands from center */}
      <span
        className={`absolute -bottom-1 left-1/2 h-px bg-foreground transition-all duration-300 ease-out ${
          isActive ? 'w-full -translate-x-1/2' : 'w-0 -translate-x-1/2 group-hover/link:w-full'
        }`}
      />
    </Link>
  );
}
