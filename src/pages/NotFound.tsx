import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-6 animate-in fade-in duration-700">
      <h1 className="text-8xl font-serif text-primary mb-4">404</h1>
      <p className="text-xs tracking-[0.4em] uppercase text-gray-500 mb-8">Page Introuvable</p>
      
      <p className="max-w-md text-sm text-gray-500 font-light leading-relaxed mb-10">
        The page you are looking for has been moved, removed, or does not exist. 
        Please return to the boutique to continue your olfactory journey.
      </p>
      
      <Link to="/">
        <Button className="rounded-none bg-black text-white text-xs tracking-widest uppercase h-12 px-10 hover:bg-gray-800 transition-colors">
          Return to Collection
        </Button>
      </Link>
    </div>
  );
}