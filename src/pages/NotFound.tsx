import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 bg-[#FAFAFA]">
      <span className="text-[200px] md:text-[300px] font-serif text-black/5 absolute select-none">404</span>
      
      <div className="relative z-10 space-y-8">
        <h1 className="text-7xl md:text-9xl font-serif text-black tracking-tight">404</h1>
        <p className="text-xs tracking-[0.4em] uppercase text-neutral-400">Page Not Found</p>
        
        <p className="max-w-md text-sm text-neutral-500 leading-relaxed mx-auto">
          The page you are looking for has been moved, removed, or does not exist.
        </p>
        
        <Link to="/">
          <Button className="bg-black text-white text-xs tracking-[0.2em] uppercase h-14 px-12 hover:bg-black/80 transition-all">
            Return to Collection
          </Button>
        </Link>
      </div>
    </div>
  );
}
