import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  perfume: {
    _id: string;
    perfumeName: string;
    uri: string;
    targetAudience: string;
    brandName: string;
    concentration?: string;
  };
  index: number;
}

export default function ProductCard({ perfume, index }: ProductCardProps) {
  const isExtrait = perfume.concentration === 'Extrait';
  
  // Variable heights for masonry visual interest
  const heightVariants = ['h-[400px]', 'h-[480px]', 'h-[360px]', 'h-[420px]', 'h-[500px]'];
  const heightClass = heightVariants[index % heightVariants.length];

  return (
    <div className="masonry-item">
      <Link
        to={`/perfumes/${perfume._id}`}
        className={cn(
          "editorial-card block relative overflow-hidden group cursor-pointer",
          heightClass,
          isExtrait && "extrait-card"
        )}
      >
        {/* Extrait Badge - Top Left */}
        {isExtrait && (
          <span className="extrait-badge">Extrait</span>
        )}

        {/* Image - Fills container */}
        <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center p-8">
          <img
            src={perfume.uri}
            alt={perfume.perfumeName}
            className="w-full h-full object-contain transition-transform duration-1000 ease-out group-hover:scale-110"
          />
        </div>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

        {/* Content - Bottom, appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <p className="text-[10px] text-white/60 uppercase tracking-[0.2em] mb-2">
            {perfume.brandName}
          </p>
          <h2 className="text-xl font-serif text-white mb-2">
            {perfume.perfumeName}
          </h2>
          <p className="text-xs text-white/50 italic capitalize">
            Pour {perfume.targetAudience}
          </p>
        </div>

        {/* Bottom Border Animation */}
        <span className="absolute bottom-0 left-0 h-1 bg-black w-0 group-hover:w-full transition-all duration-700 ease-out" />
      </Link>
    </div>
  );
}
